const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: String, required: true }, // Owner's email or username
  content: { type: mongoose.Schema.Types.Mixed, default: {} }, // Quill Delta format
  members: { type: [String], default: [] }, // Members with access
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
