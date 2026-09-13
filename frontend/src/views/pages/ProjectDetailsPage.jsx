import { Link } from 'react-router-dom';
import { useProjectDetailsViewModel } from '@/viewmodels/useProjectDetailsViewModel';
import { TASK_PRIORITIES, TASK_STATUSES, formatDate } from '@/core/validators';
import Button from '@/views/components/common/Button';
import ErrorMessage from '@/views/components/common/ErrorMessage';
import Loader from '@/views/components/common/Loader';
import Modal from '@/views/components/common/Modal';
import TaskForm from '@/views/components/tasks/TaskForm';
import TaskList from '@/views/components/tasks/TaskList';

export default function ProjectDetailsPage() {
  const {
    project,
    filters,
    result,
    loading,
    error,
    modal,
    pendingDelete,
    completingId,
    setModal,
    setPendingDelete,
    setFilter,
    setFilters,
    handleCreate,
    handleUpdate,
    handleComplete,
    handleDelete,
  } = useProjectDetailsViewModel();

  return (
    <div className="page-stack">
      <Link to="/projects" className="back-link">← Back to projects</Link>
      {loading && !project ? <Loader label="Loading project…" /> : null}
      <ErrorMessage message={error} />
      {project ? (
        <header className="page-header">
          <div>
            <p className="eyebrow">{project.status}</p>
            <h1>{project.name}</h1>
            <p className="muted">{project.description || 'No description yet.'}</p>
            <p className="muted">
              {formatDate(project.startDate)} – {formatDate(project.endDate)}
            </p>
          </div>
          <Button onClick={() => setModal({ mode: 'create' })}>New task</Button>
        </header>
      ) : null}

      <section className="board">
        <div className="toolbar toolbar-4">
          <input
            className="field-input"
            type="search"
            placeholder="Search tasks"
            value={filters.search}
            onChange={(event) => setFilter('search', event.target.value)}
          />
          <select className="field-input" value={filters.status} onChange={(event) => setFilter('status', event.target.value)}>
            <option value="">All statuses</option>
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select className="field-input" value={filters.priority} onChange={(event) => setFilter('priority', event.target.value)}>
            <option value="">All priorities</option>
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          <select
            className="field-input"
            value={`${filters.sortBy}:${filters.order}`}
            onChange={(event) => {
              const [sortBy, order] = event.target.value.split(':');
              setFilters((current) => ({ ...current, sortBy, order, page: 1 }));
            }}
          >
            <option value="created_at:desc">Newest first</option>
            <option value="due_date:asc">Due date</option>
            <option value="priority:desc">Priority</option>
            <option value="name:asc">Name A–Z</option>
          </select>
        </div>

        {loading ? <Loader label="Loading tasks…" /> : (
          <TaskList
            tasks={result.data}
            onEdit={(task) => setModal({ mode: 'edit', task })}
            onDelete={setPendingDelete}
            onComplete={handleComplete}
            completingId={completingId}
          />
        )}

        <div className="pager">
          <Button variant="secondary" disabled={result.page <= 1} onClick={() => setFilter('page', result.page - 1)}>
            Previous
          </Button>
          <span>
            Page {result.page} of {result.totalPages} · {result.total} total
          </span>
          <Button variant="secondary" disabled={result.page >= result.totalPages} onClick={() => setFilter('page', result.page + 1)}>
            Next
          </Button>
        </div>
      </section>

      {modal ? (
        <Modal title={modal.mode === 'edit' ? 'Edit task' : 'New task'} onClose={() => setModal(null)}>
          <TaskForm
            initialValue={modal.task}
            submitLabel={modal.mode === 'edit' ? 'Save changes' : 'Create task'}
            onSubmit={modal.mode === 'edit' ? handleUpdate : handleCreate}
            onCancel={() => setModal(null)}
          />
        </Modal>
      ) : null}

      {pendingDelete ? (
        <Modal title="Delete task?" onClose={() => setPendingDelete(null)}>
          <p>Delete <strong>{pendingDelete.name}</strong>? This cannot be undone.</p>
          <div className="card-actions">
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>Cancel</Button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
