"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_js_1 = require("../database.js");
const auth_js_1 = require("../middleware/auth.js");
const router = express_1.default.Router();
const FINE_PER_DAY_INR = 10; // 10 INR per day
// Check book availability
router.get('/available/:bookId', auth_js_1.authenticateToken, async (req, res) => {
    try {
        const db = await (0, database_js_1.getDatabase)();
        const book = await db.get('SELECT * FROM books WHERE id = ?', [req.params.bookId]);
        res.json({ available: book?.availableCopies > 0 });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to check availability' });
    }
});
// Issue book
router.post('/issue', auth_js_1.authenticateToken, async (req, res) => {
    try {
        const { bookId, userId, issueDate, returnDate, remarks } = req.body;
        if (!bookId || !userId || !issueDate || !returnDate) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const today = new Date().toISOString().split('T')[0];
        if (issueDate < today) {
            return res.status(400).json({ error: 'Issue date cannot be before today' });
        }
        const issueDateObj = new Date(issueDate);
        const returnDateObj = new Date(returnDate);
        const maxReturnDate = new Date(issueDateObj);
        maxReturnDate.setDate(maxReturnDate.getDate() + 15);
        if (returnDateObj > maxReturnDate) {
            return res.status(400).json({ error: 'Return date cannot be more than 15 days from issue date' });
        }
        const db = await (0, database_js_1.getDatabase)();
        const book = await db.get('SELECT * FROM books WHERE id = ?', [bookId]);
        if (!book || book.availableCopies <= 0) {
            return res.status(400).json({ error: 'Book not available' });
        }
        const result = await db.run('INSERT INTO bookIssues (bookId, userId, issueDate, returnDate, remarks, status) VALUES (?, ?, ?, ?, ?, ?)', [bookId, userId, issueDate, returnDate, remarks || '', 'issued']);
        await db.run('UPDATE books SET availableCopies = availableCopies - 1 WHERE id = ?', [bookId]);
        res.json({ id: result.lastID, message: 'Book issued successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get issued books for user
router.get('/user/:userId', auth_js_1.authenticateToken, async (req, res) => {
    try {
        const db = await (0, database_js_1.getDatabase)();
        const issues = await db.all(`SELECT bi.*, b.title, b.author, b.serialNo 
       FROM bookIssues bi 
       JOIN books b ON bi.bookId = b.id 
       WHERE bi.userId = ? AND bi.status = 'issued'
       ORDER BY bi.issueDate DESC`, [req.params.userId]);
        res.json(issues);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch issued books' });
    }
});
// Return book
router.post('/return', auth_js_1.authenticateToken, async (req, res) => {
    try {
        const { issueId, actualReturnDate } = req.body;
        if (!issueId || !actualReturnDate) {
            return res.status(400).json({ error: 'Issue ID and return date are required' });
        }
        const db = await (0, database_js_1.getDatabase)();
        const issue = await db.get('SELECT * FROM bookIssues WHERE id = ?', [issueId]);
        if (!issue) {
            return res.status(404).json({ error: 'Issue record not found' });
        }
        const returnDateObj = new Date(issue.returnDate);
        const actualReturnDateObj = new Date(actualReturnDate);
        const daysLate = Math.max(0, Math.floor((actualReturnDateObj.getTime() - returnDateObj.getTime()) / (1000 * 60 * 60 * 24)));
        const fineAmount = daysLate * FINE_PER_DAY_INR;
        await db.run('UPDATE bookIssues SET status = ? WHERE id = ?', ['returned', issueId]);
        const fineResult = await db.run('INSERT INTO fines (issueId, actualReturnDate, fineAmount, isPaid) VALUES (?, ?, ?, ?)', [issueId, actualReturnDate, fineAmount, fineAmount === 0 ? 1 : 0]);
        await db.run('UPDATE books SET availableCopies = availableCopies + 1 WHERE id = ?', [issue.bookId]);
        res.json({ fineId: fineResult.lastID, fineAmount, message: 'Book return processed' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get fine details
router.get('/fine/:fineId', auth_js_1.authenticateToken, async (req, res) => {
    try {
        const db = await (0, database_js_1.getDatabase)();
        const fine = await db.get('SELECT * FROM fines WHERE id = ?', [req.params.fineId]);
        res.json(fine || null);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch fine details' });
    }
});
// Pay fine
router.put('/fine/:fineId', auth_js_1.authenticateToken, async (req, res) => {
    try {
        const { remarks } = req.body;
        const db = await (0, database_js_1.getDatabase)();
        await db.run('UPDATE fines SET isPaid = ?, remarks = ? WHERE id = ?', [1, remarks || '', req.params.fineId]);
        res.json({ message: 'Fine paid successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
