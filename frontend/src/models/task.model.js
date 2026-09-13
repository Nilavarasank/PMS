import httpClient from './httpClient';

export function listTasks(params) {
  return httpClient.get('/tasks', { params });
}

export function getTask(id) {
  return httpClient.get(`/tasks/${id}`);
}

export function createTask(payload) {
  return httpClient.post('/tasks', payload);
}

export function updateTask(id, payload) {
  return httpClient.put(`/tasks/${id}`, payload);
}

export function deleteTask(id) {
  return httpClient.delete(`/tasks/${id}`);
}
