'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function UserManagementPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userType: 'new',
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    try {
      await api.post('/users', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setSuccess('User added successfully!');
      fetchUsers();
      setFormData({ userType: 'new', name: '', email: '', password: '' });
      setShowForm(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add user');
    }
  };

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
      <div className="navbar">
        <h1>LMS - User Management</h1>
        <nav>
          <Link href="/admin/maintenance" style={{ color: 'white', textDecoration: 'none' }}>Maintenance</Link>
        </nav>
      </div>

      <div className="container">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '20px' }}>
          {showForm ? 'Cancel' : 'Add New User'}
        </button>

        {showForm && (
          <div className="card" style={{ maxWidth: '500px', marginBottom: '30px' }}>
            <h2>Add New User</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>User Type</label>
                <select name="userType" value={formData.userType} onChange={handleChange}>
                  <option value="new">New User</option>
                  <option value="existing">Existing User</option>
                </select>
              </div>

              <div className="form-group">
                <label>Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>

              <button type="submit">Add User</button>
            </form>
          </div>
        )}

        <div className="card">
          <h2>All Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Link href="/admin/maintenance">
          <button style={{ marginTop: '20px' }}>Back to Maintenance</button>
        </Link>
      </div>
    </>
  );
}
