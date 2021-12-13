const router = require('express').Router();
const PassesPerStation = require('../controllers/PassesPerStation');

// GET all passes for specified station and time period
router.get('/PassesPerStation/:stationID/:dateFrom/:dateTo', PassesPerStation);

module.exports = router;
