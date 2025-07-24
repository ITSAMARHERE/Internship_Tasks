import React, { useState } from 'react';
import api from '../services/api';

const Dashboard = ({ user, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = async () => {
    if (user.role !== 'admin') return;
    
    setLoading(true);
    try {
      const response = await api.protected.getAllUsers();
      setUsers(response.data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await api.protected.updateUserRole(userId, newRole);
      setSuccess('User role updated successfully!');
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    
    try {
      await api.protected.deactivateUser(userId);
      setSuccess('User deactivated successfully!');
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
    } finally {
      localStorage.removeItem('token');
      onLogout();
    }
  };

  const getRoleClass = (role) => {
    return `role-badge role-${role}`;
  };

  const canAccessAdminPanel = user.role === 'admin';
  const canAccessModeratorPanel = ['admin', 'moderator'].includes(user.role);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <div className="avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h2>{user.username}</h2>
            <span>{user.email}</span>
            <span className={getRoleClass(user.role)}>{user.role}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-danger btn-small">
          Logout
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="nav-menu">
        <div className="nav-item">
          <h3>Dashboard</h3>
          <p>Your personal dashboard</p>
        </div>

        <div className={`nav-item ${!canAccessModeratorPanel ? 'disabled' : ''}`}>
          <h3>Moderator Panel</h3>
          <p>{canAccessModeratorPanel ? 'Moderate content' : 'Access denied'}</p>
        </div>

        <div 
          className={`nav-item ${!canAccessAdminPanel ? 'disabled' : ''}`}
          onClick={() => {
            if (canAccessAdminPanel) {
              setShowAdminPanel(!showAdminPanel);
              if (!showAdminPanel) loadUsers();
            }
          }}
        >
          <h3>Admin Panel</h3>
          <p>{canAccessAdminPanel ? 'Manage users & system' : 'Access denied'}</p>
        </div>
      </div>

      {showAdminPanel && canAccessAdminPanel && (
        <div className="admin-panel">
          <h3>User Management</h3>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              Loading users...
            </div>
          ) : (
            <div className="users-list">
              {users.map(userItem => (
                <div key={userItem._id} className="user-card">
                  <div className="user-card-info">
                    <div className="avatar">
                      {userItem.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong>{userItem.username}</strong>
                      <br />
                      <small>{userItem.email}</small>
                      <span className={getRoleClass(userItem.role)}>
                        {userItem.role}
                      </span>
                      {!userItem.isActive && (
                        <span style={{color: '#e74c3c', marginLeft: '0.5rem'}}>
                          (Inactive)
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {userItem._id !== user._id && (
                    <div className="user-card-actions">
                      <select 
                        onChange={(e) => handleRoleUpdate(userItem._id, e.target.value)}
                        defaultValue={userItem.role}
                        className="btn-small"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                      
                      {userItem.isActive && (
                        <button 
                          onClick={() => handleDeactivateUser(userItem._id)}
                          className="btn btn-danger btn-small"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;