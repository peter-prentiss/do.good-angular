const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const passport = require('./strategies/mongo.localstrategy');
const sessionConfig = require('./modules/session.config');

//DB Module
const db = require('./modules/db.config.js');

// Route includes
const indexRouter = require('./routes/index.router');
const userRouter = require('./routes/user.router');
const registerRouter = require('./routes/register.router');
const deedslistRouter = require('./routes/deedslist.router');

const port = process.env.PORT || 5000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve back static files
app.use(express.static('./server/public'));

// Passport Session Configuration
app.use(sessionConfig);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/deedslist', deedslistRouter);

// Catch all bucket, must be last!
app.use('/', indexRouter);

// Listen //
app.listen(port, () => console.log('Listening on port:', port));
