// models/Document.js
const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: String,
  owner: String,
  content: {
    type: mongoose.Schema.Types.Mixed, // Allows storing JSON data
    default: {},             // Default to an empty object
  },
  members: { type: [String], default: [] },
  lastModified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);