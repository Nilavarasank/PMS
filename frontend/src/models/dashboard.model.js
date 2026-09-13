import httpClient from './httpClient';

export function getDashboard() {
  return httpClient.get('/dashboard');
}
