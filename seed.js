const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Client = require('./models/Client');
const Asset = require('./models/Asset');
const { encrypt } = require('./utils/encryption');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear existing data (optional, but good for resetting)
        // await User.deleteMany({});
        // await Client.deleteMany({});
        // await Asset.deleteMany({});

        // 1. Create Admin User
        let user = await User.findOne({ email: 'admin@magizh.com' });
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            user = new User({
                name: 'Saravanan (Admin)',
                email: 'admin@magizh.com',
                password: hashedPassword,
                role: 'admin'
            });
            await user.save();
            console.log('Admin User Created: admin@magizh.com / admin123');
        } else {
            console.log('Admin User already exists.');
        }

        // 2. Create Clients
        const clientCheck = await Client.findOne({ email: 'owner@magizh.com' });
        if (!clientCheck) {
            const client1 = new Client({
                companyName: 'Magizh NexGen',
                contactPerson: 'Saravanan',
                email: 'owner@magizh.com',
                projectType: 'SaaS',
                website: 'magizh.com',
                createdBy: user._id
            });
            await client1.save();
            console.log('Client Created: Magizh NexGen');

            // 3. Create Assets for this Client
            const asset1 = new Asset({
                client: client1._id,
                category: 'Domain',
                serviceName: 'magizh.com',
                identifier: 'GoDaddy',
                credentials: {
                    username: 'saravanan',
                    password: encrypt('SecretPass123'), // Encrypted
                },
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                createdBy: user._id
            });
            await asset1.save();
            console.log('Asset Created: magizh.com Domain');
        }

        console.log('Seeding Completed!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
