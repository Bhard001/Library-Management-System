"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_js_1 = require("../database.js");
const auth_js_1 = require("../middleware/auth.js");
const router = express_1.default.Router();
// Get all books
router.get('/', auth_js_1.authenticateToken, async (req, res) => {
    try {
        const db = await (0, database_js_1.getDatabase)();
        const books = await db.all('SELECT * FROM books');
        res.json(books);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});
// Get available books
router.get('/available', auth_js_1.authenticateToken, async (req, res) => {
    try {
        const db = await (0, database_js_1.getDatabase)();
        const books = await db.all('SELECT * FROM books WHERE availableCopies > 0');
        res.json(books);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch available books' });
    }
});
// Add book (admin only)
router.post('/', auth_js_1.authenticateToken, auth_js_1.requireAdmin, async (req, res) => {
    try {
        const { title, author, isbn, serialNo, type, totalCopies } = req.body;
        if (!title || !author || !isbn || !serialNo || !type || !totalCopies) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const db = await (0, database_js_1.getDatabase)();
        const result = await db.run('INSERT INTO books (title, author, isbn, serialNo, type, totalCopies, availableCopies) VALUES (?, ?, ?, ?, ?, ?, ?)', [title, author, isbn, serialNo, type, totalCopies, totalCopies]);
        res.json({ id: result.lastID, message: 'Book added successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Update book (admin only)
router.put('/:id', auth_js_1.authenticateToken, auth_js_1.requireAdmin, async (req, res) => {
    try {
        const { title, author, isbn, serialNo, type, totalCopies } = req.body;
        const bookId = req.params.id;
        if (!title || !author || !isbn || !serialNo || !type || !totalCopies) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const db = await (0, database_js_1.getDatabase)();
        const book = await db.get('SELECT * FROM books WHERE id = ?', [bookId]);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        const availableCopies = book.availableCopies + (totalCopies - book.totalCopies);
        await db.run('UPDATE books SET title = ?, author = ?, isbn = ?, serialNo = ?, type = ?, totalCopies = ?, availableCopies = ? WHERE id = ?', [title, author, isbn, serialNo, type, totalCopies, Math.max(0, availableCopies), bookId]);
        res.json({ message: 'Book updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Delete book (admin only)
router.delete('/:id', auth_js_1.authenticateToken, auth_js_1.requireAdmin, async (req, res) => {
    try {
        const db = await (0, database_js_1.getDatabase)();
        await db.run('DELETE FROM books WHERE id = ?', [req.params.id]);
        res.json({ message: 'Book deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
});
exports.default = router;
