import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (name) => {
    try {
      const newUser = await ApiService.createUser(name);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      throw err;
    }
  };

  const updateUserPoints = (leaderboard) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => {
        const updatedUser = leaderboard.find(lb => lb._id === user._id);
        return updatedUser ? { ...user, totalPoints: updatedUser.totalPoints } : user;
      });
      
      // Sort users by points in descending order for real-time sorting
      return updatedUsers.sort((a, b) => b.totalPoints - a.totalPoints);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    addUser,
    updateUserPoints,
    refetch: fetchUsers
  };
}