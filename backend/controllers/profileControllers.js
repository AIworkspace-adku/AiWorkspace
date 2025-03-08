const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const update = async (req, res) => {
    try {
        const { username, oldEmail, email, password } = req.body;
        const oldUser = await User.findOne({ email: oldEmail });

        if (!oldUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        oldUser.username = username;
        oldUser.email = email;

        if (password !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            oldUser.password = hashedPassword;
        }

        await oldUser.save();
        return res.status(200).json({ message: 'User updated successfully' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    update
}