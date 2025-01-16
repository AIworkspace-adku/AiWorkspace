const express = require('express');
const mongoose = require('mongoose');
const http = require('http');  // Make sure this line is present
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Document = require('./models/Document');
const User = require('./models/User');
const Team = require('./models/Teams');
const Projects = require('./models/Projects');
const Modules = require('./models/Modules');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables
dotenv.config();

const allowedOrigins = [
	'http://localhost:3000',
	process.env.FRONTEND_URL
];

const app = express();

// Middleware
app.use(express.json()); // To handle JSON data
app.use(cookieParser());
app.use(cors({
	origin: allowedOrigins,
	credentials: true,              // Allow cookies
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: allowedOrigins, // Replace with your frontend URL if different
		methods: ["post", "POST", "GET"]
	}
});

// Connect to the database
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.error('MongoDB connection error:', err));

io.on('connection', (socket) => {
	console.log('New client connected');
	const usersByDocument = {};

	socket.on('join-document', async (documentId) => {
		socket.join(documentId);
		if (!usersByDocument[documentId]) {
			usersByDocument[documentId] = {};
		}
		usersByDocument[documentId][socket.id] = { color: `#${Math.floor(Math.random() * 16777215).toString(16)}` };
		console.log(`Client joined room: ${documentId}`);

		try {
			let document = await Document.findById(documentId);
			if (!document) {
				document = new Document({ _id: documentId, content: [] });
				await document.save();
			}
			socket.emit('document-update', document.content); // Send initial content
		} catch (error) {
			console.error('Error joining document:', error);
		}
	});

	socket.on('document-change', async ({ _id, delta }) => {
		try {
			console.log(`Broadcasting changes for document ID: ${_id}`);
			// Broadcast changes to other clients
			socket.to(_id).emit('document-update', delta);
		} catch (error) {
			console.error('Error broadcasting document changes:', error);
		}
	});

	socket.on('cursor-move', ({ documentId, range, color, name }) => {
		socket.to(documentId).emit('cursor-update', {
			userId: socket.id,
			range,
			color,
			name,
		});
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected');
		for (const documentId in usersByDocument) {
			delete usersByDocument[documentId][socket.id];
		}
	});
});

app.post('/saveDocument', async (req, res) => {
	const { documentId, content } = req.body;

	try {
		// Find the document by ID and update its content
		const document = await Document.findByIdAndUpdate(
			documentId,
			{ content, lastModified: new Date() },
			{ new: true, upsert: true } // Create document if it doesn't exist
		);

		res.status(200).json({ message: 'Document saved successfully', document });
	} catch (error) {
		console.error('Error saving document:', error);
		res.status(500).json({ message: 'Error saving document', error });
	}
});

app.post('/gemini-query', async (req, res) => {
	const { query } = req.body;

	try {
		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const prompt = query;

		const result = await model.generateContent(prompt);

		console.log("Full response from Gemini API:", result);
		const suggestions = result.response.text()

		res.status(200).json({ suggestions });
	} catch (error) {
		console.error('Error querying Gemini API:', error.message);
		console.error('Full error:', error);
		res.status(500).json({ error: 'Failed to fetch suggestions' });
	}
});

app.get('/getDocument/:id', async (req, res) => {
	try {
		const document = await Document.findById(req.params.id);

		if (document) {
			res.status(200).json({ content: document.content });
		} else {
			res.status(404).json({ message: 'Document not found' });
		}
	} catch (error) {
		console.error('Error fetching document:', error);
		res.status(500).json({ message: 'Error fetching document', error });
	}
});

app.post('/documents', async (req, res) => {
	try {
		const document = new Document(req.body);
		await document.save();
		res.status(201).send(document);
	} catch (error) {
		res.status(400).send(error);
	}
});

