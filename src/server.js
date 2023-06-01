require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
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

app.use(loginRoutes);
app.use(gptRoutes);

if (process.env.DS == 'production') {
	const path = require('path');
	app.use(express.static(path.join(__dirname, '..', 'client/dist')));
	app.use('*', (req, res) => {
		res.sendFile(path.join(__dirname, '..', 'client/dist', 'index.html'));
	});
}

app.listen(process.env.PORT || 3000);
