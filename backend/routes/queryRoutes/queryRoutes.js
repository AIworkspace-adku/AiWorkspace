const express = require('express');
const queryController = require('../../controllers/queryControllers');
const router = express.Router();

router.post('/predict', queryController.fetchPapers);

module.exports = router;