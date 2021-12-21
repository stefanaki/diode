const router = require('express').Router();
const HealthCheck = require('../controllers/HealthCheck');
const ResetPasses = require('../controllers/ResetPasses');
const ResetStations = require('../controllers/ResetStations');
const ResetVehicles = require('../controllers/ResetVehicles');

router.get('/healthcheck', HealthCheck);
router.post('/resetpasses', ResetPasses);
router.post('/resetstations', ResetStations);
router.post('/resetvehicles', ResetVehicles);

module.exports = router;
