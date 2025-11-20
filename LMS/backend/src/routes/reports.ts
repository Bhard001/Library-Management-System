import express, { Response } from 'express';
import { getDatabase } from '../database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get issued books report
router.get('/issued-books', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const report = await db.all(
      `SELECT bi.id, b.title, b.author, u.name as userName, bi.issueDate, bi.returnDate, bi.status
       FROM bookIssues bi
       JOIN books b ON bi.bookId = b.id
       JOIN users u ON bi.userId = u.id
       ORDER BY bi.issueDate DESC`
    );
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Get fines report
router.get('/fines', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const report = await db.all(
      `SELECT f.id, b.title, u.name as userName, f.fineAmount, f.isPaid, f.actualReturnDate
       FROM fines f
       JOIN bookIssues bi ON f.issueId = bi.id
       JOIN books b ON bi.bookId = b.id
       JOIN users u ON bi.userId = u.id
       ORDER BY f.createdAt DESC`
    );
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fines report' });
  }
});

// Get memberships report
router.get('/memberships', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const report = await db.all(
      `SELECT m.id, m.membershipNo, u.name, u.email, m.startDate, m.endDate, m.status
       FROM memberships m
       JOIN users u ON m.userId = u.id
       ORDER BY m.endDate DESC`
    );
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memberships report' });
  }
});

export default router;
