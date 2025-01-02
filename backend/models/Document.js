const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
	title: { type: String, required: true },
	owner: {
		projId: {
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
	content: { type: mongoose.Schema.Types.Mixed, default: {} }, // Quill Delta format
	members: [{
		email: { type: String, required: true },
		username: { type: String, required: true }
	}],
	lastModified: { type: Date, default: Date.now }, // Timestamp of the last modification
	lastEditedBy: {
		user: { type: String }, // Username or email of the editor
		timestamp: { type: Date },
	},
	editHistory: [
		{
			user: { type: String }, // Editor
			timestamp: { type: Date }, // Timestamp of the edit
			changes: mongoose.Schema.Types.Mixed, // Delta or change summary
		},
	],
});

module.exports = mongoose.model('Document', DocumentSchema);
