import React from 'react';

export default function TaskList({ tasks, isLoading, error, onRefresh }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getPromptPreview = (prompt) => {
    if (!prompt) return '';
    return prompt.length > 80 ? `${prompt.substring(0, 80)}...` : prompt;
  };

  return (
    <div className="task-list-card">
      <div className="task-list-header">
        <h2>Recent Tasks ({tasks.length})</h2>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh List'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>Failed to load tasks:</strong> {error}
        </div>
      )}

      {isLoading && tasks.length === 0 && (
        <div className="loading-state">Loading tasks...</div>
      )}

      {!isLoading && !error && tasks.length === 0 && (
        <div className="empty-state">
          <p>No tasks found. Submit a new task above to get started.</p>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="table-responsive">
          <table className="task-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Prompt Preview</th>
                <th>Modality</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td className="font-mono text-sm">{task._id}</td>
                  <td className="prompt-preview" title={task.prompt}>
                    {getPromptPreview(task.prompt)}
                  </td>
                  <td>
                    <span className={`badge modality-${task.modality}`}>
                      {task.modality}
                    </span>
                  </td>
                  <td>
                    <span className={`badge status-${task.status}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="text-sm">{formatDate(task.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
