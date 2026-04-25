const mongoose = require('mongoose');
const Counter = require('./Counter');

const productSchema = new mongoose.Schema({
  productId: { type: Number, unique: true },
  productName: { type: String, required: true },
  productImage: { type: String },
  series: { type: String },
  // Changed from 'collection' to 'category' or 'collectionName'
  collectionName: { type: String }
}, { timestamps: true });

// auto increment logic remains the same
productSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "productId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.productId = counter.seq;
      next(); // Don't forget next() to continue the save process
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Product', productSchema);