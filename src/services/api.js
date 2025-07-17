const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Users
  async getUsers() {
    return this.request('/api/users');
  }

  async createUser(name) {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getUserById(id) {
    return this.request(`/api/users/${id}`);
  }

  // Leaderboard
  async getLeaderboard() {
    return this.request('/api/leaderboard');
  }

  // Claims
  async claimPoints(userId) {
    return this.request('/api/claim', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async getClaimHistory(userId) {
    return this.request(`/api/claim/history/${userId}`);
  }

  async getAllClaimHistory(page = 1, limit = 20) {
    return this.request(`/api/claim/history?page=${page}&limit=${limit}`);
  }

  // System
  async healthCheck() {
    return this.request('/api/health');
  }

  async getStatus() {
    return this.request('/api/status');
  }
}

export default new ApiService();