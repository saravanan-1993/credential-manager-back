const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String,
        required: true // e.g., 'LOGIN', 'VIEW_SECRET', 'CREATE_ASSET'
    },
    details: {
        type: String
    },
    ipAddress: {
        type: String
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId
    },
    targetModel: {
        type: String // 'Asset', 'Client'
    }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
