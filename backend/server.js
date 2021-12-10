const express = require('express');
const PassesRouter = require('./routes/Passes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`));

app.use('/interoperability/', PassesRouter);
