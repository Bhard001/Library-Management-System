import express, { Response } from 'express';
import { getDatabase } from '../database.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';
import bcryptjs from 'bcryptjs';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDatabase();
    const users = await db.all('SELECT id, name, email, role FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Add user (admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const db = await getDatabase();

    const result = await db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    );

    res.json({ id: result.lastID, message: 'User added successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
