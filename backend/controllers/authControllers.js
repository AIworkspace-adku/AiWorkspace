const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
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
};

const login = async (req, res) => {
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
			secure: true, // Use secure cookies in production
			sameSite: 'strict',
			maxAge: 60 * 60 * 1000, // 1 hour
		});

		// Respond with success message (omit token for now)
		res.json({ message: 'Login successful!' });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

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

const logout = (req, res) => {
	res.clearCookie('session_token', {
		httpOnly: true,
		secure: true, // Use `true` in production
		sameSite: 'strict',
	});
	res.json({ message: 'Logout successful' });
};

module.exports = {
    register,
    login,
    authenticate,
	logout
}