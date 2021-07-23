const dotenv = require('dotenv');
const fs = require('fs');
const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');


module.exports = {
    login: function(username, password) {
        
        axiosCookieJarSupport(axios);
        
        const cookieJar = new tough.CookieJar();

        let data = {
            'client_id': 'play-valorant-web-prod',
                'nonce': '1',
                'redirect_uri': 'https://playvalorant.com/opt_in',
                'response_type': 'token id_token',
        };

        axios.post('https://auth.riotgames.com/api/v1/authorization', data, {jar: cookieJar, withCredentials: true})
        .then(response=> {
            
            //create an .env file at the root of the project and add these variables
            let data = {
                'type': 'auth',
                'username': username,
                'password': password
            };
            
            axios.put('https://auth.riotgames.com/api/v1/authorization', data, {jar: cookieJar, withCredentials: true})
            .then(response=>{
            
            let uri = response.data.response.parameters.uri;
            let strTokens = uri.replace('https://playvalorant.com/opt_in#', '').split('&');

            let arrayTokens = {};

            strTokens.forEach(token=>{
                arrayTokens[token.split('=')[0]] = token.split('=')[1];
            });

            //---------------UNCOMMENT ANYTHING WITH 'arrayTokens.access_token' AFTER COMPILING---------------
            // @ts-ignore
            var accessToken = arrayTokens.access_token
            

            let headers = {
                // @ts-ignore
                'Authorization': `Bearer ${arrayTokens.access_token}`
            }

            axios.post('https://entitlements.auth.riotgames.com/api/token/v1', {}, {jar: cookieJar, withCredentials: true, headers})
            .then(response=>{

                var entitlements_token = response.data.entitlements_token;
                //console.log('\nEntitlements Token:', entitlements_token);

                axios.post('https://auth.riotgames.com/userinfo', {}, {jar: cookieJar, withCredentials: true, headers})
                .then(response=>{

                var user_id = response.data.sub;
                //console.log('\nPlayer Id:', user_id);
                
                let writefile = {
                    'auth': accessToken,
                    'entitlement': entitlements_token,
                    'userid': user_id
                };

                fs.writeFile('./auth.json', JSON.stringify(writefile), function(err) {
                    if(err) {
                        console.log(err);
                    }
                }); 

                });

            });

            });

        })
        .catch(error=> {
            console.log(error);
        });

        
    }
}