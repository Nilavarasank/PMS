import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiError, validateRegister } from '@/core/validators';
import { useAuthViewModel } from './AuthViewModel';

export function useRegisterViewModel() {
  const { register } = useAuthViewModel();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateRegister(form);
    setErrors(nextErrors);
    setApiError('');
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setApiError(getApiError(error, 'Unable to create account'));
    } finally {
      setLoading(false);
    }
  };

  return { form, errors, apiError, loading, onChange, onSubmit };
}
