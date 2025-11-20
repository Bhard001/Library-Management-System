'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function ReturnBookPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const issueId = searchParams.get('issueId');
  
  const [issue, setIssue] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fineId, setFineId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    actualReturnDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (issueId && user) {
      fetchIssueDetails();
    }
  }, [issueId, user]);

  const fetchIssueDetails = async () => {
    try {
      const response = await api.get(`/issues/user/${user?.id}`);
      const foundIssue = response.data.find((i: any) => i.id === parseInt(issueId || '0'));
      if (foundIssue) {
        setIssue(foundIssue);
        setFormData({
          actualReturnDate: new Date().toISOString().split('T')[0],
        });
      } else {
        setError('Issue record not found');
      }
    } catch (err) {
      setError('Failed to fetch issue details');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/issues/return', {
        issueId: issueId,
        actualReturnDate: formData.actualReturnDate,
      });
      setFineId(response.data.fineId);
      setSuccess('Book return processed. Proceeding to fine payment...');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to return book');
    }
  };

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;

  if (fineId) {
    return (
      <>
        <div className="navbar">
          <h1>LMS - Book Return</h1>
          <nav>
            <Link href="/transactions" style={{ color: 'white', textDecoration: 'none' }}>Transactions</Link>
          </nav>
        </div>

        <div className="container">
          <div className="card" style={{ maxWidth: '500px', textAlign: 'center' }}>
            <h2>Redirecting to Fine Payment...</h2>
            <p>Please wait while we process your fine payment...</p>
            {/* Redirect to fine page */}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="navbar">
        <h1>LMS - Return Book</h1>
        <nav>
          <Link href="/transactions" style={{ color: 'white', textDecoration: 'none' }}>Transactions</Link>
        </nav>
      </div>

      <div className="container">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {issue ? (
          <div className="card" style={{ maxWidth: '500px' }}>
            <h2>Return Book</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Book Title</label>
                <input type="text" value={issue.title} readOnly />
              </div>

              <div className="form-group">
                <label>Author</label>
                <input type="text" value={issue.author} readOnly />
              </div>

              <div className="form-group">
                <label>Serial Number</label>
                <input type="text" value={issue.serialNo} readOnly />
              </div>

              <div className="form-group">
                <label>Issue Date</label>
                <input type="date" value={issue.issueDate} readOnly />
              </div>

              <div className="form-group">
                <label>Original Return Date</label>
                <input type="date" value={issue.returnDate} readOnly />
              </div>

              <div className="form-group">
                <label>Actual Return Date *</label>
                <input
                  type="date"
                  name="actualReturnDate"
                  value={formData.actualReturnDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit">Return Book</button>
              <Link href="/transactions/my-books">
                <button type="button">Cancel</button>
              </Link>
            </form>
          </div>
        ) : (
          <p>Loading issue details...</p>
        )}
      </div>
    </>
  );
}
