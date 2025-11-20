'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function UpdateMembershipPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [memberships, setMemberships] = useState<any[]>([]);
  const [selectedMembership, setSelectedMembership] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    action: 'extend',
    extensionMonths: 6,
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const response = await api.get('/reports/memberships');
      setMemberships(response.data);
    } catch (err) {
      setError('Failed to fetch memberships');
    }
  };

  const handleSelectMembership = (membership: any) => {
    setSelectedMembership(membership);
    setError('');
    setSuccess('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const action = formData.action === 'extend' ? 'extend' : 'cancel';
      await api.put(`/memberships/${selectedMembership.membershipNo}`, {
        action,
        extensionMonths: formData.extensionMonths,
      });

      setSuccess(`Membership ${action === 'extend' ? 'extended' : 'cancelled'} successfully!`);
      fetchMemberships();
      setSelectedMembership(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update membership');
    }
  };

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
      <div className="navbar">
        <h1>LMS - Update Membership</h1>
        <nav>
          <Link href="/admin/maintenance" style={{ color: 'white', textDecoration: 'none' }}>Maintenance</Link>
        </nav>
      </div>

      <div className="container">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="card">
          <h2>Select Membership to Update</h2>
          <table>
            <thead>
              <tr>
                <th>Membership No</th>
                <th>User Name</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((membership) => (
                <tr key={membership.id}>
                  <td>{membership.membershipNo}</td>
                  <td>{membership.name}</td>
                  <td>{membership.endDate}</td>
                  <td>{membership.status}</td>
                  <td>
                    <button onClick={() => handleSelectMembership(membership)}>Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedMembership && (
          <div className="card" style={{ maxWidth: '500px', marginTop: '30px' }}>
            <h2>Update Membership</h2>
            <p><strong>Membership:</strong> {selectedMembership.membershipNo}</p>
            <p><strong>User:</strong> {selectedMembership.name}</p>
            <p><strong>Current End Date:</strong> {selectedMembership.endDate}</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Action *</label>
                <select name="action" value={formData.action} onChange={handleChange}>
                  <option value="extend">Extend Membership</option>
                  <option value="cancel">Cancel Membership</option>
                </select>
              </div>

              {formData.action === 'extend' && (
                <div className="form-group">
                  <label>Extension Duration (Months) *</label>
                  <select name="extensionMonths" value={formData.extensionMonths} onChange={handleChange}>
                    <option value={6}>6 Months</option>
                    <option value={12}>1 Year</option>
                    <option value={24}>2 Years</option>
                  </select>
                </div>
              )}

              <button type="submit">
                {formData.action === 'extend' ? 'Extend Membership' : 'Cancel Membership'}
              </button>
              <button type="button" onClick={() => setSelectedMembership(null)}>Back</button>
            </form>
          </div>
        )}

        <Link href="/admin/maintenance">
          <button style={{ marginTop: '20px' }}>Back to Maintenance</button>
        </Link>
      </div>
    </>
  );
}
