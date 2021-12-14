const express = require('express');
const PassesRouter = require('./routes/PassesRoutes');
const AuthRouter = require('./routes/AuthRoutes');
const AdminRouter = require('./routes/AdminRoutes');

const auth = require('./middleware/auth');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/interoperability/api/', AuthRouter);
app.use('/interoperability/api/admin', auth, AdminRouter);
app.use('/interoperability/api/', PassesRouter);
app.use('*', (req, res) => res.status(404).json({ message: 'Bad request: Endpoint not found' }));

app.listen(port, () => console.log(`It's alive on http://localhost:${port}`));
