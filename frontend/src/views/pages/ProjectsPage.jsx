import { useProjectsViewModel } from '@/viewmodels/useProjectsViewModel';
import { PROJECT_STATUSES } from '@/core/validators';
import Button from '@/views/components/common/Button';
import ErrorMessage from '@/views/components/common/ErrorMessage';
import Loader from '@/views/components/common/Loader';
import Modal from '@/views/components/common/Modal';
import ProjectForm from '@/views/components/projects/ProjectForm';
import ProjectList from '@/views/components/projects/ProjectList';

export default function ProjectsPage() {
  const {
    filters,
    result,
    loading,
    error,
    modal,
    pendingDelete,
    setModal,
    setPendingDelete,
    setFilter,
    setFilters,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useProjectsViewModel();

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>Projects</h1>
          <p className="muted">Search, filter, and keep every initiative in one place.</p>
        </div>
        <Button onClick={() => setModal({ mode: 'create' })}>New project</Button>
      </header>

      <section className="board">
        <div className="toolbar">
          <input
            className="field-input"
            type="search"
            placeholder="Search by name"
            value={filters.search}
            onChange={(event) => setFilter('search', event.target.value)}
          />
          <select
            className="field-input"
            value={filters.status}
            onChange={(event) => setFilter('status', event.target.value)}
          >
            <option value="">All statuses</option>
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
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
            <option value="created_at:asc">Oldest first</option>
            <option value="name:asc">Name A–Z</option>
            <option value="name:desc">Name Z–A</option>
            <option value="status:asc">Status</option>
          </select>
        </div>

        <ErrorMessage message={error} />
        {loading ? <Loader label="Loading projects…" /> : (
          <ProjectList
            projects={result.data}
            onEdit={(project) => setModal({ mode: 'edit', project })}
            onDelete={setPendingDelete}
          />
        )}

        <div className="pager">
          <Button
            variant="secondary"
            disabled={result.page <= 1}
            onClick={() => setFilter('page', result.page - 1)}
          >
            Previous
          </Button>
          <span>
            Page {result.page} of {result.totalPages} · {result.total} total
          </span>
          <Button
            variant="secondary"
            disabled={result.page >= result.totalPages}
            onClick={() => setFilter('page', result.page + 1)}
          >
            Next
          </Button>
        </div>
      </section>

      {modal ? (
        <Modal
          title={modal.mode === 'edit' ? 'Edit project' : 'New project'}
          onClose={() => setModal(null)}
        >
          <ProjectForm
            initialValue={modal.project}
            submitLabel={modal.mode === 'edit' ? 'Save changes' : 'Create project'}
            onSubmit={modal.mode === 'edit' ? handleUpdate : handleCreate}
            onCancel={() => setModal(null)}
          />
        </Modal>
      ) : null}

      {pendingDelete ? (
        <Modal title="Delete project?" onClose={() => setPendingDelete(null)}>
          <p>This deletes <strong>{pendingDelete.name}</strong> and all of its tasks.</p>
          <div className="card-actions">
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
