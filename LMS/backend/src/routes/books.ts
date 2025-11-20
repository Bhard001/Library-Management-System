import express, { Response } from 'express';
import { getDatabase } from '../database.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all books
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const books = await db.all('SELECT * FROM books');
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get available books
router.get('/available', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const books = await db.all('SELECT * FROM books WHERE availableCopies > 0');
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available books' });
  }
});

// Add book (admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, author, isbn, serialNo, type, totalCopies } = req.body;

    if (!title || !author || !isbn || !serialNo || !type || !totalCopies) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = await getDatabase();
    const result = await db.run(
      'INSERT INTO books (title, author, isbn, serialNo, type, totalCopies, availableCopies) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, author, isbn, serialNo, type, totalCopies, totalCopies]
    );

    res.json({ id: result.lastID, message: 'Book added successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update book (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, author, isbn, serialNo, type, totalCopies } = req.body;
    const bookId = req.params.id;

    if (!title || !author || !isbn || !serialNo || !type || !totalCopies) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = await getDatabase();
    const book = await db.get('SELECT * FROM books WHERE id = ?', [bookId]);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const availableCopies = book.availableCopies + (totalCopies - book.totalCopies);

    await db.run(
      'UPDATE books SET title = ?, author = ?, isbn = ?, serialNo = ?, type = ?, totalCopies = ?, availableCopies = ? WHERE id = ?',
      [title, author, isbn, serialNo, type, totalCopies, Math.max(0, availableCopies), bookId]
    );

    res.json({ message: 'Book updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete book (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    await db.run('DELETE FROM books WHERE id = ?', [req.params.id]);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

export default router;
