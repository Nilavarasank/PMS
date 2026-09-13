import { Link } from 'react-router-dom';
import { useLoginViewModel } from '@/viewmodels/useLoginViewModel';
import Button from '@/views/components/common/Button';
import ErrorMessage from '@/views/components/common/ErrorMessage';
import Input from '@/views/components/common/Input';

export default function LoginForm() {
  const { form, errors, apiError, loading, onChange, onSubmit } = useLoginViewModel();

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h1>Welcome back</h1>
      <p className="muted">Sign in to continue your projects.</p>
      <ErrorMessage message={apiError} />
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
        autoComplete="current-password"
        required
      />
      <Button type="submit" loading={loading}>
        Sign in
      </Button>
      <p className="auth-switch">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </form>
  );
}
