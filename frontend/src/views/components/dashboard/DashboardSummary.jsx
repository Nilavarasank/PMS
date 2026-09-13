import StatCard from './StatCard';

export default function DashboardSummary({ stats }) {
  return (
    <div className="stat-grid">
      <StatCard label="Total projects" value={stats.totalProjects} />
      <StatCard label="Total tasks" value={stats.totalTasks} />
      <StatCard label="Completed tasks" value={stats.completedTasks} tone="success" />
      <StatCard label="Pending tasks" value={stats.pendingTasks} tone="warning" />
      <StatCard label="Projects in progress" value={stats.projectsInProgress} tone="info" />
    </div>
  );
}
