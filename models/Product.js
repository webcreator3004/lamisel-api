const mongoose = require('mongoose');
const Counter = require('./Counter');

const productSchema = new mongoose.Schema({
  productId: { type: Number, unique: true },
  productName: { type: String, required: true },
  productImage: { type: String },
  series: { type: String },
  collectionName: { type: String }
}, { timestamps: true });

// MODERN FIX: Remove 'next' from the arguments and use async/await properly
productSchema.pre('save', async function () {
  // Only run this logic if it's a brand-new document
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "productId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      
      this.productId = counter.seq;
      // In async hooks, you don't need to call next() manually
    } catch (error) {
      // Re-throwing the error will stop the save process automatically
      throw error; 
    }
  }
});

module.exports = mongoose.model('Product', productSchema);