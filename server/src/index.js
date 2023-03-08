const express = require('express');
const app = express();
const db = require('./config/db');
const cors = require('cors');
const auth = require('./routes/auth').router;
const services = require('./routes/Services').router;
const notfound = require('./middlewares/middle').notfound;
const passport = require('passport');
const session = require('express-session');
const facebook = require('./routes/webhooks/facebook');

const sessionMiddleware = session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET,
    cookie: {
        sameSite: 'none',
        httpOnly: false,
        secure: true,
        maxAge: 1000 * 60 * 30
    }
});

app.enable("trust proxy");
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
    'credentials': true,
    'origin': function(origin, callback) {
        return (callback(null, true));
    }
}));

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use('*', (req, res, next) => {
    sessionMiddleware(req, res, next => {
        if (req.headers.origin && (req.headers.origin != "http://zarea.fr" || !req.session.origin))
            req.session.origin = req.headers.origin;
        else if (!req.session.origin)
            req.session.origin = "http://zarea.fr";
        req.session.save();
    });
    return (next());
});
        
app.use("/", auth);
app.use("/", services);
app.use("/callback/webhook", facebook);

app.get("/is_auth", (req, res) => {
    return (res.status(200).json(req.isAuthenticated()));
});

app.get("/about.json", (req, res) => {
    return (res.status(200).json({
        client: {
            host: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        }, server: {
            current_time: Date.now(),
            services: Object.keys(require('./routes/Services').functions).map(service => {
                return ({
                    name: service,
                    actions: Object.keys(require('./routes/Services').functions[service].actions).map(action => {
                        return ({
                            name: action,
                            description: require('./routes/Services').functions[service].actions[action].title
                        });
                    }),
                    reactions: Object.keys(require('./routes/Services').functions[service].reactions).map(reaction => {
                        return ({
                            name: reaction,
                            description: require('./routes/Services').functions[service].reactions[reaction].title
                        });
                    }),
                });
            })
        }
    }));
});

app.use("*", notfound);

app.listen(process.env.PORT, () => {
    console.log(Date(), "Server started on port", process.env.PORT);
    db.connect().then(client => console.log("Successfuly connected to postgres database.")).catch(err => console.log("Can't connect to postgres database:", err));
});
