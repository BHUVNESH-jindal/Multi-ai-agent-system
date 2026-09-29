const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const uploadsDir = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const storedName = `${crypto.randomUUID()}${ext}`;
    cb(null, storedName);
  }
});

const allowedMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/pdf',
  'text/plain'
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(`File type '${file.mimetype}' is not allowed. Allowed types: PNG, JPEG, WEBP, GIF, PDF, TXT.`);
    error.status = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit per file
  },
  fileFilter
});

module.exports = upload;
