const express = require('express');
const router = express.Router();
const Design = require('../models/Design');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

// ================= SAVE DESIGN =================
router.post('/', auth, upload.single('designImage'), async (req, res) => {
    try {
        const { preview, product } = req.body;

        let imageUrl = null;

        // upload to cloudinary if file exists
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "designs");
            imageUrl = result.secure_url;
        }

        const design = new Design({
            user: req.user.id,
            preview,
            product,
            designImage: imageUrl
        });

        await design.save();

        res.json(design);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= GET USER DESIGNS =================
router.get('/', auth, async (req, res) => {
    const designs = await Design.find({ user: req.user.id })
        .populate('preview')
        .populate('product');

    res.json(designs);
});

// ================= DELETE DESIGN =================
router.delete('/:id', auth, async (req, res) => {
    await Design.findByIdAndDelete(req.params.id);
    res.json({ message: "Design deleted" });
});

module.exports = router;