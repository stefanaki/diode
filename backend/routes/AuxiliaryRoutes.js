const router = require('express').Router();

const GetOperators = require('../controllers/GetOperators');
const GetStations = require('../controllers/GetStations');

router.get('/GetOperators', GetOperators);
router.get('/GetStations/:operator', GetStations);

module.exports = router;
