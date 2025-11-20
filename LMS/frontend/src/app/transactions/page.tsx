'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function TransactionsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <>
      <div className="navbar">
        <h1>LMS - Transactions</h1>
        <nav>
          <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        </nav>
      </div>

      <div className="container">
        <h2>Book Transactions</h2>
        <p>Manage your book transactions:</p>

        <div className="dashboard-grid" style={{ marginTop: '30px' }}>
          <Link href="/transactions/issue">
            <div className="stat-card" style={{ cursor: 'pointer', backgroundColor: '#e8f4f8' }}>
              <h3>Issue Book</h3>
              <p style={{ marginTop: '20px', fontSize: '14px' }}>Request to issue a book from the library</p>
            </div>
          </Link>

          <Link href="/transactions/return">
            <div className="stat-card" style={{ cursor: 'pointer', backgroundColor: '#e8f4e8' }}>
              <h3>Return Book</h3>
              <p style={{ marginTop: '20px', fontSize: '14px' }}>Return a book you have issued</p>
            </div>
          </Link>

          <Link href="/transactions/my-books">
            <div className="stat-card" style={{ cursor: 'pointer', backgroundColor: '#f0e8f4' }}>
              <h3>My Books</h3>
              <p style={{ marginTop: '20px', fontSize: '14px' }}>View all books issued to you</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
