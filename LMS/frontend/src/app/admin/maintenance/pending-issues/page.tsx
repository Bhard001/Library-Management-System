'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function PendingIssuesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
      <div className="navbar">
        <h1>LMS - Pending Issues</h1>
        <nav>
          <Link href="/admin/maintenance" style={{ color: 'white', textDecoration: 'none' }}>Maintenance</Link>
        </nav>
      </div>

      <div className="container">
        <div className="card">
          <h2>Pending Issue Requests</h2>
          <p>No pending issue requests at the moment. All book issue requests are processed automatically.</p>
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#7f8c8d' }}>
            Users can view their issued books in the "My Books" section of Transactions.
          </p>
        </div>

        <Link href="/admin/maintenance">
          <button style={{ marginTop: '20px' }}>Back to Maintenance</button>
        </Link>
      </div>
    </>
  );
}
