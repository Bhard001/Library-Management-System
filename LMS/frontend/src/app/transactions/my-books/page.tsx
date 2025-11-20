'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function MyBooksPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [issues, setIssues] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchIssuedBooks();
    }
  }, [user]);

  const fetchIssuedBooks = async () => {
    try {
      const response = await api.get(`/issues/user/${user?.id}`);
      setIssues(response.data);
    } catch (err) {
      setError('Failed to fetch issued books');
    }
  };

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
      <div className="navbar">
        <h1>LMS - My Books</h1>
        <nav>
          <Link href="/transactions" style={{ color: 'white', textDecoration: 'none' }}>Transactions</Link>
        </nav>
      </div>

      <div className="container">
        {error && <div className="error">{error}</div>}

        <div className="card">
          <h2>Books Currently Issued to You</h2>
          {issues.length === 0 ? (
            <p>You have not issued any books yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Serial No</th>
                  <th>Issue Date</th>
                  <th>Return Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id}>
                    <td>{issue.title}</td>
                    <td>{issue.author}</td>
                    <td>{issue.serialNo}</td>
                    <td>{issue.issueDate}</td>
                    <td>{issue.returnDate}</td>
                    <td>
                      <Link href={`/transactions/return?issueId=${issue.id}`}>
                        <button>Return</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Link href="/transactions">
          <button style={{ marginTop: '20px' }}>Back to Transactions</button>
        </Link>
      </div>
    </>
  );
}
