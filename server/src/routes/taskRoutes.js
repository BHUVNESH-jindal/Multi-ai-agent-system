const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const taskController = require('../controllers/taskController');

router.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

router.post('/tasks', upload.array('files', 5), taskController.createTask);
router.get('/tasks', taskController.getTasks);
router.get('/tasks/:id', taskController.getTaskById);

module.exports = router;
