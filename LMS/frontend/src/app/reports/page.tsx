'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function ReportsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [reportType, setReportType] = useState('issued');
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchReport(reportType);
    }
  }, [reportType, user]);

  const fetchReport = async (type: string) => {
    setError('');
    try {
      let response;
      if (type === 'issued') {
        response = await api.get('/reports/issued-books');
      } else if (type === 'fines') {
        response = await api.get('/reports/fines');
      } else if (type === 'memberships') {
        response = await api.get('/reports/memberships');
      }
      setData(response?.data || []);
    } catch (err) {
      setError('Failed to fetch report');
    }
  };

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
      <div className="navbar">
        <h1>LMS - Reports</h1>
        <nav>
          <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        </nav>
      </div>

      <div className="container">
        <div className="card" style={{ marginBottom: '30px' }}>
          <h2>Reports</h2>
          <div className="form-group">
            <label>Select Report Type:</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="issued">Issued Books Report</option>
              <option value="fines">Fines Report</option>
              {user?.role === 'admin' && <option value="memberships">Memberships Report</option>}
            </select>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="card">
          {reportType === 'issued' && (
            <>
              <h2>Issued Books Report</h2>
              <table>
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>User</th>
                    <th>Issue Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr><td colSpan={6}>No data available</td></tr>
                  ) : (
                    data.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.author}</td>
                        <td>{item.userName}</td>
                        <td>{item.issueDate}</td>
                        <td>{item.returnDate}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}

          {reportType === 'fines' && (
            <>
              <h2>Fines Report</h2>
              <table>
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>User</th>
                    <th>Fine Amount (₹)</th>
                    <th>Return Date</th>
                    <th>Paid Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr><td colSpan={5}>No fines</td></tr>
                  ) : (
                    data.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.userName}</td>
                        <td>₹{item.fineAmount.toFixed(2)}</td>
                        <td>{item.actualReturnDate}</td>
                        <td>{item.isPaid ? 'Paid' : 'Pending'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}

          {reportType === 'memberships' && (
            <>
              <h2>Memberships Report</h2>
              <table>
                <thead>
                  <tr>
                    <th>Membership No</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr><td colSpan={6}>No data available</td></tr>
                  ) : (
                    data.map((item) => (
                      <tr key={item.id}>
                        <td>{item.membershipNo}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.startDate}</td>
                        <td>{item.endDate}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </>
  );
}
