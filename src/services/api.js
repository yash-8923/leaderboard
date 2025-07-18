const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}/api${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is HTML (likely an error page)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error(`Server returned HTML instead of JSON. Check if API server is running at ${API_BASE_URL}`);
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', {
        message: error.message,
        url,
        endpoint,
        baseUrl: API_BASE_URL
      });
      throw error;
    }
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  async createUser(name) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getUserById(id) {
    return this.request(`/users/${id}`);
  }

  // Leaderboard
  async getLeaderboard() {
    return this.request('/leaderboard');
  }

  // Claims
  async claimPoints(userId) {
    return this.request('/claim', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async getClaimHistory(userId) {
    return this.request(`/claim/history/${userId}`);
  }

  async getAllClaimHistory(page = 1, limit = 20) {
    return this.request(`/claim/history?page=${page}&limit=${limit}`);
  }

  // System
  async healthCheck() {
    return this.request('/health');
  }

  async getStatus() {
    return this.request('/status');
  }
}

export default new ApiService();