const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            process.env.FRONTEND_URL
        ];
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Database Connection - cached for Vercel serverless
let isConnected = false;
async function connectDB() {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/magizh_asset_manager');
        isConnected = true;
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        throw err;
    }
}

// Ensure DB is connected before handling any API request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(503).json({ msg: 'Database connection failed' });
    }
});

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Magizh Asset Manager API is running' });
});

// Health Check
app.get('/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    res.status(dbState === 1 ? 200 : 503).json({
        status: dbState === 1 ? 'ok' : 'degraded',
        database: dbStatus[dbState] || 'unknown',
        uptime: process.uptime()
    });
});

const dashboardRoutes = require('./routes/dashboard');
const assetRoutes = require('./routes/assets');
const clientRoutes = require('./routes/clients');
const projectRoutes = require('./routes/projects');
const authRoutes = require('./routes/auth');

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ msg: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Server error' });
});

// Export for Vercel
module.exports = app;

// Only start the server if running directly (not required by Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
