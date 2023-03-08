const db = require('../config/db');
const addSessionsOrUpdate = require('./auth').addSessionsOrUpdate;

function getAccessToken(aT, rT, user, cb) {
    fetch("https://api.github.com/applications/cf5abc0414f7f9466b38/token", { method: "POST", headers: { "Accept": "application/vnd.github.v3+json", "Authorization": "Basic " + Buffer.from('cf5abc0414f7f9466b38:5dd1eb9ff924080ace119eeba5a5c56047c6f79b').toString('base64') }, body: JSON.stringify({'access_token': aT}) }).then(response => {
        if (response.status === 200)
            addSessionsOrUpdate("github", aT, null, null, user.emails[0].value, user.provider);
        return (cb(response.status === 200 ? aT : null));
    }).catch(err => { console.log(err); cb(null) });
};

let actions = {
    push: {
        title: "Push on a specific repository",
        input: [{title: "Repository name", value: "repo"}, {title: "Repository owner name", value: "owner"}],
        fun: (user, params, cb) => {
            let body = {
                "config": {
                    "url": "https://api.zarea.fr/callback/webhook/github/push",
                    "content_type": "json"
                }, "events": ["push"]
            };
            db.query(`SELECT sessions FROM users WHERE email = '${user.email}' and provider = '${user.provider}'`).then(data => {
                if (data.rows[0].sessions["github"]?.aT) fetch(`https://api.github.com/repos/${params.owner}/${params.repo}/hooks`, { method: "POST", headers: { "Accept": "application/vnd.github+json", "Authorization": "Bearer " + data.rows[0].sessions["github"]?.aT}, body: JSON.stringify(body)}).then(response => response.json().then(json => cb(response.status, {"201": "Action created", "404": "Wrong repo or owner name", "422": "Action already exists"}[response.status] || "Unknown error", json.id)));
                else cb(401, "No github access token");
            }).catch(err => {
                console.log(err);
                return (res.status(500).json({ msg: "Internal Server Erorr" }));
            });
        }, cb: (req, res) => {
            if (req.headers['x-github-event'] !== 'ping')
                db.query("SELECT area, email, provider FROM users WHERE area IS NOT NULL").then(data => {
                    let row = data.rows.find(row => row.area["github"]?.[req.headers['x-github-hook-id']]);

                    if (row) require("./Services").functions[row.area["github"][req.headers['x-github-hook-id']].reaction.provider].reactions[row.area["github"][req.headers['x-github-hook-id']].reaction.type].fun(row, row.area["github"][req.headers['x-github-hook-id']].reaction.params);
                });
        }
    },
    pull_request: {
        title: "Pull request on a specific repository",
        input: [{title: "Repository name", value: "repo"}, {title: "Repository owner name", value: "owner"}],
        fun: (user, params, cb) => {
            let body = {
                "config": {
                    "url": "https://api.zarea.fr/callback/webhook/github/pull_request",
                    "content_type": "json"
                }, "events": ["pull_request"]
            };
            db.query(`SELECT sessions FROM users WHERE email = '${user.email}' and provider = '${user.provider}'`).then(data => {
                if (data.rows[0].sessions["github"]?.aT) fetch(`https://api.github.com/repos/${params.owner}/${params.repo}/hooks`, { method: "POST", headers: { "Accept": "application/vnd.github+json", "Authorization": "Bearer " + data.rows[0].sessions["github"]?.aT}, body: JSON.stringify(body)}).then(response => response.json().then(json => cb(response.status, {"201": "Action created", "404": "Wrong repo or owner name", "422": "Action already exists"}[response.status] || "Unknown error", json.id)));
                else cb(401, "No github access token");
            }).catch(err => {
                console.log(err);
                return (res.status(500).json({ msg: "Internal Server Error" }));
            });
        }, cb: (req, res) => {
            if (req.headers['x-github-event'] !== 'ping')
                db.query("SELECT area, email, provider FROM users WHERE area IS NOT NULL").then(data => {
                    let row = data.rows.find(row => row.area["github"]?.[req.headers['x-github-hook-id']]);

                    if (row) require("./Services").functions[row.area["github"][req.headers['x-github-hook-id']].reaction.provider].reactions[row.area["github"][req.headers['x-github-hook-id']].reaction.type].fun(row, row.area["github"][req.headers['x-github-hook-id']].reaction.params);
                });
        }
    },
    forks: {
        title: "Fork on a specific repository",
        input: [{title: "Repository name", value: "repo"}, {title: "Repository owner name", value: "owner"}],
        fun: (user, params, cb) => {
            let body = {
                "config": {
                    "url": "https://api.zarea.fr/callback/webhook/github/forks",
                    "content_type": "json"
                }, "events": ["forks"]
            };
            db.query(`SELECT sessions FROM users WHERE email = '${user.email}' and provider = '${user.provider}'`).then(data => {
                if (data.rows[0].sessions["github"]?.aT) fetch(`https://api.github.com/repos/${params.owner}/${params.repo}/hooks`, { method: "POST", headers: { "Accept": "application/vnd.github+json", "Authorization": "Bearer " + data.rows[0].sessions["github"]?.aT}, body: JSON.stringify(body)}).then(response => response.json().then(json => {console.log(json); cb(response.status, {"201": "Action created", "404": "Wrong repo or owner name", "422": "Action already exists"}[response.status] || "Unknown error", json.id)}));
                else cb(401, "No github access token");
            });
        }, cb: (req, res) => {
            if (req.headers['x-github-event'] !== 'ping')
                db.query("SELECT area, email, provider FROM users WHERE area IS NOT NULL").then(data => {
                    let row = data.rows.find(row => row.area["github"]?.[req.headers['x-github-hook-id']]);

                    if (row) require("./Services").functions[row.area["github"][req.headers['x-github-hook-id']].reaction.provider].reactions[row.area["github"][req.headers['x-github-hook-id']].reaction.type].fun(row, row.area["github"][req.headers['x-github-hook-id']].reaction.params);
                });
        }
    },
};

