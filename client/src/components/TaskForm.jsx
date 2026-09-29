import React, { useState, useRef } from 'react';
import { createTask } from '../api';

export default function TaskForm({ onTaskCreated }) {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [lastCreatedTask, setLastCreatedTask] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLastCreatedTask(null);

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setError('Prompt cannot be empty.');
      return;
    }

    if (trimmedPrompt.length > 10000) {
      setError('Prompt must be 10000 characters or less.');
      return;
    }

    if (files.length > 5) {
      setError('Maximum of 5 files allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('prompt', trimmedPrompt);
    files.forEach((file) => {
      formData.append('files', file);
    });

    setIsSubmitting(true);

    try {
      const createdTask = await createTask(formData);
      setLastCreatedTask(createdTask);
      setPrompt('');
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (onTaskCreated) {
        onTaskCreated(createdTask);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while creating the task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-form-card">
      <h2>Submit New Task</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="prompt-input">Task Prompt *</label>
          <textarea
            id="prompt-input"
            className="form-control"
            rows="4"
            placeholder="Enter task instructions or prompt (max 10,000 characters)..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isSubmitting}
            maxLength={10000}
          />
          <div className="char-count">{prompt.length} / 10,000</div>
        </div>

        <div className="form-group">
          <label htmlFor="file-input">Attachments (Optional, max 5 files, up to 10MB each)</label>
          <input
            id="file-input"
            ref={fileInputRef}
            type="file"
            className="file-input-control"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,text/plain"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
          <small className="help-text">
            Allowed formats: PNG, JPEG, WEBP, GIF, PDF, TXT
          </small>
        </div>

        {files.length > 0 && (
          <div className="selected-files">
            <strong>Selected Files ({files.length}):</strong>
            <ul>
              {files.map((file, idx) => (
                <li key={idx}>
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="alert alert-error" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {lastCreatedTask && (
          <div className="alert alert-success" role="status">
            <div><strong>Task Created Successfully!</strong></div>
            <div className="task-meta">
              <span><strong>ID:</strong> {lastCreatedTask._id}</span>
              <span><strong>Status:</strong> <span className={`badge status-${lastCreatedTask.status}`}>{lastCreatedTask.status}</span></span>
              <span><strong>Modality:</strong> <span className={`badge modality-${lastCreatedTask.modality}`}>{lastCreatedTask.modality}</span></span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Task...' : 'Submit Task'}
        </button>
      </form>
    </div>
  );
}
