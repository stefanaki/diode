const express = require('express');
const PassesRouter = require('./routes/Passes');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/interoperability/', PassesRouter);
app.get('*', (req, res) => res.status(404).json({ message: 'Bad request: Endpoint not found' }));

app.listen(port, () => console.log(`it's alive on http://localhost:${port}`));
