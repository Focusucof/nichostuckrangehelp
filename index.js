const dotenv = require('dotenv');
const RSOLogin = require('./RSOLogin');
const fs = require('fs');
const userDetails = require('./auth.json');
const axios = require('axios').default;

dotenv.config();

start();

async function start() {
    let username = process.env.USERNAME;
    let password = process.env.PASSWORD;

    RSOLogin.login(username, password);

    let auth = userDetails.auth;
    let entitlement = userDetails.entitlement;
    let user_id = userDetails.userid;
    let clientVersion = 'release-03.02-shipping-5-584286';

    await main(auth, entitlement, user_id, clientVersion);
}




//console.log(auth);

async function main(auth, entitlement, user_id, clientVersion) {

    let matchid;
    await axios.get(`https://glz-na-1.na.a.pvp.net/core-game/v1/players/${user_id}`, {
        headers: {
            'authorization': `Bearer ${auth}`,
            'accept': 'application/json',
            "X-Riot-Entitlements-JWT": entitlement,
            "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
            "X-Riot-ClientVersion":  clientVersion
        }
    }).then(response => {
        console.log(response.data);
        MatchID = response.data.MatchID;
    }).catch(error => {
        console.log(error);
    });

    let resp;
    await axios.post(`https://glz-na-1.na.a.pvp.net/core-game/v1/players/${user_id}/disassociate/${MatchID}`, {
        headers: {
            'authorization': `Bearer ${auth}`,
            'accept': 'application/json',
            "X-Riot-Entitlements-JWT": entitlement,
            "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
            "X-Riot-ClientVersion":  clientVersion
        }
    }).then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.log(error);
    })

}