// post all documents
app.post('/fetchDocuments', async (req, res) => {
	try {
		const { projId } = req.body;
		const documents = await Document.find({ 'owner.projId': projId });
		res.json(documents);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post('/addMember', async (req, res) => {
	const { documentId, memberEmail } = req.body;

	try {
		const document = await Document.findById(documentId);
		if (!document) return res.status(404).json({ message: 'Document not found' });

		// Check if member already exists
		if (document.members.includes(memberEmail)) {
			return res.status(400).json({ message: 'Member already added' });
		}

		// Add the member
		document.members.push(memberEmail);
		await document.save();

		res.status(200).json({ message: 'Member added successfully' });
	} catch (error) {
		console.error('Error adding member:', error);
		res.status(500).json({ message: 'Error adding member', error });
	}
});

app.post('/renameDocuments/:id/:title', async (req, res) => {
	try {
		const documents = await Document.findByIdAndUpdate(
			req.params.id,
			{ $set: { title: req.params.title } }
		);
		res.json(documents);
	} catch (error) {
		res.status(500).send(error);
	}
});

// post a specific document
app.post('/documents/:id', async (req, res) => {
	try {
		const document = await findById(req.params.id);
		if (!document) {
			return res.status(404).send();
		}
		res.send(document);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Delete a document
app.post('/documents/delete/:id', async (req, res) => {
	try {
		const document = await Document.findByIdAndDelete(req.params.id);
		if (!document) {
			return res.status(404).send();
		}
		res.send(document);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Registration route
app.post('/api/auth/register', async (req, res) => {
	const { username, email, password } = req.body;

	try {
		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'Email already exists' });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new user
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
		});

		await newUser.save();
		res.status(201).json({ message: 'User registered successfully!' });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
});

// Login route
// Login route
app.post('/api/auth/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		// Find user by username
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const token = jwt.sign({
			id: user._id,
			username: user.username,
			email: user.email
		},
			process.env.SECRET_KEY,
			{
				expiresIn: '1h'
			});

		res.cookie('session_token', token, {
			httpOnly: true,
			secure: false, // Use secure cookies in production
			sameSite: 'strict',
			maxAge: 60 * 60 * 1000, // 1 hour
		});

		// Respond with success message (omit token for now)
		res.json({ message: 'Login successful!' });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
});

app.post('/logout', (req, res) => {
	res.clearCookie('session_token', {
		httpOnly: true,
		secure: false, // Use `true` in production
		sameSite: 'strict',
	});
	res.json({ message: 'Logout successful' });
});

app.post('/createTeam', async (req, res) => {
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
		res.status(201).json({ message: 'Team created successfully' });
	} catch (error) {
		console.error('Error creating team:', error);
		res.status(500).json({ message: 'Failed to create team' });
	}
});

app.post('/fetchTeams', async (req, res) => {
	const { owner } = req.body;

	try {
		const teams = await Team.find({ 'owner.email': owner });
		const memberTeams = await Team.find({ "members.email": owner });
		res.json({ teams: teams, memberTeams: memberTeams });
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post('/getTeamById', async (req, res) => {
	const { teamId } = req.body;

	try {
		const team = await Team.findById({ _id: teamId });
		res.json({ team: team });
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post('/updateTeamName', async (req, res) => {
	const { teamId, teamName } = req.body;

	try {
		const team = await Team.findByIdAndUpdate(teamId, { teamName: teamName });
		res.status(200).json({ team: team });
	}
	catch (error) {
		res.status(500).send(error);
	}
});

app.post('/addMemberToTeam', async (req, res) => {
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
});

app.post('/createProject', async (req, res) => {
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
});

app.post('/getProjByTeamId', async (req, res) => {
	const { teamId } = req.body;

	try {
		const projects = await Projects.find({ 'owner.teamId': teamId });
		res.json(projects);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post('/getProjByProjId', async (req, res) => {
	const { projId } = req.body;

	try {
		const projects = await Projects.findById({ _id: projId });
		res.json(projects);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post('/removeMemberFromTeam', async (req, res) => {
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
});

app.post('/fetchMembersUsingProjId', async (req, res) => {
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
});

app.post('/addModule', async (req, res) => {
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
});

app.post('/fetchModules', async (req, res) => {
	const { projId } = req.body;

	try {
		const modules = await Modules.find({ projId: projId });
		res.status(201).json({ modules: modules, message: 'Modules fetched successfully' });
	}
	catch (error) {
		console.error('Error creating module:', error);
		res.status(500).json({ message: 'Failed to fetch module' });
	}
});

app.post('/updateModule', async (req, res) => {
	const { moduleId, moduleName, assignedTo } = req.body;

	try {
		const module = await Modules.findById(moduleId);
		if (!module) return res.status(404).json({ message: 'Module not found' });
		console.log(moduleName, assignedTo);

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
});

app.post('/deleteModule', async (req, res) => {
	const { moduleId } = req.body;

	try {
		const module = await Modules.findByIdAndDelete(moduleId);
		if (!module) return res.status(404).json({ message: 'Module not found' });

		res.status(200).json({ deletedModule: module, message: 'Module deleted successfully' });
	}
	catch (error) {
		console.error('Error deleting module:', error);
		res.status(500).json({ message: 'Failed to delete module' });
	}
});

app.post('/addTask', async (req, res) => {
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

		const savedTask = module.tasks[module.tasks.length - 1];
		res.status(201).json({ savedTask: savedTask, message: 'Task created successfully' });
	}
	catch (error) {
		console.error('Error creating task:', error);
		res.status(500).json({ message: 'Failed to create task' });
	}
});

app.post('/updateTask', async (req, res) => {
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

		const updatedTask = module.tasks.find(t => t._id.toString() === taskId);
		return res.status(200).json({ message: 'Task updated successfully', updatedTask: updatedTask });
	}
	catch (error) {
		console.error('Error updating task:', error);
		res.status(500).json({ message: 'Failed to update task' });
	}
});

app.post('/deleteTask', async (req, res) => {
	const { moduleId, taskId } = req.body;

	try {
		const module = await Modules.findById(moduleId);
		const task = module.tasks.find(t => t._id.toString() === taskId);

		if (!task) return res.status(404).json({ message: 'Task not found' });

		module.tasks = module.tasks.filter(t => t._id.toString() !== taskId);
		await module.save();

		return res.status(200).json({ message: 'Task deleted successfully', deletedTask: task });
	}
	catch (error) {
		console.error('Error deleting task:', error);
		res.status(500).json({ message: 'Failed to delete task' });
	}
});

const authenticate = (req, res, next) => {
	const token = req.cookies.session_token;

	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
	try {
		const user = jwt.verify(token, process.env.SECRET_KEY); // Decode the token
		req.user = user; // Attach user info to the request
		next();
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return res.status(403).json({ error: 'Token has expired' });
		}
		return res.status(403).json({ error: 'Invalid or malformed token' });
	}
};

// Example protected route
app.post('/protected', authenticate, (req, res) => {
	res.json({ username: req.user.username, email: req.user.email });
});

app.post('/', (req, res) => {
	res.send('Server is running');
});


// Start the server
const PORT = process.env.PORT;
server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
