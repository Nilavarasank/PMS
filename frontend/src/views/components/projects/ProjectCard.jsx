import { Link } from 'react-router-dom';
import { formatDate } from '@/core/validators';
import Button from '../common/Button';

export default function ProjectCard({ project, onEdit, onDelete, style }) {
  return (
    <article className="card project-card" style={style}>
      <div className="card-top">
        <h3>
          <Link to={`/projects/${project.id}`}>{project.name}</Link>
        </h3>
        <span className={`badge status-${project.status.replace(/\s+/g, '-').toLowerCase()}`}>
          {project.status}
        </span>
      </div>
      <p className="muted clamp">{project.description || 'No description yet.'}</p>
      <dl className="meta-row">
        <div>
          <dt>Start</dt>
          <dd>{formatDate(project.startDate)}</dd>
        </div>
        <div>
          <dt>End</dt>
          <dd>{formatDate(project.endDate)}</dd>
        </div>
      </dl>
      <div className="card-actions">
        <Button variant="secondary" onClick={() => onEdit(project)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(project)}>
          Delete
        </Button>
      </div>
    </article>
  );
}
