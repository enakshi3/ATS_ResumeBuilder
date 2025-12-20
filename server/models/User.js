/**
 * User Model
 * Persistent MongoDB user schema
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false // ❗ NEVER return password by default
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: String,
            enum: ['owner', 'admin', 'member'],
            default: 'member'
        },

        organizationId: {
            type: String,
            default: null
        },

        avatarUrl: {
            type: String,
            default: null
        },

        preferences: {
            emailNotifications: {
                type: Boolean,
                default: true
            },
            weeklyDigest: {
                type: Boolean,
                default: true
            },
            theme: {
                type: String,
                enum: ['light', 'dark'],
                default: 'dark'
            }
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

/* =========================
   PASSWORD HASHING
========================= */

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

/* =========================
   PASSWORD COMPARISON
========================= */

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

/* =========================
   SAFE JSON OUTPUT
========================= */

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.__v;
    return user;
};

module.exports = mongoose.model('User', userSchema);
