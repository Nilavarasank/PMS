import httpClient from './httpClient';

export function listProjects(params) {
  return httpClient.get('/projects', { params });
}

export function getProject(id) {
  return httpClient.get(`/projects/${id}`);
}

export function createProject(payload) {
  return httpClient.post('/projects', payload);
}

export function updateProject(id, payload) {
  return httpClient.put(`/projects/${id}`, payload);
}

export function deleteProject(id) {
  return httpClient.delete(`/projects/${id}`);
}
