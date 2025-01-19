const Team = require('../models/Teams');
const mongoose = require('mongoose');
const Modules = require('../models/Modules');
const Projects = require('../models/Projects');
const Document = require('../models/Document');

const createProject = async (req, res) => {
	const { projName, teamId, owner, ownerName, members } = req.body;
	const ownerData = {
		teamId: teamId,
		email: owner,
		username: ownerName,
	}

	try {
		const newProject = new Projects({
			projName,
			owner: ownerData,
		});

		const savedProject = await newProject.save();
		res.status(201).json({ savedProject: savedProject, message: 'Project created successfully' });
	} catch (error) {
		console.error('Error creating project:', error);
		res.status(500).json({ message: 'Failed to create project' });
	}
};

const getProjByTeamId = async (req, res) => {
	const { teamId } = req.body;

	try {
		const projects = await Projects.find({ 'owner.teamId': teamId });
		res.json(projects);
	} catch (error) {
		res.status(500).send(error);
	}
};

const deleteProject = async (req, res) => {
	const { projectId } = req.body;

	try {
		const project = await Projects.findByIdAndDelete(projectId);
		if (!project) return res.status(404).json({ message: 'Project not found' });

		await Modules.deleteMany({ projId: projectId });
		await Document.deleteMany({ 'owner.projId': projectId });

		res.status(200).json({ message: 'Project deleted successfully' });
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
};

const updateLastAccess = async (req, res) => {
	const { projectId } = req.params;

	try {
		if (!mongoose.Types.ObjectId.isValid(projectId)) {
			return res.status(400).json({ message: 'Invalid projectId format' });
		}
		const project = await Projects.findById(projectId);
		if (!project) return res.status(404).json({ message: 'Project not found' });

		project.lastAccess = new Date();
		await project.save();

		res.status(200).json({ message: 'Last access updated successfully' });
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
};

const recentProjects = async (req, res) => {
	const { email } = req.body;

	try {
		// Find all teams where the user is a member
		const userTeams = await Team.find({
			$or: [
				{ 'owner.email': email }, // User is the owner of the team
				{ 'members': { $elemMatch: { email: email } } } // User is a member of the team
			]
		}).select('_id'); // Select only the team IDs

		if (userTeams.length === 0) {
			return res.status(404).json({ message: 'User is not part of any team' });
		}

		// Extract team IDs
		const teamIds = userTeams.map(team => team._id);

		// Fetch projects where the user is either the owner or a member of the team
		const recentProjects = await Projects.find({
			$or: [
				{ 'owner.email': email }, // User is the owner
				{ 'owner.teamId': { $in: teamIds } } // User is part of the team (teamId matches)
			]
		})
			.sort({ lastAccess: -1 })  // Sort by lastAccess in descending order
			.limit(3);  // Limit to the top 5 most recently accessed projects

		if (recentProjects.length === 0) {
			return res.status(404).json({ message: 'No projects found for this user' });
		}

		res.status(200).json({ recentProjects });
	} catch (error) {
		res.status(500).send(error);
	}
};

const fetchMembersUsingProjId = async (req, res) => {
	const { projId } = req.body;

	try {
		const project = await Projects.findById({ _id: projId });
		if (!project) return res.status(404).json({ message: 'Project not found' });

		const team = await Team.findById({ _id: project.owner.teamId });
		const members = team.members;
		members.push(project.owner);
		res.status(200).json({ members: members, owner: project.owner, teamId: project.owner.teamId });
	} catch (error) {
		res.status(500).send(error);
	}
};

module.exports = {
    createProject,
    getProjByTeamId,
	deleteProject,
	updateLastAccess,
	recentProjects,
	fetchMembersUsingProjId
}