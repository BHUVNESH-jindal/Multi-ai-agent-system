const mongoose = require('mongoose');

const AttachmentSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    storedName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true }
  },
  { _id: false }
);

const TaskSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000
    },
    attachments: {
      type: [AttachmentSchema],
      default: []
    },
    modality: {
      type: String,
      enum: ['text', 'image', 'document', 'mixed'],
      default: 'text'
    },
    status: {
      type: String,
      enum: ['pending', 'classifying', 'planning', 'running', 'completed', 'failed'],
      default: 'pending'
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    error: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

TaskSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Task', TaskSchema);
