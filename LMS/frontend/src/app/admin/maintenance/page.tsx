'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MaintenancePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <>
      <div className="navbar">
        <h1>LMS - Maintenance Module</h1>
        <nav>
          <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        </nav>
      </div>

      <div className="container">
        <h2>Maintenance Management</h2>
        <p>Select an option to manage system data:</p>

        <div className="dashboard-grid" style={{ marginTop: '30px' }}>
          <Link href="/admin/maintenance/books/add">
            <div className="stat-card" style={{ cursor: 'pointer', backgroundColor: '#e8f4f8' }}>
              <h3>Add Book/Movie</h3>
              <p style={{ marginTop: '20px', fontSize: '14px' }}>Add new books, music, or videos to the library</p>
            </div>
          </Link>

          <Link href="/admin/maintenance/books/update">
            <div className="stat-card" style={{ cursor: 'pointer', backgroundColor: '#e8f4f8' }}>
              <h3>Update Book/Movie</h3>
              <p style={{ marginTop: '20px', fontSize: '14px' }}>Edit existing book information</p>
            </div>
          </Link>

          <Link href="/admin/maintenance/membership/add">
            <div className="stat-card" style={{ cursor: 'pointer', backgroundColor: '#f0e8f4' }}>
              <h3>Add Membership</h3>
              <p style={{ marginTop: '20px', fontSize: '14px' }}>Create new user membership</p>
            </div>
          </Link>

          <Link href="/admin/maintenance/membership/update">
            <div className="stat-card" style={{ cursor: 'pointer', backgroundColor: '#f0e8f4' }}>
              <h3>Update Membership</h3>
              <p style={{ marginTop: '20px', fontSize: '14px' }}>Extend or cancel membership</p>
            </div>
          </Link>

          <Link href="/admin/maintenance/users">
            <div className="stat-card" style={{ cursor: 'pointer', backgroundColor: '#e8f4e8' }}>
              <h3>User Management</h3>
              <p style={{ marginTop: '20px', fontSize: '14px' }}>Add and view users</p>
            </div>
          </Link>

          <Link href="/admin/maintenance/pending-issues">
            <div className="stat-card" style={{ cursor: 'pointer', backgroundColor: '#f4e8e8' }}>
              <h3>Pending Issues</h3>
              <p style={{ marginTop: '20px', fontSize: '14px' }}>View pending book issue requests</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
