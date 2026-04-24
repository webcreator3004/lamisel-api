const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const auth = require('../middleware/authMiddleware');


// ================= ADD TO FAVORITE =================
router.post('/', auth, async (req, res) => {
    try {
        const { design } = req.body;    

        // prevent duplicate favorite
        const exists = await Favorite.findOne({
            user: req.user.id,
            design
        });

        if (exists) {
            return res.status(400).json("Already in favorites");
        }

        const favorite = new Favorite({
            user: req.user.id,
            design
        });

        await favorite.save();

        res.json(favorite);

    } catch (err) {
        console.error(err); // 👈 ADD THIS
        res.status(500).json({ error: err.message });
    }
});


// ================= GET USER FAVORITES =================
router.get('/', auth, async (req, res) => {
    const favorites = await Favorite.find({ user: req.user.id })
        .populate({
            path: 'design',
            populate: ['preview', 'product']
        });

    res.json(favorites);
});


// ================= REMOVE FAVORITE =================
router.delete('/:id', auth, async (req, res) => {
    await Favorite.findByIdAndDelete(req.params.id);
    res.json("Removed from favorites");
});

module.exports = router;