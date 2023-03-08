const db = require('../config/db');
const { authenticateSession } = require("../middlewares/middle");
const router = require('express').Router();

router.delete("/delete/github", authenticateSession, (req, res) => {
    db.query(`SELECT sessions FROM users WHERE email = '${req.session.passport.user.emails[0].value}' and provider = '${req.session.passport.user.provider}'`).then(data => {
        require("./Github").getAT(data.rows[0].sessions['github']?.aT, data.rows[0].sessions['github']?.rT, aT => {
            fetch(`https://api.github.com/repos/${req.body.owner}/${req.body.repo}/hooks/${req.query.id}`, { method: "DELETE", headers: {"Authorization": "Bearer " + aT, "Accept": "application/vnd.github+json"}}).then(result => {
                if (result.status === 204) {
                    db.query(`SELECT area FROM users WHERE email = '${req.session.passport.user.emails[0].value}' and provider = '${req.session.passport.user.provider}'`).then(data => {  
                        delete data.rows[0].area['github'][req.query.id]
                        db.query(`UPDATE users SET area = '${JSON.stringify(data.rows[0].area)}' WHERE email = '${req.session.passport.user.emails[0].value}' and provider = '${req.session.passport.user.provider}'`).then(() => {
                            return (res.status(200).json({msg: "Webhooks deleted"}))
                        })
                    })
                } else
                    return (res.status(400))
            })
        })
    })
});

router.delete("/delete/twitch", authenticateSession, (req, res) => {
    console.log("hola");
    db.query(`SELECT sessions FROM users WHERE email = '${req.session.passport.user.emails[0].value}' and provider = '${req.session.passport.user.provider}'`).then(data => {
        require("./Twitch").getAT(data.rows[0].sessions['twitch']?.aT, data.rows[0].sessions['twitch']?.rT, (aT, rT) => {
            let body = {
                'grant_type': 'client_credentials',
                'client_id': 'w4cy3sqcm10l1alu3ghqgkcskscn9l',
                'client_secret': 'rjnf2mih512gbqrsfxjapigoxpjpq5'
            };
            fetch(`https://id.twitch.tv/oauth2/token`, { method: "POST", headers: { 'Content-Type': 'application/x-www-form-urlencoded', "Authorization": "Bearer " + aT }, body: new URLSearchParams(body) } ).then(result => {
                result.json().then(json => {
                    fetch(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${req.query.id}`, { method: "DELETE", headers: {"Authorization": "Bearer " + json.access_token, "Client-Id": "w4cy3sqcm10l1alu3ghqgkcskscn9l"}}).then(result => {
                        if (result.status === 204) {
                            db.query(`SELECT area FROM users WHERE email = '${req.session.passport.user.emails[0].value}' and provider = '${req.session.passport.user.provider}'`).then(data => {  
                                delete data.rows[0].area['twitch'][req.query.id]
                                db.query(`UPDATE users SET area = '${JSON.stringify(data.rows[0].area)}' WHERE email = '${req.session.passport.user.emails[0].value}' and provider = '${req.session.passport.user.provider}'`).then(() => {
                                    return (res.status(200).json({msg: "Webhooks deleted"}))
                                })
                            })
                        } else
                            return (res.status(400))
                    })
                })
            }).catch(err => {
                console.log(err)
            })
        })
    })
})

module.exports.router = router;