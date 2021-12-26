const express = require('express');
const https = require('https');
const fs = require('fs');
const PassesRouter = require('./routes/PassesRoutes');
const AuthRouter = require('./routes/AuthRoutes');
const AdminRouter = require('./routes/AdminRoutes');

const adminAuth = require('./middleware/adminAuth');
const userAuth = require('./middleware/userAuth');

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/interoperability/api/', AuthRouter);
app.use('/interoperability/api/admin', adminAuth, AdminRouter);
app.use('/interoperability/api/', userAuth, PassesRouter);
app.use('*', (req, res) => res.status(404).json({ message: 'Bad request: Endpoint not found' }));

server.listen(port, () => console.log(`It's alive on https://localhost:${port}`));
