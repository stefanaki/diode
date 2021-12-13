const router = require('express').Router();
const { AdminLogin, AdminRegister } = require('../controllers/AdminAuth');

router.post('/login', AdminLogin);
// router.post('/logout', AdminLogout); // Not working yet...
router.post('/register', AdminRegister);

module.exports = router;
