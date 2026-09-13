import httpClient from './httpClient';

export function registerUser(payload) {
  return httpClient.post('/auth/register', payload);
}

export function loginUser(payload) {
  return httpClient.post('/auth/login', payload);
}

export function logoutUser() {
  return httpClient.post('/auth/logout');
}
