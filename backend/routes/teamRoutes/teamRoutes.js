const express = require('express');
const teamController = require('../../controllers/teamControllers');
const router = express.Router();

router.post('/createTeam', teamController.createTeam);
router.post('/deleteTeam', teamController.deleteTeam);
router.post('/fetchTeams', teamController.fetchTeams);
router.post('/getTeamById', teamController.getTeamById);
router.post('/updateTeamName', teamController.updateTeamName);
router.post('/addMemberToTeam', teamController.addMemberToTeam);
router.post('/removeMemberFromTeam', teamController.removeMemberFromTeam);

module.exports = router;