import { Link } from 'react-router-dom';
import { useDashboardViewModel } from '@/viewmodels/useDashboardViewModel';
import DashboardSummary from '@/views/components/dashboard/DashboardSummary';
import ErrorMessage from '@/views/components/common/ErrorMessage';
import Loader from '@/views/components/common/Loader';

export default function DashboardPage() {
  const { user, stats, loading, error } = useDashboardViewModel();

  return (
    <div className="page-stack">
      <header className="page-header hero-panel">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Hello, {user?.fullName?.split(' ')[0] || 'there'}</h1>
          <p className="muted">A live snapshot of your projects and tasks.</p>
        </div>
        <Link to="/projects" className="btn btn-primary">
          Go to projects
        </Link>
      </header>
      {loading ? <Loader label="Loading dashboard…" /> : null}
      <ErrorMessage message={error} />
      {stats ? <DashboardSummary stats={stats} /> : null}
    </div>
  );
}
