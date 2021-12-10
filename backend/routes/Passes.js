const router = require('express').Router();
const PassesPerStation = require('../controllers/PassesPerStation');

// GET all passes for specified station and time period
router.get(
    '/PassesPerStation/:stationID/:date_from/:date_to',
    PassesPerStation
);

module.exports = router;
