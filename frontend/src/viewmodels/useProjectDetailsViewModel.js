import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProject } from '@/models/project.model';
import { createTask, deleteTask, listTasks, updateTask } from '@/models/task.model';
import { getApiError } from '@/core/validators';

const EMPTY_FILTERS = {
  search: '',
  status: '',
  priority: '',
  sortBy: 'created_at',
  order: 'desc',
  page: 1,
};

export function useProjectDetailsViewModel() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [result, setResult] = useState({ data: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [completingId, setCompletingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [projectRes, taskRes] = await Promise.all([
        getProject(id),
        listTasks({
          projectId: id,
          search: filters.search || undefined,
          status: filters.status || undefined,
          priority: filters.priority || undefined,
          sortBy: filters.sortBy,
          order: filters.order,
          page: filters.page,
          limit: 10,
        }),
      ]);
      setProject(projectRes.data);
      setResult(taskRes.data);
    } catch (err) {
      setError(getApiError(err, 'Unable to load project'));
    } finally {
      setLoading(false);
    }
  }, [id, filters]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value, page: field === 'page' ? value : 1 }));
  };

  const handleCreate = async (payload) => {
    await createTask({ ...payload, projectId: id });
    setModal(null);
    await load();
  };

  const handleUpdate = async (payload) => {
    await updateTask(modal.task.id, payload);
    setModal(null);
    await load();
  };

  const handleComplete = async (task) => {
    setCompletingId(task.id);
    try {
      await updateTask(task.id, {
        name: task.name,
        description: task.description,
        priority: task.priority,
        status: 'Completed',
        dueDate: task.dueDate || undefined,
      });
      await load();
    } catch (err) {
      setError(getApiError(err, 'Unable to update task'));
    } finally {
      setCompletingId(null);
    }
  };

  const handleDelete = async () => {
    await deleteTask(pendingDelete.id);
    setPendingDelete(null);
    await load();
  };

  return {
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
  };
}
