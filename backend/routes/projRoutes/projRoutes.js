const express = require('express');
const projController = require('../../controllers/projControllers');
const router = express.Router();

router.post('/createProject', projController.createProject);
router.post('/getProjByTeamId', projController.getProjByTeamId);
router.post('/deleteProject', projController.deleteProject);
router.post('/:projectId/last-access', projController.updateLastAccess);
router.post('/recentProjects', projController.recentProjects);
router.post('/fetchMembersUsingProjId', projController.fetchMembersUsingProjId);
router.get('/:id', projController.getProjectById);
module.exports = router;