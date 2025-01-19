const Team = require('../models/Teams');
const Modules = require('../models/Modules');
const Projects = require('../models/Projects');

const addModule = async (req, res) => {
	const { teamId, projId, moduleName, assignedTo } = req.body;

	try {
		const newModule = new Modules({
			moduleName: moduleName,
			teamId: teamId,
			projId: projId,
			assignedTo: assignedTo,
		});

		const savedModule = await newModule.save();
		res.status(201).json({ modules: savedModule, message: 'Module created successfully' });
	}
	catch (error) {
		console.error('Error creating module:', error);
		res.status(500).json({ message: 'Failed to create module' });
	}
};

const fetchModules = async (req, res) => {
	const { projId } = req.body;

	try {
		const modules = await Modules.find({ projId: projId });
		res.status(201).json({ modules: modules, message: 'Modules fetched successfully' });
	}
	catch (error) {
		console.error('Error creating module:', error);
		res.status(500).json({ message: 'Failed to fetch module' });
	}
};

const updateModule = async (req, res) => {
	const { moduleId, moduleName, assignedTo } = req.body;

	try {
		const module = await Modules.findById(moduleId);
		if (!module) return res.status(404).json({ message: 'Module not found' });

		if (moduleName !== '') {
			module.moduleName = moduleName;
		}
		if (assignedTo.length !== 0) {
			module.assignedTo = assignedTo;
		}
		await module.save();

		res.status(201).json({ updatedModule: module, message: 'Module updated successfully' });
	}
	catch (error) {
		console.error('Error updating module:', error);
		res.status(500).json({ message: 'Failed to update module' });
	}
};

const deleteModule = async (req, res) => {
	const { moduleId } = req.body;

	try {
		const module = await Modules.findById(moduleId);
		if (!module) return res.status(404).json({ message: 'Module not found' });
		await Modules.deleteOne({ _id: moduleId });

		updateProgress(module.projId);

		res.status(200).json({ deletedModule: module, message: 'Module deleted successfully' });
	}
	catch (error) {
		console.error('Error deleting module:', error);
		res.status(500).json({ message: 'Failed to delete module' });
	}
};

const addTask = async (req, res) => {
	const { moduleId, projId, taskName, assignedTo } = req.body;

	try {
		const ownerData = {
			projId: projId,
			moduleId: moduleId,
		}
		const newTask = {
			taskName: taskName,
			owner: ownerData,
			assignedTo: assignedTo,
		};

		const module = await Modules.findById(moduleId);
		module.tasks.push(newTask);
		await module.save();
		updateProgress(module.projId);

		const savedTask = module.tasks[module.tasks.length - 1];
		res.status(201).json({ savedTask: savedTask, message: 'Task created successfully' });
	}
	catch (error) {
		console.error('Error creating task:', error);
		res.status(500).json({ message: 'Failed to create task' });
	}
};

const updateTask = async (req, res) => {
	const { moduleId, taskId, taskName, assignedTo, status, statusUpdate } = req.body;

	try {
		const module = await Modules.findById(moduleId);
		const task = module.tasks.find(t => t._id.toString() === taskId);

		if (!task) return res.status(404).json({ message: 'Task not found' });

		if (statusUpdate) {
			task.status = status;
		}
		else {
			if (taskName) {
				task.taskName = taskName;
			}
			if (assignedTo.length !== 0) {
				task.assignedTo = assignedTo;
			}
		}

		await module.save();
		updateProgress(module.projId);

		const updatedTask = module.tasks.find(t => t._id.toString() === taskId);
		return res.status(200).json({ message: 'Task updated successfully', updatedTask: updatedTask });
	}
	catch (error) {
		console.error('Error updating task:', error);
		res.status(500).json({ message: 'Failed to update task' });
	}
};

const updateProgress = async (projectId) => {
	const module = await Modules.find({ projId: projectId });
	if (module.length === 0) {
		const project = await Projects.findByIdAndUpdate(projectId, { progress: 0 });
		return project;
	} 
	let totalTasks = 0;

	module.forEach(m => {
		totalTasks += m.tasks.length;
	});

	let completedTasks = 0;

	module.forEach(m => {
		m.tasks.forEach(t => {
			if (t.status) {
				completedTasks++;
			}
		});
	});

	const progress = (completedTasks / totalTasks) * 100;

	const project = await Projects.findByIdAndUpdate(projectId, { progress: progress });
	return project;
};

const deleteTask = async (req, res) => {
	const { moduleId, taskId } = req.body;

	try {
		const module = await Modules.findById(moduleId);
		const task = module.tasks.find(t => t._id.toString() === taskId);

		if (!task) return res.status(404).json({ message: 'Task not found' });

		module.tasks = module.tasks.filter(t => t._id.toString() !== taskId);
		await module.save();
		updateProgress(module.projId)

		return res.status(200).json({ message: 'Task deleted successfully', deletedTask: task });
	}
	catch (error) {
		console.error('Error deleting task:', error);
		res.status(500).json({ message: 'Failed to delete task' });
	}
};

const fetchTasks = async (req, res) => {
	const { email } = req.body;
	try {

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

		const modules = await Modules.find({
			'tasks.assignedTo.email': email,
			'teamId': { $in: teamIds }
		})
			.select('tasks')
			.lean();

		const userTasks = modules.reduce((tasks, module) => {
			// Filter tasks assigned to the user in this module
			const assignedTasks = module.tasks.filter(task =>
				task.assignedTo.some(user => user.email === email)
			);
			return tasks.concat(assignedTasks); // Combine the tasks from each module
		}, []);

		// Return the tasks assigned to the user
		res.status(200).json({ tasks: userTasks });
	}
	catch (error) {
		console.error('Error fetching tasks:', error);
		res.status(500).json({ message: 'Failed to fetch tasks' });
	}
};

module.exports = {
	addModule,
	fetchModules,
	updateModule,
	deleteModule,
	addTask,
	updateTask,
	deleteTask,
	fetchTasks
}