require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./api/index.js');

const app = express();

app.use(cors());

app.use(routes);

app.listen(3000);
