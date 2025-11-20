'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
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
        <h1>LMS - Dashboard</h1>
        <nav>
          <span style={{ marginRight: '20px' }}>Welcome, {user?.name}</span>
          <a onClick={() => { logout(); router.push('/login'); }}>Logout</a>
        </nav>
      </div>

      <div className="container">
        <h2>Welcome to Library Management System</h2>

        {user?.role === 'admin' && (
          <>
            <h3 style={{ marginTop: '30px' }}>Admin Controls</h3>
            <div className="dashboard-grid">
              <Link href="/admin/maintenance">
                <div className="stat-card" style={{ cursor: 'pointer', backgroundColor: '#e8f4f8' }}>
                  <h3>Maintenance</h3>
                  <p style={{ marginTop: '20px' }}>Manage Books, Users & Memberships</p>
                </div>
              </Link>
              <Link href="/reports">
                <div className="stat-card" style={{ cursor: 'pointer', backgroundColor: '#f0e8f4' }}>
                  <h3>Reports</h3>
                  <p style={{ marginTop: '20px' }}>View System Reports</p>
                </div>
              </Link>
            </div>
          </>
        )}

        {user?.role === 'user' && (
          <>
            <h3 style={{ marginTop: '30px' }}>User Options</h3>
            <div className="dashboard-grid">
              <Link href="/transactions">
                <div className="stat-card" style={{ cursor: 'pointer', backgroundColor: '#e8f4e8' }}>
                  <h3>Transactions</h3>
                  <p style={{ marginTop: '20px' }}>Issue & Return Books</p>
                </div>
              </Link>
              <Link href="/reports">
                <div className="stat-card" style={{ cursor: 'pointer', backgroundColor: '#f0e8f4' }}>
                  <h3>Reports</h3>
                  <p style={{ marginTop: '20px' }}>View Your Transactions</p>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
