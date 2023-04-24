//require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./api/index.js');

const app = express();

if (process.env.DS == 'development') {
	app.use(cors());
}

app.use(routes);

if (process.env.DS == 'production') {
	const path = require('path');
	app.use(express.static(path.join(__dirname, '..', 'client/dist')));
	app.use('*', (req, res) => {
		res.sendFile(path.join(__dirname, '..', 'client/dist', 'index.html'));
	});
}

app.listen(process.env.PORT || 3000);
