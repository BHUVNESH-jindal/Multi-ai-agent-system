const multer = require('multer');
const fs = require('fs');

function cleanupFiles(files) {
  if (Array.isArray(files)) {
    files.forEach((file) => {
      if (file.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error(`Failed to delete uploaded file ${file.path}:`, err.message);
        }
      }
    });
  }
}

function errorHandler(err, req, res, next) {
  if (req.files) {
    cleanupFiles(req.files);
  }

  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds maximum limit of 10 MB per file.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.code === 'LIMIT_FILE_COUNT') {
      message = 'Maximum of 5 files allowed.';
    } else {
      message = err.message;
    }
  }

  res.status(statusCode).json({ error: message });
}

module.exports = {
  errorHandler,
  cleanupFiles
};
