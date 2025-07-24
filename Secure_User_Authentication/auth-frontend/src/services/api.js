const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com/api' 
  : 'http://localhost:5000/api';

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

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth endpoints
  auth = {
    register: (userData) => this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    login: (credentials) => this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    getMe: () => this.request('/auth/me'),
    logout: () => this.request('/auth/logout', { method: 'POST' }),
  };

  // Protected endpoints
  protected = {
    getDashboard: () => this.request('/protected/dashboard'),
    getAllUsers: () => this.request('/protected/users'),
    updateUserRole: (userId, role) => this.request(`/protected/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
    deactivateUser: (userId) => this.request(`/protected/users/${userId}`, {
      method: 'DELETE',
    }),
  };
}

export default new ApiService();