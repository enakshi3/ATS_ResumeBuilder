/**
 * User Routes
 * Handles profile & preference updates
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

/* =========================
   GET CURRENT USER
   Used on refresh (/auth/me alternative)
========================= */

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user'
        });
    }
});

/* =========================
   UPDATE USER PROFILE
   Used by Settings page
========================= */

router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const allowedUpdates = [
            'name',
            'avatarUrl',
            'organizationId'
        ];

        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update profile'
        });
    }
});

/* =========================
   UPDATE USER PREFERENCES
========================= */

router.put('/preferences', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        user.preferences = {
            ...user.preferences,
            ...req.body
        };

        await user.save();

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Preferences update error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update preferences'
        });
    }
});

module.exports = router;
