const router = require('express').Router();
const PassesPerStation = require('../controllers/PassesPerStation');

router.get('/PassesPerStation/:stationID/:dateFrom/:dateTo', PassesPerStation);

module.exports = router;
