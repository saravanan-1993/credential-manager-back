const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    contactPerson: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    projectType: {
        type: String,
        enum: ['Web', 'App', 'SaaS', 'SEO', 'Other'],
        default: 'Web'
    },
    website: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    notes: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Client', ClientSchema);
