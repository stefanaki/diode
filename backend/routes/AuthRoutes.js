const router = require('express').Router();
const { Login, Logout, Register } = require('../controllers/AdminAuth');

router.post('/login', Login);
router.post('/logout', Logout);
router.post('/register', Register);

module.exports = router;
