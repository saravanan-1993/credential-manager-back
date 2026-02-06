const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    category: {
        type: String,
        enum: ['Domain', 'Hosting', 'Server', 'Email', 'Database', 'Cloudinary', 'Other'],
        required: true
    },
    serviceName: {
        type: String, // e.g., "GoDaddy", "AWS", "Gmail"
        required: true
    },
    identifier: {
        type: String // e.g., domain name, IP address, email ID
    },
    credentials: {
        username: String,
        password: String, // Encrypted
        apiKey: String,   // Encrypted
        apiSecret: String, // Encrypted
        additionalKey: String // Encrypted
    },
    config: {
        host: String,
        port: String,
        dbName: String,
        url: String
    },
    expiryDate: {
        type: Date
    },
    autoRenew: {
        type: Boolean,
        default: false
    },
    notes: String,
    renewalCost: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'INR'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Asset', AssetSchema);
