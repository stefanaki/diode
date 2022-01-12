const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/login', (req, res) => res.render('login', { title: 'Log in' }));

app.get('/', (req, res) => res.render('operator', { title: 'Operator Analytics', active: 1 }));

app.listen(port, () =>
	console.log(`Front-end server started running on http://localhost:${port}/`)
);
