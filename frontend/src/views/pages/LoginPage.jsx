import { Navigate } from 'react-router-dom';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';
import LoginForm from '@/views/components/auth/LoginForm';
import AuthLayout from '@/views/layouts/AuthLayout';

export default function LoginPage() {
  const { isAuthenticated } = useAuthViewModel();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <AuthLayout
      headline="Keep every project moving."
      blurb="Plan work, track status, and see progress without the clutter."
      caption="Projects, tasks, and sign-off in one place"
    >
      <LoginForm />
    </AuthLayout>
  );
}
