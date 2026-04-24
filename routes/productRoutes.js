const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const uploadToCloudinary = require('../utils/uploadToCloudinary');



// ================= CREATE PRODUCT =================
router.post('/', auth, upload.single('productImage'), async (req, res) => {
  try {
    const { productName, series, collection } = req.body;

    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "products");
      imageUrl = result.secure_url;
    }

    const product = new Product({
      productName,
      series,
      collection,
      productImage: imageUrl
    });

    await product.save();

    res.json(product);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= GET ALL PRODUCTS =================
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});


// ================= GET SINGLE PRODUCT =================
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});


// ================= UPDATE PRODUCT =================
router.put('/:id', auth, async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(product);
});


// ================= DELETE PRODUCT =================
router.delete('/:id', auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;