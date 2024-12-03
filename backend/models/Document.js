// models/Document.js
const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: String,
  content: {
    type: mongoose.Schema.Types.Mixed, // Allows storing JSON data
    default: {},             // Default to an empty object
  },
  lastModified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);