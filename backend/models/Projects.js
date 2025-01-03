// User Schema

const mongoose = require('mongoose');

const projSchema = new mongoose.Schema({
    projName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    owner: {
        teamId: {
            type: String,
        },
        email: {
            type: String,
            match: [/.+\@.+\..+/, 'Please enter a valid email address'],
        },
        username: {
            type: String,
        }
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

// Create the User model from the schema
module.exports = mongoose.model('Projects', projSchema);