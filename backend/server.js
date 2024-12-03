const express = require('express');
const mongoose = require('mongoose');
const http = require('http');  // Make sure this line is present
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Document = require('./models/Document');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // To handle JSON data
app.use(cors()); // To handle cross-origin requests

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL if different
    methods: ["GET", "POST"]
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

  // Join a document room
  socket.on('join-document', async (documentId) => {
    socket.join(documentId);
    console.log(`Client joined room: ${documentId}`);

    try {
      let document = await Document.findById(documentId);
      if (!document) {
        document = new Document({ _id: documentId, content: '' });
        await document.save();
      }
      socket.emit('document-update', document.content); // Send document content to the client
    } catch (error) {
      console.error('Error joining document:', error);
    }
  });

  // Leave a document room
  socket.on('leave-document', (documentId) => {
    socket.leave(documentId);
    console.log(`Client left room: ${documentId}`);
  });

  // Handle document changes
  socket.on('document-change', async ({ _id, delta, content }) => {
    try {
      await Document.findByIdAndUpdate(_id, { content, lastModified: new Date() });
      socket.to(_id).emit('document-update', content);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
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

// Get all documents
app.post('/fetchDocuments', async (req, res) => {
  try {
    const documents = await Document.find({});
    res.json(documents);
  } catch (error) {
    res.status(500).send(error);
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

// Get a specific document
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

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

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
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Respond with success message (omit token for now)
    res.json({ message: 'Login successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
