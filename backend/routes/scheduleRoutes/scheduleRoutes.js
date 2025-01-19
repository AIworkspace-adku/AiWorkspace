const express = require('express');
const scheduleController = require('../../controllers/scheduleControllers');
const router = express.Router();

router.post('/addMeeting', scheduleController.addMeeting);
router.post('/updateMeeting', scheduleController.updateMeeting);
router.post('/deleteMeeting', scheduleController.deleteMeeting);
router.post('/fetchMeets', scheduleController.fetchMeets);
router.post('/fetchTodaySchedule', scheduleController.fetchTodaySchedule);

module.exports = router;