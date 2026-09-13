import { useState } from 'react';
import { PROJECT_STATUSES, getApiError, toDateInput, validateProject } from '@/core/validators';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import Input from '../common/Input';

const EMPTY = {
  name: '',
  description: '',
  status: 'Not Started',
  startDate: '',
  endDate: '',
};

export default function ProjectForm({ initialValue, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...initialValue,
    startDate: toDateInput(initialValue?.startDate),
    endDate: toDateInput(initialValue?.endDate),
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateProject(form);
    setErrors(nextErrors);
    setApiError('');
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      });
    } catch (error) {
      setApiError(getApiError(error, 'Unable to save project'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="stack-form" onSubmit={handleSubmit} noValidate>
      <ErrorMessage message={apiError} />
      <Input
        id="project-name"
        label="Project name"
        value={form.name}
        onChange={onChange('name')}
        error={errors.name}
        required
      />
      <label className="field" htmlFor="project-description">
        <span className="field-label">Description</span>
        <textarea
          id="project-description"
          className="field-input"
          rows="3"
          value={form.description}
          onChange={onChange('description')}
        />
      </label>
      <label className="field" htmlFor="project-status">
        <span className="field-label">Status</span>
        <select id="project-status" className="field-input" value={form.status} onChange={onChange('status')}>
          {PROJECT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <div className="field-grid">
        <Input
          id="start-date"
          label="Start date"
          type="date"
          value={form.startDate}
          onChange={onChange('startDate')}
        />
        <Input
          id="end-date"
          label="End date"
          type="date"
          value={form.endDate}
          onChange={onChange('endDate')}
          error={errors.endDate}
        />
      </div>
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
