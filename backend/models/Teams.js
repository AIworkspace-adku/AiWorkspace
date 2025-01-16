// User Schema

const mongoose = require('mongoose');
const Modules = require('./Modules');
const Projects = require('./Projects');

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

// Pre middleware for "findOneAndUpdate" or "findByIdAndUpdate"
teamSchema.pre('updateOne', async function (next) {
    try {
        const update = this.getUpdate();
        console.log("Hi there");
        const memberEmail = update.$pull && update.$pull.members && update.$pull.members.email;
        const teamId = this._conditions._id; // Get the teamId from the query condition (the team being updated)

        if (memberEmail) {
            // First, find all the modules where the teamId matches
            const modules = await Modules.find({ teamId: teamId });

            if (modules.length > 0) {
                // Remove the member from the modules' assignedTo array
                await Modules.updateMany(
                    { teamId: teamId, "assignedTo.email": memberEmail },
                    { $pull: { assignedTo: { email: memberEmail } } }
                );

                // Remove the member from the tasks' assignedTo array within those modules
                await Modules.updateMany(
                    { teamId: teamId, "tasks.assignedTo.email": memberEmail },
                    { $pull: { "tasks.$[].assignedTo": { email: memberEmail } } }
                );
            }
        }

        next(); // Proceed with the update operation
    } catch (error) {
        console.error('Error removing member from modules and tasks:', error);
        next(error); // Proceed with the error if any occurs
    }
});

teamSchema.pre('remove', async function (next) {
    try {
        const teamId = this._id; // Get the teamId from the current document

        // Find and delete all projects that have the teamId in the owner field
        const projects = await Projects.find({ 'owner.teamId': teamId });

        if (projects.length > 0) {
            // Delete all projects related to this team
            await Projects.deleteMany({ 'owner.teamId': teamId });
            console.log(`Deleted ${projects.length} projects related to team with ID: ${teamId}`);
        }

        next(); // Proceed with the team removal
    } catch (error) {
        console.error('Error removing related projects:', error);
        next(error); // Pass any error to the next middleware
    }
});

// Create the User model from the schema
module.exports = mongoose.model('Team', teamSchema);