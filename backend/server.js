const express = require('express');
const mongoose = require('mongoose');
const http = require('http');  // Make sure this line is present
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const allowedOrigins = [
	'http://localhost:3000',
	'https://aiworkspace-frontend-repo.onrender.com',
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

// Handle preflight requests
app.options('*', cors());

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: allowedOrigins, // Replace with your frontend URL if different
		methods: ["post", "POST"]
	}
});

// Connect to the database
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.error('MongoDB connection error:', err));

const socketHandlers = require('./utils/socketIO/socket');
const docRoutes = require('./routes/docRoutes/docRoutes');
const authRoutes = require('./routes/authRoutes/authRoutes');
const teamRoutes = require('./routes/teamRoutes/teamRoutes');
const projRoutes = require('./routes/projRoutes/projRoutes');
const modTaskRoutes = require('./routes/modTaskRoutes/modTaskRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes/scheduleRoutes');
const queryRoutes = require('./routes/queryRoutes/queryRoutes');
const profileRoutes = require('./routes/profileRoutes/profileRoutes');

const groupRoutes = require('./routes/groupRoutes/groupRoutes');
socketHandlers(io);
app.use('/', docRoutes);
app.use('/api/auth', authRoutes);
app.use('/teams', teamRoutes);
app.use('/projects', projRoutes);
app.use('/modTask', modTaskRoutes);
app.use('/meeting', scheduleRoutes);
app.use('/Gpt', queryRoutes);
app.use('/profile', profileRoutes);
app.use('/api/group', groupRoutes);

app.post('/', (req, res) => {
	res.send('Server is running');
});


// Start the server
const PORT = process.env.PORT;
server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
