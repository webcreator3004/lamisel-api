const mongoose = require('mongoose');
const Counter = require('./Counter');

const favoriteSchema = new mongoose.Schema({
  favoriteId: { type: Number, unique: true },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  design: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design'
  }

}, { timestamps: true });


// auto increment
favoriteSchema.pre('save', async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "favoriteId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.favoriteId = counter.seq;
  }
});

module.exports = mongoose.model('Favorite', favoriteSchema);