const router = require('express').Router();
const ChargesBy = require('../controllers/ChargesBy');

router.get('/ChargesBy/:opID/:date_From/:date_To', ChargesBy);

module.exports = router;
