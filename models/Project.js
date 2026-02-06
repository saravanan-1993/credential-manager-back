const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    description: {
        type: String
    },
    github: {
        frontend: {
            type: String
        },
        backend: {
            type: String
        }
    },
    env: {
        frontend: {
            type: String
        },
        backend: {
            type: String
        }
    },
    deploymentUrls: {
        frontend: {
            type: String
        },
        backend: {
            type: String
        }
    },
    status: {
        type: String,
        enum: ['Development', 'Staging', 'Production', 'Maintenance', 'Archived'],
        default: 'Development'
    },
    techStack: {
        frontend: {
            type: String
        },
        backend: {
            type: String
        }
    },
    notes: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
