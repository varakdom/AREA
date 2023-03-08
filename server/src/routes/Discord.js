const db = require('../config/db');
const addSessionsOrUpdate = require('./auth').addSessionsOrUpdate;

function getAccessToken(aT, rT, user, cb) {
    let body = {
        'grant_type': 'refresh_token',
        'refresh_token': rT,
        'client_id': '1039226404472094770',
        'client_secret': "i69Y5F3OLqUnn85UBX962GFtPcJBOvH2"
    };
    fetch("https://discord.com/api/v10/oauth2/token", { method: "POST", headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(body) }).then(response => {
        if (response.status === 200) {
            response.json().then(json => {
                addSessionsOrUpdate("discord", json.access_token, json.refresh_token, null, user.emails[0].value, user.provider);
                cb(json.access_token, json.refresh_token);
            });
        }
        else return (cb(null));
    }).catch(err => { console.log(err); cb(null) });
}

let reactions = {
    playMusic: {
        title: "Play a specific song",
        input: [{title: "Track ID", value: "track"}],
        fun: (user, params) => {
            db.query(`SELECT sessions FROM users WHERE sessions IS NOT NULL AND email = '${user.email}' and provider = '${user.provider}'`).then(data => {
                getAccessToken(data.rows[0].sessions['spotify']?.aT, data.rows[0].sessions['spotify']?.rT, aT => {
                    if (aT) fetch("https://api.spotify.com/v1/me/player/devices", { method: "GET", headers: { 'Authorization': "Bearer " + aT}}).then(response => response.json().then(json => { console.log(json.devices.find(device => device.type == 'Smartphone' || device.type == 'Tablet') ?? json.devices[0]); fetch("https://api.spotify.com/v1/me/player/play?device_id=" + json.devices.find(device => device.type == 'Smartphone' || device.type == 'Tablet')?.id ?? json.devices[0]?.id, { method: "PUT", body: JSON.stringify({ uris: ["spotify:track:" + params.track] }), headers: { 'Authorization': "Bearer " + aT }}).catch(err => console.log(err))}));
                });
            });
        } 
    }
};

module.exports.getAT = getAccessToken;
module.exports.actions = {};
module.exports.reactions = reactions;