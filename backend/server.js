const express = require('express');
const https = require('https');
const fs = require('fs');
const PassRouter = require('./routes/PassRoutes');
const AuthRouter = require('./routes/AuthRoutes');
const AdminRouter = require('./routes/AdminRoutes');
const SettlementRouter = require('./routes/SettlementRoutes');

const auth = require('./middleware/auth');

require('dotenv').config();

const certOptions = {
    key: fs.readFileSync('./certificate/key.pem'),
    cert: fs.readFileSync('./certificate/cert.pem'),
    requestCert: false,
    rejectUnauthorized: false
};

const app = express();
const port = process.env.PORT;
const server = https.createServer(certOptions, app);

app.use(express.urlencoded({ extended: true }));

app.use('/interoperability/api/', AuthRouter);
app.use('/interoperability/api/settlements', auth('user'), SettlementRouter);
app.use('/interoperability/api/admin', auth('admin'), AdminRouter);
app.use('/interoperability/api/', auth('user'), PassRouter);
app.use('*', (req, res) => res.status(404).json({ message: 'Bad request: Endpoint not found' }));

server.listen(port, () => console.log(`It's alive on https://localhost:${port}`));
