const express = require('express');
const modTaskController = require('../../controllers/modTaskControllers');
const router = express.Router();

router.post('/addModule', modTaskController.addModule);
router.post('/fetchModules', modTaskController.fetchModules);
router.post('/updateModule', modTaskController.updateModule);
router.post('/deleteModule', modTaskController.deleteModule);
router.post('/addTask', modTaskController.addTask);
router.post('/updateTask', modTaskController.updateTask);
router.post('/deleteTask', modTaskController.deleteTask);
router.post('/fetchTasks', modTaskController.fetchTasks);

module.exports = router;