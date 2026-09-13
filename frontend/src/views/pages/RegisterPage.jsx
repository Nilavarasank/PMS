import { Navigate } from 'react-router-dom';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';
import RegisterForm from '@/views/components/auth/RegisterForm';
import AuthLayout from '@/views/layouts/AuthLayout';

export default function RegisterPage() {
  const { isAuthenticated } = useAuthViewModel();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <AuthLayout
      headline="A quieter way to manage work."
      blurb="Register once, then create projects, assign tasks, and watch the dashboard update."
      caption="Projects, tasks, and a live dashboard"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
