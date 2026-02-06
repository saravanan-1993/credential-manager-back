const Asset = require('../models/Asset');
const { encrypt, decrypt } = require('../utils/encryption');

// Get All Assets
exports.getAllAssets = async (req, res) => {
    try {
        const assets = await Asset.find().populate('client', 'companyName').sort({ createdAt: -1 });
        const maskedAssets = assets.map(asset => {
            const doc = asset.toObject();
            if (doc.credentials) {
                if (doc.credentials.password) doc.credentials.password = '••••••••';
                if (doc.credentials.apiKey) doc.credentials.apiKey = '••••••••';
            }
            return doc;
        });
        res.json(maskedAssets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAssets = async (req, res) => {
    try {
        const assets = await Asset.find({ client: req.params.clientId }).sort({ createdAt: -1 });
        // Return masked credentials by default
        const maskedAssets = assets.map(asset => {
            const doc = asset.toObject();
            if (doc.credentials) {
                if (doc.credentials.password) doc.credentials.password = '••••••••';
                if (doc.credentials.apiKey) doc.credentials.apiKey = '••••••••';
            }
            return doc;
        });
        res.json(maskedAssets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createAsset = async (req, res) => {
    try {
        const { client, category, serviceName, identifier, credentials, expiryDate, renewalCost, currency } = req.body;

        if (!client) {
            return res.status(400).json({ msg: 'Client is required' });
        }

        let encryptedCreds = {};
        if (credentials) {
            encryptedCreds = { ...credentials };
            if (credentials.password) encryptedCreds.password = encrypt(credentials.password);
            if (credentials.apiKey) encryptedCreds.apiKey = encrypt(credentials.apiKey);
            if (credentials.apiSecret) encryptedCreds.apiSecret = encrypt(credentials.apiSecret);
        }

        const newAsset = new Asset({
            client,
            category,
            serviceName,
            identifier,
            credentials: encryptedCreds,
            expiryDate: expiryDate || undefined,
            renewalCost: renewalCost || 0,
            currency: currency || 'INR'
        });

        const asset = await newAsset.save();
        res.json(asset);
    } catch (err) {
        console.error("Create Asset Error:", err.message);
        res.status(500).json({ msg: err.message });
    }
};

exports.revealAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (!asset) return res.status(404).json({ msg: 'Asset not found' });

        const doc = asset.toObject();
        if (doc.credentials) {
            if (doc.credentials.password) doc.credentials.password = decrypt(doc.credentials.password);
            if (doc.credentials.apiKey) doc.credentials.apiKey = decrypt(doc.credentials.apiKey);
        }

        res.json(doc);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateAsset = async (req, res) => {
    try {
        const { client, category, serviceName, identifier, credentials, expiryDate, renewalCost, currency, notes } = req.body;
        const asset = await Asset.findById(req.params.id);

        if (!asset) return res.status(404).json({ msg: 'Asset not found' });

        // Build update object
        const updateFields = {
            client,
            category,
            serviceName,
            identifier,
            expiryDate,
            renewalCost,
            currency,
            notes
        };

        // Handle credentials encryption if they are actually sent (and not masked)
        if (credentials) {
            const encryptedCreds = { ...asset.credentials };

            if (credentials.username) encryptedCreds.username = credentials.username;

            // Only re-encrypt if the user provided a NEW non-masked string
            if (credentials.password && credentials.password !== '••••••••') {
                encryptedCreds.password = encrypt(credentials.password);
            }
            if (credentials.apiKey && credentials.apiKey !== '••••••••') {
                encryptedCreds.apiKey = encrypt(credentials.apiKey);
            }
            if (credentials.apiSecret && credentials.apiSecret !== '••••••••') {
                encryptedCreds.apiSecret = encrypt(credentials.apiSecret);
            }

            updateFields.credentials = encryptedCreds;
        }

        const updatedAsset = await Asset.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );

        res.json(updatedAsset);
    } catch (err) {
        console.error("Update Asset Error:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.renewAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (!asset) return res.status(404).json({ msg: 'Asset not found' });

        if (asset.expiryDate) {
            const newDate = new Date(asset.expiryDate);
            newDate.setFullYear(newDate.getFullYear() + 1);
            asset.expiryDate = newDate;
            await asset.save();
        }

        res.json(asset);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
