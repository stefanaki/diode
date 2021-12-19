const router = require('express').Router();
const { Login, Logout } = require('../controllers/AdminAuth');

router.post('/login', Login);
router.post('/logout', Logout);

module.exports = router;
