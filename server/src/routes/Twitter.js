const addSessionsOrUpdate = require('./auth').addSessionsOrUpdate;
const db = require('../config/db');

function getAccessToken(aT, rT, user, cb) {
    let body = {
        'grant_type': 'refresh_token',
        'refresh_token': rT,
        'client_id': 'ajFCcEh0U2RyeXU1RWloMGEtdnU6MTpjaQ',
    };
    fetch("https://api.twitter.com/2/oauth2/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Basic " + Buffer.from('ajFCcEh0U2RyeXU1RWloMGEtdnU6MTpjaQ:xgxFS6FhHBJKT4Xs1i00CAWSwGPrhHVKSL1nHWUGmQ-ldUCwej').toString('base64') }, body: new URLSearchParams(body) }).then(response => {
        response.json().then(json => {
            addSessionsOrUpdate("twitter", json.access_token, json.refresh_token, null, user.emails[0].value, user.provider);    
            cb(json.access_token, json.refresh_token);
        }).catch(err => { console.log(err); cb(null) });
    }).catch(err => { console.log(err); cb(null) });
};

let reactions = {
    tweet: {
        title: "Tweet something",
        input: [{title: "Content of the tweet", value: "content"}],
        fun: (user, params) => {
            db.query(`SELECT sessions FROM users WHERE email = '${user.email}' and provider = '${user.provider}'`).then(data => {
                console.log(data.rows[0].sessions['twitter']?.aT, data.rows[0].sessions['twitter']?.aT)
                console.log(JSON.stringify({text: params.content}))
                fetch("https://api.twitter.com/2/tweets", {method: "POST", headers: {"Authorization": "Bearer " + data.rows[0].sessions['twitter']?.aT, "Content-Type": "application/json"}, body: JSON.stringify({text: params.content})}).then(response => {
                    response.json().then(json => {
                        console.log(json);
                    })
                })
            })
        }

    }
}

module.exports.getAT = getAccessToken;
module.exports.reactions = reactions;
module.exports.actions = {};
