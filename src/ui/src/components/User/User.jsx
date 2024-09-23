import React, { useState, useEffect } from 'react';
import { UserAPI } from '../../services/api';

const User = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState(null);  // ID for editing a user

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await UserAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Create or Update user
  const handleSave = async () => {
    const userData = { username, email, password };
    try {
      if (editingId) {
        await UserAPI.update(editingId, userData);
      } else {
        await UserAPI.create(userData);
      }
      setEditingId(null);
      fetchUsers();  // Refresh list
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await UserAPI.delete(id);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Populate form for editing
  const handleEdit = (user) => {
    setEditingId(user.id);
    setUsername(user.username);
    setEmail(user.email);
    setPassword(user.password);
  };

  // Reset form after save or edit
  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="container">
      <h2>Users</h2>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSave}>{editingId ? 'Update' : 'Save'}</button>
      </div>

      {/* List of users */}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.email}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
