const router = require('express').Router();
const CreateSettlement = require('../controllers/CreateSettlement');
const VerifySettlement = require('../controllers/VerifySettlement');
const auth = require('../middleware/auth');
const checkDateFormats = require('../middleware/checkDateFormats')

router.post('/CreateSettlement', [auth('admin'),checkDateFormats], CreateSettlement)
router.post('/VerifySettlement', auth('bank'), VerifySettlement);
module.exports = router;
