const router = require('express').Router();
const VerifySettlement = require('../controllers/VerifySettlement');
const auth = require('../middleware/auth');

router.post('/VerifySettlement', auth('bank'), VerifySettlement);
module.exports = router;
