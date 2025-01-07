// User Schema

const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    moduleName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    projId: {
        type: String,
        required: true,
    },
    assignedTo: [{
        email: { type: String, required: true },
        username: { type: String, required: true }
    }],
    tasks: [{
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
        status: { type: Number, enum: [0, 1], default: 0 },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date,
            default: Date.now
        }
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
module.exports = mongoose.model('Modules', moduleSchema);