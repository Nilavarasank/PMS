import { Link } from 'react-router-dom';
import { useRegisterViewModel } from '@/viewmodels/useRegisterViewModel';
import Button from '@/views/components/common/Button';
import ErrorMessage from '@/views/components/common/ErrorMessage';
import Input from '@/views/components/common/Input';

export default function RegisterForm() {
  const { form, errors, apiError, loading, onChange, onSubmit } = useRegisterViewModel();

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h1>Create your account</h1>
      <p className="muted">Start organizing projects and tasks in minutes.</p>
      <ErrorMessage message={apiError} />
      <Input
        id="fullName"
        label="Full name"
        value={form.fullName}
        onChange={onChange('fullName')}
        error={errors.fullName}
        autoComplete="name"
        required
      />
      <Input
        id="email"
        label="Email"
        type="email"
        value={form.email}
        onChange={onChange('email')}
        error={errors.email}
        autoComplete="email"
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        value={form.password}
        onChange={onChange('password')}
        error={errors.password}
        autoComplete="new-password"
        required
      />
      <Button type="submit" loading={loading}>
        Create account
      </Button>
      <p className="auth-switch">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </form>
  );
}
