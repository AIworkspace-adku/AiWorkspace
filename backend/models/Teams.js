// User Schema

const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    owner: {
        email: {
            type: String,
            match: [/.+\@.+\..+/, 'Please enter a valid email address'],
        },
        username: {
            type: String,
        }
    },
    members: [{
        email: { type: String, required: true },
        username: { type: String, required: true }
    }],
    creationDate: {
        type: Date,
        default: Date.now
    }
});

// Create the User model from the schema
module.exports = mongoose.model('Team', teamSchema);