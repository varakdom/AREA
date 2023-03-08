const { authenticateSession } = require("../middlewares/middle");
const router = require('express').Router();
const db = require('../config/db');
const addSessionsOrUpdate = require('./auth').addSessionsOrUpdate;

let functions = { "spotify": require('./Spotify'), "github": require("./Github"), "twitter": require("./Twitter"), "twitch": require("./Twitch"), "facebook": require("./Facebook"), "reddit": require("./Reddit"), "discord": require("./Discord") };

Object.keys(functions).forEach(provider => Object.keys(functions[provider]["actions"]).forEach(action => router.post("/callback/webhook/" + provider + "/" + action, functions[provider]["actions"][action].cb)));

router.get("/services", authenticateSession, (req, res) => {
    let services = { facebook: {}, twitch: {}, twitter: {}, spotify: {}, github: {}, discord: {} };

    Object.keys(services).forEach(service => {
        services[service].connected = false;
        services[service].actions = functions[service]?.actions;
        services[service].reactions = functions[service]?.reactions;
    });
    db.query(`SELECT sessions FROM users WHERE email = '${req.session.passport.user.emails[0].value}' and provider = '${req.session.passport.user.provider}'`).then(data => {
        if (data.rows[0]?.sessions) {
            data.rows[0].total = 0;
            Object.keys(data.rows[0].sessions).forEach(key => {
                functions[key]?.getAT(data.rows[0].sessions[key].aT, data.rows[0].sessions[key].rT, req.session.passport.user, (aT, rT) => {
                    services[key].connected = aT ? true : false;
                    data.rows[0].total += 1;
                });
            });
        }
        let ret = () => {
            if (!data.rows[0]?.sessions || data.rows[0].total === Object.keys(data.rows[0].sessions).length) {
                return (res.status(200).json(services));
            }
            setTimeout(ret, 200); 
        }
        ret();
    }).catch(err => {
        console.log(err);
        return (res.status(500).json({ msg: "Internal Server Erorr" }));
    });
});

router.delete("/service", authenticateSession, (req, res) => {
    if (!req.body.service) return (res.status(400).json({msg: "Missing service parameter"}));
    db.query(`SELECT sessions FROM users WHERE email = '${req.session.passport.user.emails[0].value}' and provider = '${req.session.passport.user.provider}'`).then(data => {
        if (data.rows[0]?.sessions) {
            delete data.rows[0].sessions[req.body.service];
            db.query(`UPDATE users SET sessions = '${JSON.stringify(data.rows[0].sessions)}' WHERE email = '${req.session.passport.user.emails[0].value}' and provider = '${req.session.passport.user.provider}'`);
        }
        return (res.status(200).json({msg: "Service deleted"}));
    });
});

router.get("/actions", authenticateSession, (req, res) => {
    db.query(`SELECT area FROM users WHERE email = '${req.session.passport.user.emails[0].value}'`).then(data => {
        if (data.rows[0].area) return (res.status(200).json(data.rows[0].area))
        else return (res.status(200).json({ facebook: {}, twitch: {}, twitter: {}, spotify: {}, github: {}, trello: {} }))
    });
});

router.post("/area", authenticateSession, (req, res) => {
    if (!req.body.provider || !req.body.rprovider || !req.body.reaction || !req.body.rparams || !req.body.action || !req.body.params || !functions[req.body.provider] || !functions[req.body.rprovider] || !functions[req.body.provider]["actions"][req.body.action] || !functions[req.body.rprovider]["reactions"][req.body.reaction] || functions[req.body.provider]["actions"][req.body.action].input.some(input => Object.keys(req.body.params).indexOf(input.value) === -1) || functions[req.body.rprovider]["reactions"][req.body.reaction].input.some(input => Object.keys(req.body.rparams).indexOf(input.value) === -1))
        return (res.status(400).json({msg: "Missing parameter(s)"}));
    functions[req.body.provider]["actions"][req.body.action].fun({email: req.session.passport.user.emails[0]?.value, provider: req.session.passport.user.provider}, req.body.params, (code, msg, hook_id) => {
        res.status(code).json({msg: msg});
        console.log(code, req.body.provider);
        if (code === 201 || code === 202)
            db.query(`SELECT area FROM users WHERE email = '${req.session.passport.user.emails[0].value}' and provider = '${req.session.passport.user.provider}'`).then(data => {null
                data.rows[0].area ??= {};
                data.rows[0].area[req.body.provider] ??= {};
                data.rows[0].area[req.body.provider][hook_id] = {type: req.body.action, params: req.body.params, reaction: {provider: req.body.rprovider, type: req.body.reaction, params: req.body.rparams}};
                db.query(`UPDATE users SET area = '${JSON.stringify(data.rows[0].area).replace(/\'/g, "''")}' WHERE email = '${req.session.passport.user.emails[0].value}' AND provider = '${req.session.passport.user.provider}'`).catch(err => console.log("ERREUR ICI", err));
            }).catch(err => console.log(err));
    });
});

module.exports.router = router;
module.exports.functions = functions;