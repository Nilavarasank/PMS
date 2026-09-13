import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '@/views/layouts/AppLayout';
import ProtectedRoute from '@/views/routes/ProtectedRoute';
import LoginPage from '@/views/pages/LoginPage';
import RegisterPage from '@/views/pages/RegisterPage';
import DashboardPage from '@/views/pages/DashboardPage';
import ProjectsPage from '@/views/pages/ProjectsPage';
import ProjectDetailsPage from '@/views/pages/ProjectDetailsPage';
import NotFoundPage from '@/views/pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
