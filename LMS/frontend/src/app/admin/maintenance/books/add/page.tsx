'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function AddBookPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    type: 'book',
    title: '',
    author: '',
    isbn: '',
    serialNo: '',
    totalCopies: 1,
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

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

    if (!formData.title || !formData.author || !formData.isbn || !formData.serialNo) {
      setError('All fields are required');
      return;
    }

    try {
      await api.post('/books', formData);
      setSuccess('Book added successfully!');
      setFormData({ type: 'book', title: '', author: '', isbn: '', serialNo: '', totalCopies: 1 });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add book');
    }
  };

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
      <div className="navbar">
        <h1>LMS - Add Book/Movie</h1>
        <nav>
          <Link href="/admin/maintenance" style={{ color: 'white', textDecoration: 'none' }}>Maintenance</Link>
        </nav>
      </div>

      <div className="container">
        <div className="card" style={{ maxWidth: '500px' }}>
          <h2>Add New Book/Movie</h2>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Type *</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="book">Book</option>
                <option value="music">Music</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div className="form-group">
              <label>Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Author *</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>ISBN *</label>
              <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Serial Number *</label>
              <input type="text" name="serialNo" value={formData.serialNo} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Total Copies *</label>
              <input type="number" name="totalCopies" value={formData.totalCopies} onChange={handleChange} min="1" required />
            </div>

            <button type="submit">Add Book</button>
            <Link href="/admin/maintenance">
              <button type="button">Cancel</button>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
