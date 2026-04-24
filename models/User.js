const mongoose = require('mongoose');
const Counter = require('./Counter');

const userSchema = new mongoose.Schema({
    loginId: { type: Number, unique: true },

    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    token: { type: String },

    userrole: { type: String, default: "user" },

    name: String,
    profileImg: String,
    phoneNumber: String,
    email: String

}, { timestamps: true });


userSchema.pre('save', async function () {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { name: "loginId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        this.loginId = counter.seq;
    }
});

module.exports = mongoose.model('User', userSchema);