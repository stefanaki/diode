const router = require('express').Router();
const PassesPerStation = require('../controllers/PassesPerStation');
const ChargesBy = require('../controllers/ChargesBy');

router.get('/ChargesBy/:op_ID/:date_from/:date_to', ChargesBy);
router.get('/PassesPerStation/:stationID/:date_from/:date_to', PassesPerStation);

module.exports = router;
