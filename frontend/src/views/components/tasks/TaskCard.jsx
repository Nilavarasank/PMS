import { formatDate } from '@/core/validators';
import Button from '../common/Button';

export default function TaskCard({ task, onEdit, onDelete, onComplete, completing, style }) {
  const done = task.status === 'Completed';

  return (
    <article className="card task-card" style={style}>
      <div className="card-top">
        <h3>{task.name}</h3>
        <div className="chip-row">
          {task.priority ? (
            <span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
          ) : null}
          <span className={`badge status-${task.status.replace(/\s+/g, '-').toLowerCase()}`}>
            {task.status}
          </span>
        </div>
      </div>
      <p className="muted clamp">{task.description || 'No description yet.'}</p>
      <p className="due">Due {formatDate(task.dueDate)}</p>
      <div className="card-actions">
        {!done ? (
          <Button variant="secondary" loading={completing} onClick={() => onComplete(task)}>
            Mark as Completed
          </Button>
        ) : null}
        <Button variant="secondary" onClick={() => onEdit(task)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(task)}>
          Delete
        </Button>
      </div>
    </article>
  );
}
