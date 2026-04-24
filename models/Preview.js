const mongoose = require('mongoose');
const Counter = require('./Counter');

const previewSchema = new mongoose.Schema({
    previewId: { type: Number, unique: true },

    previewName: { type: String, required: true },

    previewImgs: [String], // store multiple images

    previewCategory: { type: String, required: true }

}, { timestamps: true });


// auto increment
previewSchema.pre('save', async function () {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { name: "previewId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        this.previewId = counter.seq;
    }
});

module.exports = mongoose.model('Preview', previewSchema);