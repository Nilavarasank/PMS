import { useEffect, useState } from 'react';
import { getDashboard } from '@/models/dashboard.model';
import { getApiError } from '@/core/validators';
import { useAuthViewModel } from './AuthViewModel';

export function useDashboardViewModel() {
  const { user } = useAuthViewModel();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getDashboard()
      .then(({ data }) => {
        if (active) setStats(data);
      })
      .catch((err) => {
        if (active) setError(getApiError(err, 'Unable to load dashboard'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { user, stats, loading, error };
}
