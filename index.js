const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded images
app.use('/uploads', express.static('uploads'));

// connect DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ROUTES

// auth
app.use('/api/auth', require('./routes/authRoutes'));

// preview
app.use('/api/previews', require('./routes/previewRoutes'));

// product
app.use('/api/products', require('./routes/productRoutes'));

// design
app.use('/api/designs', require('./routes/designRoutes'));

// favorite
app.use('/api/favorites', require('./routes/favoriteRoutes'));

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000", process.env.PORT);
});