const express = require('express');
const router = express.Router();
const Preview = require('../models/Preview');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const uploadToCloudinary = require('../utils/uploadToCloudinary');


// ================= CREATE PREVIEW =================
router.post('/', auth, upload.array('previewImgs', 2), async (req, res) => {
  try {
    const { previewName, previewCategory } = req.body;

    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await uploadToCloudinary(file.buffer, "previews");
        imageUrls.push(result.secure_url);
      }
    }
    const preview = new Preview({
      previewName,
      previewCategory,
      previewImgs: imageUrls
    });

    await preview.save();

    res.json(preview);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= GET ALL =================
router.get('/', async (req, res) => {
  const previews = await Preview.find();
  res.json(previews);
});


// ================= GET SINGLE =================
router.get('/:id', async (req, res) => {
  const preview = await Preview.findById(req.params.id);
  res.json(preview);
});


// ================= UPDATE =================
router.put('/:id', auth, async (req, res) => {
  const preview = await Preview.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(preview);
});


// ================= DELETE =================
router.delete('/:id', auth, async (req, res) => {
  await Preview.findByIdAndDelete(req.params.id);
  res.json({ message: "Preview deleted" });
});

module.exports = router;