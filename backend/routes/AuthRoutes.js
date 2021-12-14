const router = require('express').Router();
const { Login, Register } = require('../controllers/AdminAuth');

router.post('/login', Login);
// router.post('/logout', AdminLogout); // Not working yet...
router.post('/register', Register);

module.exports = router;
