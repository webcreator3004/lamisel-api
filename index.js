const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Added for better path handling
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images - Use path.join for cross-platform compatibility
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect DB - Added recommended options for stability
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Exit if DB fails to connect
  });

// ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/previews', require('./routes/previewRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/designs', require('./routes/designRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));

// Root route for health checks (Helps Render monitor the app)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// CRITICAL FIX: Bind to 0.0.0.0 and use the dynamic PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
