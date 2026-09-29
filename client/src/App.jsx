import React, { useState, useEffect, useCallback } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { getTasks } from './api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTasks(20);
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskCreated = () => {
    fetchTasks();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-badge">STEP 1 INGESTION HUB</div>
        <h1>Adaptive Multi-Agent AI Orchestration Platform</h1>
        <p className="subtitle">Task creation, attachment ingestion & queue status tracker</p>
      </header>

      <main className="app-main">
        <TaskForm onTaskCreated={handleTaskCreated} />
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          error={error}
          onRefresh={fetchTasks}
        />
      </main>

      <footer className="app-footer">
        <p>Step 1 Ingestion Platform &bull; Express + MongoDB + React + Vite</p>
      </footer>
    </div>
  );
}
