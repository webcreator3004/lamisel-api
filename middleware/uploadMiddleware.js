const multer = require("multer");

// store file in memory instead of disk
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;