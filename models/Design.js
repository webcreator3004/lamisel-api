const mongoose = require('mongoose');
const Counter = require('./Counter');

const designSchema = new mongoose.Schema({
    designId: { type: Number, unique: true },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    preview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Preview'
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },

    designImage: { type: String }

}, { timestamps: true });


// auto increment
designSchema.pre('save', async function () {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { name: "designId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        this.designId = counter.seq;
    }
});

module.exports = mongoose.model('Design', designSchema);