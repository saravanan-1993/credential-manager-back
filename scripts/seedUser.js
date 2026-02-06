require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

async function seedUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Define a simple user schema without hooks
        const UserSchema = new mongoose.Schema({
            name: String,
            email: { type: String, unique: true, lowercase: true },
            password: String,
            role: String
        }, { timestamps: true });

        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // Check if user already exists
        const existingUser = await User.findOne({ email: 'saravanan@mntfuture.com' });

        // Hash password manually
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Saravanan@061193', salt);

        if (existingUser) {
            console.log('User already exists. Updating password...');
            await User.updateOne(
                { email: 'saravanan@mntfuture.com' },
                { $set: { password: hashedPassword } }
            );
            console.log('Password updated successfully!');
        } else {
            // Create new user
            await User.create({
                name: 'Saravanan',
                email: 'saravanan@mntfuture.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('User created successfully!');
        }

        console.log('\n=================================');
        console.log('Email: saravanan@mntfuture.com');
        console.log('Password: Saravanan@061193');
        console.log('=================================\n');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding user:', error);
        process.exit(1);
    }
}

seedUser();
