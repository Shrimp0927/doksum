require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const loginRoutes = require('./api/login.js');
const gptRoutes = require('./api/index.js');

const app = express();

if (process.env.DS == 'development') {
	app.use(cors());
}

app.use(session({
	secret: process.env.SESSION_KEY,
	resave: false,
	saveUninitialized: true,
	cookie: {
		name: 'session',
		maxAge: 24 * 60 * 60 * 1000,
	},
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(loginRoutes);
app.use(gptRoutes);

if (process.env.DS == 'production') {
	const path = require('path');
	app.use(express.static(path.resolve('./client/dist')));
	app.use('*', (req, res) => {
		res.sendFile('index.html', {root: path.resolve('./client/dist')});
	});
}

app.listen(process.env.PORT || 3000);
