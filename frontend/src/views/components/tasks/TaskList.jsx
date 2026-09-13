import TaskCard from './TaskCard';

export default function TaskList({ tasks, onEdit, onDelete, onComplete, completingId }) {
  if (!tasks.length) {
    return (
      <div className="empty-state">
        <div className="empty-art" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <h3>No tasks match these filters</h3>
        <p>Add a task or clear the filters to see everything in this project.</p>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
          completing={completingId === task.id}
          style={{ '--delay': `${index * 70}ms` }}
        />
      ))}
    </div>
  );
}
