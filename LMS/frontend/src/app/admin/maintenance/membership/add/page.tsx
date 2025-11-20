'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function AddMembershipPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    userId: '',
    durationMonths: 6,
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
      [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.userId) {
      setError('Please select a user');
      return;
    }

    try {
      const response = await api.post('/memberships', {
        userId: parseInt(formData.userId),
        durationMonths: formData.durationMonths,
      });
      setSuccess(`Membership ${response.data.membershipNo} created successfully!`);
      setFormData({ userId: '', durationMonths: 6 });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add membership');
    }
  };

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
      <div className="navbar">
        <h1>LMS - Add Membership</h1>
        <nav>
          <Link href="/admin/maintenance" style={{ color: 'white', textDecoration: 'none' }}>Maintenance</Link>
        </nav>
      </div>

      <div className="container">
        <div className="card" style={{ maxWidth: '500px' }}>
          <h2>Add New Membership</h2>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select User *</label>
              <select name="userId" value={formData.userId} onChange={handleChange} required>
                <option value="">-- Select User --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Duration (Months) *</label>
              <select name="durationMonths" value={formData.durationMonths} onChange={handleChange}>
                <option value={6}>6 Months</option>
                <option value={12}>1 Year</option>
                <option value={24}>2 Years</option>
              </select>
            </div>

            <button type="submit">Add Membership</button>
            <Link href="/admin/maintenance">
              <button type="button">Cancel</button>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
