const router = require('express').Router();
const CreateSettlement = require('../controllers/CreateSettlement');
const VerifySettlement = require('../controllers/VerifySettlement');
const GetSettlements = require('../controllers/GetSettlements');
const auth = require('../middleware/auth');
const checkDateFormats = require('../middleware/checkDateFormats')

router.get('/GetSettlements/:date_from/:date_to',checkDateFormats,GetSettlements);
router.post('/CreateSettlement', [auth('admin'),checkDateFormats], CreateSettlement);
router.post('/VerifySettlement', auth('bank'), VerifySettlement);
module.exports = router;