let reactions = {
    create_repo: {
        title: "Create a repo in an organization",
        input: [{title: "Repository name", value: "repo"}, {title: "Repository description", value: "desc"}],
        fun: (user, params) => {
            db.query(`SELECT sessions FROM users WHERE email = '${user.email}' and provider = '${user.provider}'`).then(data => {
                let body = {
                    "name": params.repo,
                    "description": params.desc,
                    "homepage": "https://zarea.fr",
                    "private": false,
                };
                getAccessToken(data.rows[0].sessions['github']?.aT, data.rows[0].sessions['github']?.rT, aT => {
                    if (aT) fetch(`https://api.github.com/user/repos`, { method: "POST", headers: { "Accept": "application/vnd.github+json", "Authorization": "Bearer " + aT }, body: JSON.stringify(body) }).then(response => response.json().then(json=> {console.log(json)}));
                })
            })
        }
    },
    create_pull_request: {
        title: "Create a pull request",
        input: [{title: "Repository name", value: "repo"}, {title: "Repository owner", value: "owner"}, {title: "Name of the pull request", value: "title"}, {title: "Branch of the head", value: "head"}, {title: "Branch of the base", value: "base"}, {title: "Content of the pull request", value: "desc"}],
        fun: (user, params) => {
            db.query(`SELECT sessions FROM users WHERE email = '${user.email}' and provider = '${user.provider}'`).then(data => {
                let body = {
                    "title": params.title,
                    "body": params.desc,
                    "head": params.head,
                    "base": params.base
                };
                getAccessToken(data.rows[0].sessions['github']?.aT, data.rows[0].sessions['github']?.rT, aT => {
                    if (aT) fetch(`https://api.github.com/repos/${params.owner}/${params.repo}/pulls`, { method: "POST", headers: { "Accept": "application/vnd.github+json", "Authorization": "Bearer " + aT }, body: JSON.stringify(body) }).then(response => response.json().then(json=> {console.log(json)}));
                })
            })
        }
    }
}

module.exports.getAT = getAccessToken;
module.exports.actions = actions;
module.exports.reactions = reactions
