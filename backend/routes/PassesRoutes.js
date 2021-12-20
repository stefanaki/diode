const router = require('express').Router();

const PassesPerStation = require('../controllers/PassesPerStation');
const PassesAnalysis = require('../controllers/PassesAnalysis');
const ChargesBy = require('../controllers/ChargesBy');
const PassesCost = require('../controllers/PassesCost');

const checkDateFormats = require('../middleware/checkDateFormats');

router.get('/PassesPerStation/:stationID/:date_from/:date_to', checkDateFormats, PassesPerStation);
router.get('/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to', checkDateFormats, PassesAnalysis);
router.get('/PassesCost/:op1_ID/:op2_ID/:date_from/:date_to', checkDateFormats, PassesCost);
router.get('/ChargesBy/:op_ID/:date_from/:date_to',checkDateFormats,ChargesBy);

module.exports = router;
