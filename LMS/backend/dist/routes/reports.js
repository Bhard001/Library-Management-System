"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_js_1 = require("../database.js");
const auth_js_1 = require("../middleware/auth.js");
const router = express_1.default.Router();
// Get issued books report
router.get('/issued-books', auth_js_1.authenticateToken, async (req, res) => {
    try {
        const db = await (0, database_js_1.getDatabase)();
        const report = await db.all(`SELECT bi.id, b.title, b.author, u.name as userName, bi.issueDate, bi.returnDate, bi.status
       FROM bookIssues bi
       JOIN books b ON bi.bookId = b.id
       JOIN users u ON bi.userId = u.id
       ORDER BY bi.issueDate DESC`);
        res.json(report);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch report' });
    }
});
// Get fines report
router.get('/fines', auth_js_1.authenticateToken, async (req, res) => {
    try {
        const db = await (0, database_js_1.getDatabase)();
        const report = await db.all(`SELECT f.id, b.title, u.name as userName, f.fineAmount, f.isPaid, f.actualReturnDate
       FROM fines f
       JOIN bookIssues bi ON f.issueId = bi.id
       JOIN books b ON bi.bookId = b.id
       JOIN users u ON bi.userId = u.id
       ORDER BY f.createdAt DESC`);
        res.json(report);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch fines report' });
    }
});
// Get memberships report
router.get('/memberships', auth_js_1.authenticateToken, async (req, res) => {
    try {
        const db = await (0, database_js_1.getDatabase)();
        const report = await db.all(`SELECT m.id, m.membershipNo, u.name, u.email, m.startDate, m.endDate, m.status
       FROM memberships m
       JOIN users u ON m.userId = u.id
       ORDER BY m.endDate DESC`);
        res.json(report);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch memberships report' });
    }
});
exports.default = router;
