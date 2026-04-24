const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const uploadToCloudinary = require('../utils/uploadToCloudinary');


// ================= REGISTER =================
router.post('/register', async (req, res) => {
    try {
        const { username, password, name, phoneNumber, email } = req.body;

        // check existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            name,
            phoneNumber,
            email
        });

        await user.save();

        res.json({ message: "User registered" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ================= LOGIN =================
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: "Wrong password" });

        // prevent multiple login (optional)
        // if (user.token) {
        //     return res.status(400).json({ message: "Already logged in" });
        // }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // always generate new token
        user.token = token;
        await user.save();

        res.json({ token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ================= GET PROFILE =================
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ================= UPDATE PROFILE =================
router.put('/profile', auth, async (req, res) => {
    try {
        const { password } = req.body;

        // hash password if updating
        if (password) {
            req.body.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            req.body,
            { new: true }
        ).select('-password');

        res.json(user);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ================= DELETE USER =================
router.delete('/profile', auth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ================= LOGOUT =================
router.post('/logout', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        user.token = null;
        await user.save();

        res.json({ message: "Logged out" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ================= PROFILE IMAGE UPLOAD =================
router.put('/profile/image', auth, upload.single('profileImg'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const user = await User.findById(req.user.id);

        const result = await uploadToCloudinary(req.file.buffer, "users");

        user.profileImg = result.secure_url;

        await user.save();

        res.json(user);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;