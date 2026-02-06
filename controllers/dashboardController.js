const Client = require('../models/Client');
const Asset = require('../models/Asset');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalClients = await Client.countDocuments();
        const activeClients = await Client.countDocuments({ status: 'Active' });
        const inactiveClients = await Client.countDocuments({ status: 'Inactive' });
        const totalAssets = await Asset.countDocuments();

        // Calculate total annual renewal cost
        const assets = await Asset.find();
        const totalRenewalAmount = assets.reduce((acc, curr) => acc + (curr.renewalCost || 0), 0);

        // Count expiring soon (next 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const expiringSoon = await Asset.countDocuments({
            expiryDate: {
                $gte: new Date(),
                $lte: thirtyDaysFromNow
            }
        });

        const recentActivity = []; // Placeholder for activity logs

        res.json({
            totalClients,
            activeClients,
            inactiveClients,
            totalAssets,
            totalRenewalAmount,
            expiringSoon,
            recentActivity
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
