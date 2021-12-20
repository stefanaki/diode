const router = require('express').Router();
const PassesPerStation = require('../controllers/PassesPerStation');
const PassesAnalysis = require('../controllers/PassesAnalysis');
//const ChargesBy = require('../controllers/ChargesBy');

router.get('/PassesPerStation/:stationID/:date_from/:date_to', PassesPerStation);
router.get('/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to', PassesAnalysis);
//router.get('/ChargesBy/:op_ID/:date_from/:date_to', ChargesBy);

module.exports = router;
