const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PROJECT_STATUSES = ['Not Started', 'In Progress', 'Completed'];
export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed'];
export const TASK_PRIORITIES = ['Low', 'Medium', 'High'];

export function getApiError(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.message || error?.message || fallback;
}

export function validateRegister({ fullName, email, password }) {
  const errors = {};
  if (!fullName?.trim()) errors.fullName = 'Full name is required';
  if (!email?.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
  return errors;
}

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email?.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  return errors;
}

export function validateProject({ name, startDate, endDate, status }) {
  const errors = {};
  if (!name?.trim()) errors.name = 'Project name is required';
  if (status && !PROJECT_STATUSES.includes(status)) {
    errors.status = 'Select a valid status';
  }
  if (startDate && endDate && endDate < startDate) {
    errors.endDate = 'End date must be on or after the start date';
  }
  return errors;
}

export function validateTask({ name, priority, status }) {
  const errors = {};
  if (!name?.trim()) errors.name = 'Task name is required';
  if (priority && !TASK_PRIORITIES.includes(priority)) {
    errors.priority = 'Select a valid priority';
  }
  if (status && !TASK_STATUSES.includes(status)) {
    errors.status = 'Select a valid status';
  }
  return errors;
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function toDateInput(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}
