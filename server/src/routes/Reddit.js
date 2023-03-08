const db = require('../config/db');
const addSessionsOrUpdate = require('./auth').addSessionsOrUpdate;

function getAccessToken(aT, rT, user, cb) {
    fetch(`https://graph.facebook.com/v15.0/oauth/access_token?grant_type=fb_exchange_token&client_id=784211742840413&client_secret=b851fad03e3b892ce293c06610b1f7eb&fb_exchange_token=${aT}`, { method: "GET", headers: {} }).then(response => {
        if (response.status === 200) {
            response.json().then(json => {
                addSessionsOrUpdate("reddit", json.access_token, null, null, user.emails[0].value, user.provider);
                cb(json.access_token);
            });
        } else
            return (cb(null));
    }).catch(err => { console.log(err); cb(null) });
}

module.exports.getAT = getAccessToken;
module.exports.actions = {};
module.exports.reactions = {};