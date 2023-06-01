const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const db = require('../firebase.js');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await db.collection('users').doc(id).get();
		done(null, user.data());
	} catch(error) {
		console.error(`Error deserialize user: ${error}`);
		done(null, null);
	}
})

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: '/login/google/callback',
	scope: ['profile']
}, async (issuer, profile, cb) => {
	try {
		const user = {
			id: profile.id,
			name: profile.displayName,
		};

		const existingUser = await db.collection('users').doc(profile.id).get();

		if (!existingUser.exists) {
			await db.collection('users').doc(profile.id).set(user);
		};

		return cb(null, user);
	} catch(error) {
		console.error(`Error creating user: ${error}`);
		return cb(null, null);
	}
}));

const router = express.Router();

router.get('/login/google', passport.authenticate('google'));

router.get('/login/google/callback', passport.authenticate('google', {
	successRedirect: '/',
	failureRedirect: '/login/google',
}));

router.get('/api/current_user', (req, res) => {
	if (req.user) {
		return res.send({loggedIn: true});
	}
	res.send({loggedIn: false});
});

router.get('/logout', (req, res) => {
	req.logout((err) => {
		if (err) { return next(err); }
		res.redirect('/');
	});
});

//const { initializeApp } = require('firebase/app');
//
//const firebaseConfig = {
//
//};
//
//const firebaseApp = require(firebaseConfig);

module.exports = router;
