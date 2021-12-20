const router = require('express').Router();
const PassesPerStation = require('../controllers/PassesPerStation');
const ChargesBy = require('../controllers/ChargesBy');

router.get('/ChargesBy/:opID/:date_From/:date_To', ChargesBy);
router.get('/PassesPerStation/:stationID/:dateFrom/:dateTo', PassesPerStation);

module.exports = router;
