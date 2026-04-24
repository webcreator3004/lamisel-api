const mongoose = require('mongoose');
const Counter = require('./Counter');

const productSchema = new mongoose.Schema({
  productId: { type: Number, unique: true },

  productName: { type: String, required: true },

  productImage: { type: String },

  series: { type: String },

  collection: { type: String }

}, { timestamps: true });


// auto increment
productSchema.pre('save', async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "productId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.productId = counter.seq;
  }
});

module.exports = mongoose.model('Product', productSchema);