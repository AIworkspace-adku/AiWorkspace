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
        status: { type: Boolean, default: false },
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

// Middleware to ensure that assignedTo in tasks is a subset of assignedTo in the module
moduleSchema.pre('save', function (next) {
    const assignedToEmails = this.assignedTo.map(user => user.email);

    // Loop through all tasks and filter out any assignedTo users not in the outer assignedTo array
    this.tasks.forEach(task => {
        task.assignedTo = task.assignedTo.filter(user => assignedToEmails.includes(user.email));
    });

    next(); // Proceed with saving the document
});

// Create the User model from the schema
module.exports = mongoose.model('Modules', moduleSchema);