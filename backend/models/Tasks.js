// User Schema

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    owner: {
        projId: {
            type: String,
        },
        moduleId: {
            type: String,
        }
    },
    assignedTo: [{
        email: { type: String, required: true },
        username: { type: String, required: true }
    }],
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    }
});

// Create the User model from the schema
module.exports = mongoose.model('Tasks', taskSchema);