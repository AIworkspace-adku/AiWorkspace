// Schedule Schema

const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    moto: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    teamId: {
        type: String,
        required: true,
    },
    projId: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: ""
    },
    time: {
        type: String,
        default: ""
    },
    reminder: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Schedule', scheduleSchema);