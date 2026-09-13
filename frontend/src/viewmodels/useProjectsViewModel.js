import { useCallback, useEffect, useState } from 'react';
import { createProject, deleteProject, listProjects, updateProject } from '@/models/project.model';
import { getApiError } from '@/core/validators';

const EMPTY_FILTERS = {
  search: '',
  status: '',
  sortBy: 'created_at',
  order: 'desc',
  page: 1,
};

export function useProjectsViewModel() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [result, setResult] = useState({ data: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await listProjects({
        search: filters.search || undefined,
        status: filters.status || undefined,
        sortBy: filters.sortBy,
        order: filters.order,
        page: filters.page,
        limit: 10,
      });
      setResult(data);
    } catch (err) {
      setError(getApiError(err, 'Unable to load projects'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value, page: field === 'page' ? value : 1 }));
  };

  const handleCreate = async (payload) => {
    await createProject(payload);
    setModal(null);
    await load();
  };

  const handleUpdate = async (payload) => {
    await updateProject(modal.project.id, payload);
    setModal(null);
    await load();
  };

  const handleDelete = async () => {
    await deleteProject(pendingDelete.id);
    setPendingDelete(null);
    await load();
  };

  return {
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
  };
}
