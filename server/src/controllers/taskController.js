const mongoose = require('mongoose');
const Task = require('../models/Task');
const orchestrator = require('../services/orchestrator');
const { cleanupFiles } = require('../middleware/errorHandler');

const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const DOC_MIME_TYPES = ['application/pdf', 'text/plain'];

function determineModality(attachments) {
  if (!attachments || attachments.length === 0) {
    return 'text';
  }

  let hasImage = false;
  let hasDoc = false;

  for (const item of attachments) {
    if (IMAGE_MIME_TYPES.includes(item.mimeType)) {
      hasImage = true;
    } else if (DOC_MIME_TYPES.includes(item.mimeType)) {
      hasDoc = true;
    }
  }

  if (hasImage && hasDoc) {
    return 'mixed';
  }
  if (hasImage) {
    return 'image';
  }
  if (hasDoc) {
    return 'document';
  }
  return 'text';
}

async function createTask(req, res, next) {
  try {
    const rawPrompt = req.body.prompt;
    if (typeof rawPrompt !== 'string') {
      cleanupFiles(req.files);
      return res.status(400).json({ error: 'Prompt is required and must be a string.' });
    }

    const trimmedPrompt = rawPrompt.trim();
    if (!trimmedPrompt || trimmedPrompt.length > 10000) {
      cleanupFiles(req.files);
      return res.status(400).json({ error: 'Prompt is required and must be between 1 and 10000 characters.' });
    }

    const files = req.files || [];
    if (files.length > 5) {
      cleanupFiles(req.files);
      return res.status(400).json({ error: 'Maximum of 5 files allowed.' });
    }

    const attachments = files.map((file) => ({
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      size: file.size
    }));

    const modality = determineModality(attachments);

    const task = await Task.create({
      prompt: trimmedPrompt,
      attachments,
      modality,
      status: 'pending'
    });

    await orchestrator.enqueueTask(task);

    return res.status(201).json(task);
  } catch (error) {
    cleanupFiles(req.files);
    return next(error);
  }
}

async function getTaskById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
}

async function getTasks(req, res, next) {
  try {
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit)) {
      limit = 20;
    } else {
      limit = Math.max(1, Math.min(50, limit));
    }

    const tasks = await Task.find().sort({ createdAt: -1 }).limit(limit);
    return res.status(200).json(tasks);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createTask,
  getTaskById,
  getTasks
};
