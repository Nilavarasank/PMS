import { useState } from 'react';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  getApiError,
  toDateInput,
  validateTask,
} from '@/core/validators';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import Input from '../common/Input';

const EMPTY = {
  name: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  dueDate: '',
};

export default function TaskForm({ initialValue, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...initialValue,
    dueDate: toDateInput(initialValue?.dueDate),
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateTask(form);
    setErrors(nextErrors);
    setApiError('');
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate || undefined,
      });
    } catch (error) {
      setApiError(getApiError(error, 'Unable to save task'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="stack-form" onSubmit={handleSubmit} noValidate>
      <ErrorMessage message={apiError} />
      <Input
        id="task-name"
        label="Task name"
        value={form.name}
        onChange={onChange('name')}
        error={errors.name}
        required
      />
      <label className="field" htmlFor="task-description">
        <span className="field-label">Description</span>
        <textarea
          id="task-description"
          className="field-input"
          rows="3"
          value={form.description}
          onChange={onChange('description')}
        />
      </label>
      <div className="field-grid">
        <label className="field" htmlFor="task-priority">
          <span className="field-label">Priority</span>
          <select id="task-priority" className="field-input" value={form.priority} onChange={onChange('priority')}>
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>
        <label className="field" htmlFor="task-status">
          <span className="field-label">Status</span>
          <select id="task-status" className="field-input" value={form.status} onChange={onChange('status')}>
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Input
        id="due-date"
        label="Due date"
        type="date"
        value={form.dueDate}
        onChange={onChange('dueDate')}
      />
      <div className="card-actions">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
