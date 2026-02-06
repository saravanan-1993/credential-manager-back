const Client = require('../models/Client');

exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createClient = async (req, res) => {
    try {
        const { companyName, contactPerson, email, phone, projectType, website, notes } = req.body;
        const newClient = new Client({
            companyName,
            contactPerson,
            email,
            phone,
            projectType,
            website,
            notes
        });
        const client = await newClient.save();
        res.json(client);
    } catch (err) {
        console.error("Create Client Error:", err.message);
        res.status(500).json({ msg: err.message });
    }
};

const Asset = require('../models/Asset');

exports.updateClient = async (req, res) => {
    try {
        const { companyName, contactPerson, email, phone, projectType, website, notes, status } = req.body;
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ msg: 'Client not found' });

        const updateFields = {};
        if (companyName !== undefined) updateFields.companyName = companyName;
        if (contactPerson !== undefined) updateFields.contactPerson = contactPerson;
        if (email !== undefined) updateFields.email = email;
        if (phone !== undefined) updateFields.phone = phone;
        if (projectType !== undefined) updateFields.projectType = projectType;
        if (website !== undefined) updateFields.website = website;
        if (notes !== undefined) updateFields.notes = notes;
        if (status !== undefined) updateFields.status = status;

        const updated = await Client.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true });
        res.json(updated);
    } catch (err) {
        console.error("Update Client Error:", err.message);
        res.status(500).json({ msg: err.message });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ msg: 'Client not found' });
        await Asset.deleteMany({ client: req.params.id });
        await Client.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Client deleted' });
    } catch (err) {
        console.error("Delete Client Error:", err.message);
        res.status(500).json({ msg: err.message });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ msg: 'Client not found' });

        const assets = await Asset.find({ client: req.params.id }).sort({ createdAt: -1 });

        res.json({ client, assets });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
