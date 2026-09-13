import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiError, validateLogin } from '@/core/validators';
import { useAuthViewModel } from './AuthViewModel';

export function useLoginViewModel() {
  const { login } = useAuthViewModel();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateLogin(form);
    setErrors(nextErrors);
    setApiError('');
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setApiError(getApiError(error, 'Invalid credentials'));
    } finally {
      setLoading(false);
    }
  };

  return { form, errors, apiError, loading, onChange, onSubmit };
}
