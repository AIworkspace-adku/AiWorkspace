const User = require('../models/User');
const Team = require('../models/Teams');
const Modules = require('../models/Modules');
const Projects = require('../models/Projects');
const Document = require('../models/Document');
const Schedule = require('../models/Schedule');

const createTeam = async (req, res) => {
    const { teamName, owner, ownerName } = req.body;

    try {
        ownerData = {
            email: owner,
            username: ownerName,
        }
        const newTeam = new Team({
            teamName,
            owner: ownerData,
        });

        const savedTeam = await newTeam.save();
        res.status(201).json({ message: 'Team created successfully', savedTeam: savedTeam });
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ message: 'Failed to create team' });
    }
};

const deleteTeam = async (req, res) => {
	const { teamId } = req.body;

	try {
		const team = await Team.findByIdAndDelete(teamId);
		if (!team) return res.status(404).json({ message: 'Team not found' });

		await Modules.deleteMany({ teamId: teamId });
		await Schedule.deleteMany({ teamId: teamId });

		const deletedProjects = await Projects.find({ 'owner.teamId': teamId }); // Projects to be deleted
		const deleteResult = await Projects.deleteMany({ 'owner.teamId': teamId });

		if (deleteResult.deletedCount > 0) {
			const projIds = deletedProjects.map(project => project._id);
			await Document.deleteMany({ 'owner.projId': { $in: projIds } });
		}

		res.status(200).json({ message: 'Team deleted successfully' });
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
};

const fetchTeams = async (req, res) => {
    const { owner } = req.body;

    try {
        const teams = await Team.find({ 'owner.email': owner });
        const memberTeams = await Team.find({ "members.email": owner });
        res.json({ teams: teams, memberTeams: memberTeams });
    } catch (error) {
        res.status(500).send(error);
    }
};

const getTeamById = async (req, res) => {
	const { teamId } = req.body;

	try {
		const team = await Team.findById({ _id: teamId });
		res.json({ team: team });
	} catch (error) {
		res.status(500).send(error);
	}
};

const updateTeamName = async (req, res) => {
	const { teamId, teamName } = req.body;

	try {
		const team = await Team.findByIdAndUpdate(teamId, { teamName: teamName });
		res.status(200).json({ team: team });
	}
	catch (error) {
		res.status(500).send(error);
	}
};

const addMemberToTeam = async (req, res) => {
	const { teamId, newMemberEmail } = req.body;

	try {
		const user = await User.findOne({ email: newMemberEmail });
		if (!user) {
			return res.status(400).json({ message: 'No such member' });
		}
		const team = await Team.findById({ _id: teamId });
		if (!team) return res.status(404).json({ message: 'Team not found' });

		// Check if member already exists
		if (team.members.includes(newMemberEmail)) {
			return res.status(400).json({ message: 'Member already added' });
		}

		const newMember = {
			email: newMemberEmail,
			username: user.username,
		}

		// Add the member
		team.members.push(newMember);
		await team.save();

		res.status(200).json({ newMember: newMember, message: 'Member added successfully' });
	} catch (error) {
		console.error('Error adding member:', error);
		res.status(500).json({ message: 'Error adding member', error });
	}
};

const removeMemberFromTeam = async (req, res) => {
	const { teamId, memberEmail } = req.body;

	try {
		const team = await Team.updateOne(
			{ _id: teamId },
			{ $pull: { members: { email: memberEmail } } }
		);
		if (!team) return res.status(404).json({ message: 'Team not found' });

		return res.status(200).json({ message: 'Member removed successfully' });
	}
	catch (error) {
		console.error('Error removing member:', error);
		res.status(500).json({ message: 'Error removing member', error });
	}
};

module.exports = {
    createTeam,
    deleteTeam,
    fetchTeams,
    getTeamById,
    updateTeamName,
    addMemberToTeam,
    removeMemberFromTeam
}