const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
    },
    probability: {
        type: Number, // 0.0 – 1.0
        required: true,
    },
    status: {
        type: String,
        enum: ['Verified', 'To Check'],
        required: true
    },
    synced: {
        type: Boolean,
        default: false, // CRM sync status
    },
    syncedAt: {
        type: Date,
        default: null,
    }
}, { timestamps: true });

// Index for faster queries
userSchema.index({ status: 1, synced: 1 });

const User = mongoose.model("User", userSchema);
module.exports = User;