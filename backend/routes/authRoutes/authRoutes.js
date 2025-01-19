const express = require('express');
const authController = require('../../controllers/authControllers');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/protected', authController.authenticate, (req, res) => {
	res.json({ username: req.user.username, email: req.user.email });
});
router.post('/logout', authController.logout);

module.exports = router;