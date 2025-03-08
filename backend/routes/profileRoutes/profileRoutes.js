const express = require('express');
const profileController = require('../../controllers/profileControllers');
const router = express.Router();

router.post('/update', profileController.update);

module.exports = router;