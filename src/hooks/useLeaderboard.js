import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getLeaderboard();
      setLeaderboard(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return {
    leaderboard,
    loading,
    error,
    refetch: fetchLeaderboard,
    updateLeaderboard: setLeaderboard
  };
}