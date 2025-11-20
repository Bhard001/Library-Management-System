'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function IssueBookPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    bookId: '',
    issueDate: new Date().toISOString().split('T')[0],
    returnDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
    remarks: '',
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchAvailableBooks();
  }, []);

  const fetchAvailableBooks = async () => {
    try {
      const response = await api.get('/books/available');
      setBooks(response.data);
    } catch (err) {
      setError('Failed to fetch available books');
    }
  };

  const handleSelectBook = (book: any) => {
    setSelectedBook(book);
    setFormData({
      bookId: book.id.toString(),
      issueDate: new Date().toISOString().split('T')[0],
      returnDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
      remarks: '',
    });
    setError('');
    setSuccess('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const today = new Date().toISOString().split('T')[0];
    if (formData.issueDate < today) {
      setError('Issue date cannot be before today');
      return;
    }

    const issueDateObj = new Date(formData.issueDate);
    const returnDateObj = new Date(formData.returnDate);
    const maxReturnDate = new Date(issueDateObj);
    maxReturnDate.setDate(maxReturnDate.getDate() + 15);

    if (returnDateObj > maxReturnDate) {
      setError('Return date cannot be more than 15 days from issue date');
      return;
    }

    if (returnDateObj < issueDateObj) {
      setError('Return date must be after or on issue date');
      return;
    }

    try {
      await api.post('/issues/issue', {
        bookId: parseInt(formData.bookId),
        userId: user?.id,
        issueDate: formData.issueDate,
        returnDate: formData.returnDate,
        remarks: formData.remarks,
      });
      setSuccess('Book issued successfully!');
      setSelectedBook(null);
      fetchAvailableBooks();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to issue book');
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
      <div className="navbar">
        <h1>LMS - Issue Book</h1>
        <nav>
          <Link href="/transactions" style={{ color: 'white', textDecoration: 'none' }}>Transactions</Link>
        </nav>
      </div>

      <div className="container">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="card" style={{ marginBottom: '30px' }}>
          <h2>Available Books</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Type</th>
                <th>Available Copies</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.type}</td>
                  <td>{book.availableCopies}</td>
                  <td>
                    <label>
                      <input
                        type="radio"
                        name="bookSelection"
                        onChange={() => handleSelectBook(book)}
                        checked={selectedBook?.id === book.id}
                      />
                      Select
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedBook && (
          <div className="card" style={{ maxWidth: '500px' }}>
            <h2>Issue Book</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Book Title</label>
                <input type="text" value={selectedBook.title} readOnly />
              </div>

              <div className="form-group">
                <label>Author</label>
                <input type="text" value={selectedBook.author} readOnly />
              </div>

              <div className="form-group">
                <label>Issue Date *</label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Return Date *</label>
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  required
                />
                <small>Must be within 15 days from issue date</small>
              </div>

              <div className="form-group">
                <label>Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <button type="submit">Issue Book</button>
              <button type="button" onClick={() => setSelectedBook(null)}>Cancel</button>
            </form>
          </div>
        )}

        <Link href="/transactions">
          <button style={{ marginTop: '20px' }}>Back to Transactions</button>
        </Link>
      </div>
    </>
  );
}
