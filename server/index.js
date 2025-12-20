/**
 * Saanvi ResumeATS - Backend Server
 * Main entry point
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth');
const scanRoutes = require('./routes/scans');
const resumeRoutes = require('./routes/resumes');
const jobRoutes = require('./routes/jobs');
const aiRoutes = require('./routes/ai');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5002', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Saanvi ResumeATS Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Database connection and server start
async function startServer() {
    try {
        // Try to connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB');
    } catch (err) {
        console.warn('⚠ MongoDB connection failed, running in memory-mode');
        console.warn('  To use MongoDB, ensure it\'s running on localhost:27017');
        // Server will still work with in-memory data
    }

    app.listen(PORT, () => {
        console.log(`✓ Server running on http://localhost:${PORT}`);
        console.log(`  Health check: http://localhost:${PORT}/api/health`);
    });
}

startServer();
