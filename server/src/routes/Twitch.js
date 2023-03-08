const db = require('../config/db');
const addSessionsOrUpdate = require('./auth').addSessionsOrUpdate;

function getAccessToken(aT, rT, user, cb) {
    let body = {
        'grant_type': 'refresh_token',
        'refresh_token': rT,
        'client_id': 'w4cy3sqcm10l1alu3ghqgkcskscn9l',
        'client_secret': 'rjnf2mih512gbqrsfxjapigoxpjpq5'
    };
    fetch("https://id.twitch.tv/oauth2/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(body) }).then(response => {
        if (response.status === 200) {
            response.json().then(json => {
                addSessionsOrUpdate("twitch", json.access_token, json.refresh_token, null, user.emails[0].value, user.provider);    
                cb(json.access_token, json.refresh_token);
            });
        } else
            return (cb(null));
    }).catch(err => { console.log(err); cb(null) });
};

let actions = {
    online: {
        title: "Going live",
        input: [{title: "Name of the streamer", value: "name"}],
        fun: (user, params, cb) => {
            db.query(`SELECT sessions FROM users WHERE email = '${user.email}' and provider = '${user.provider}'`).then(data => {
                if (data.rows[0].sessions["twitch"]?.aT) {
                    fetch(`https://api.twitch.tv/helix/users?login=${params.name}`, { method: "GET", headers: { "Authorization": "Bearer " + data.rows[0].sessions["twitch"]?.aT, "Client-Id": "w4cy3sqcm10l1alu3ghqgkcskscn9l" } }).then(response => {
                        response.json().then(json => {
                            let body = {
                                'grant_type': 'client_credentials',
                                'client_id': 'w4cy3sqcm10l1alu3ghqgkcskscn9l',
                                'client_secret': 'rjnf2mih512gbqrsfxjapigoxpjpq5'
                            };
                            fetch(`https://id.twitch.tv/oauth2/token`, { method: "POST", headers: { 'Content-Type': 'application/x-www-form-urlencoded', "Authorization": "Bearer " + data.rows[0].sessions["twitch"]?.aT }, body: new URLSearchParams(body) } ).then(response => {
                                response.json().then(json2 => {
                                    let body = {
                                        "type": "stream.online",
                                        "version": "1",
                                        "condition": {
                                            "broadcaster_user_id": json.data[0].id
                                        },
                                        "transport": {
                                            "method": "webhook",
                                            "callback": "https://api.zarea.fr/callback/webhook/twitch/online",
                                            "secret": "secretsecret"
                                        }
                                    };
                                    fetch(`https://api.twitch.tv/helix/eventsub/subscriptions`, { method: "POST", headers: { "Content-Type": "application/json", "Client-Id": "w4cy3sqcm10l1alu3ghqgkcskscn9l", "Authorization": "Bearer " + json2.access_token }, body: JSON.stringify(body)}).then(response => response.json().then(json => { console.log(json); cb(response.status, {"202": "Action created", "404": "Wrong repo or owner name", "422": "Action already exists", "409": "Webhooks already exist"}[response.status] || "Unknown error", json.data[0].id)}));
                                })
                            })
                        })
                    }) 
                } else cb(401, "No Twitch access token");
            });
        }, cb: (req, res) => {
            if (req.body.subscription.status != 'enabled')
                return (res.status(200).send(req.body.challenge));
            else {
                if (req.body.subscription.type == "stream.online")
                db.query("SELECT area, email, provider FROM users WHERE area IS NOT NULL").then(data => {
                    let row = data.rows.find(row => row.area["twitch"]?.[req.body.subscription.id]);
                    if (row) require("./Services").functions[row.area["twitch"][req.body.subscription.id].reaction.provider].reactions[row.area["twitch"][req.body.subscription.id].reaction.type].fun(row, row.area["twitch"][req.body.subscription.id].reaction.params);
                });
            }
        }
    },
    follow: {
        title: "Someone followed you",
        input: [{title: "Name of the streamer", value: "name"}],
        fun: (user, params, cb) => {
            db.query(`SELECT sessions FROM users WHERE email = '${user.email}' and provider = '${user.provider}'`).then(data => {
                if (data.rows[0].sessions["twitch"]?.aT) {
                    fetch(`https://api.twitch.tv/helix/users?login=${params.name}`, { method: "GET", headers: { "Authorization": "Bearer " + data.rows[0].sessions["twitch"]?.aT, "Client-Id": "w4cy3sqcm10l1alu3ghqgkcskscn9l" } }).then(response => {
                        response.json().then(json => {
                            let body = {
                                'grant_type': 'client_credentials',
                                'client_id': 'w4cy3sqcm10l1alu3ghqgkcskscn9l',
                                'client_secret': 'rjnf2mih512gbqrsfxjapigoxpjpq5'
                            };
                            fetch(`https://id.twitch.tv/oauth2/token`, { method: "POST", headers: { 'Content-Type': 'application/x-www-form-urlencoded', "Authorization": "Bearer " + data.rows[0].sessions["twitch"]?.aT }, body: new URLSearchParams(body) } ).then(response => {
                                response.json().then(json2 => {
                                    let body = {
                                        "type": "channel.follow",
                                        "version": "1",
                                        "condition": {
                                            "broadcaster_user_id": json.data[0].id
                                        },
                                        "transport": {
                                            "method": "webhook",
                                            "callback": "https://api.zarea.fr/callback/webhook/twitch/online",
                                            "secret": "secretsecret"
                                        }
                                    };
                                    fetch(`https://api.twitch.tv/helix/eventsub/subscriptions`, { method: "POST", headers: { "Content-Type": "application/json", "Client-Id": "w4cy3sqcm10l1alu3ghqgkcskscn9l", "Authorization": "Bearer " + json2.access_token }, body: JSON.stringify(body)}).then(response => response.json().then(json => { console.log(json.data[0].id); cb(response.status, {"202": "Action created", "404": "Wrong repo or owner name", "422": "Action already exists", "409": "Webhooks already exist"}[response.status] || "Unknown error", json.data[0].id)}));
                                })
                            })
                        })
                    }) 
                } else cb(401, "No Twitch access token");
            });
        }, cb: (req, res) => {
            if (req.body.subscription.status != 'enabled')
                return (res.status(200).send(req.body.challenge));
            else {
                if (req.body.subscription.type == "stream.online")
                db.query("SELECT area, email, provider FROM users").then(data => {
                    console.log(data.rows);
                    let row = data.rows.find(row => row.area["twitch"]?.[req.body.subscription.id]);
                    console.log(row);
                    if (row) require("./Services").functions[row.area["twitch"][req.body.subscription.id].reaction.provider].reactions[row.area["twitch"][req.body.subscription.id].reaction.type].fun(row, row.area["twitch"][req.body.subscription.id].reaction.params);
                });
            }
        }
    }
};

module.exports.getAT = getAccessToken;
module.exports.actions = actions;
module.exports.reactions = [];
