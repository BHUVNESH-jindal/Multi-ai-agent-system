export async function createTask(formData) {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    body: formData
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Server error: ${response.status}`);
  }

  return data;
}

export async function getTasks(limit = 20) {
  const response = await fetch(`/api/tasks?limit=${limit}`);
  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(data.error || `Server error: ${response.status}`);
  }

  return data;
}

export async function getTask(id) {
  const response = await fetch(`/api/tasks/${id}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Server error: ${response.status}`);
  }

  return data;
}
