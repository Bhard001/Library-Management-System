"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_js_1 = require("../database.js");
const auth_js_1 = require("../middleware/auth.js");
const router = express_1.default.Router();
function generateMembershipNo() {
    return 'MEM' + Date.now().toString().slice(-8);
}
function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}
// Get user membership
router.get('/user/:userId', auth_js_1.authenticateToken, async (req, res) => {
    try {
        const db = await (0, database_js_1.getDatabase)();
        const membership = await db.get('SELECT * FROM memberships WHERE userId = ? AND status = "active" ORDER BY endDate DESC LIMIT 1', [req.params.userId]);
        res.json(membership || null);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch membership' });
    }
});
// Add membership (admin only)
router.post('/', auth_js_1.authenticateToken, auth_js_1.requireAdmin, async (req, res) => {
    try {
        const { userId, durationMonths = 6 } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const db = await (0, database_js_1.getDatabase)();
        const membershipNo = generateMembershipNo();
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = addMonths(new Date(), durationMonths).toISOString().split('T')[0];
        const result = await db.run('INSERT INTO memberships (membershipNo, userId, startDate, endDate, status) VALUES (?, ?, ?, ?, ?)', [membershipNo, userId, startDate, endDate, 'active']);
        res.json({ id: result.lastID, membershipNo, message: 'Membership added successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Update membership (admin only)
router.put('/:membershipNo', auth_js_1.authenticateToken, auth_js_1.requireAdmin, async (req, res) => {
    try {
        const { action, extensionMonths = 6 } = req.body;
        const membershipNo = req.params.membershipNo;
        const db = await (0, database_js_1.getDatabase)();
        const membership = await db.get('SELECT * FROM memberships WHERE membershipNo = ?', [membershipNo]);
        if (!membership) {
            return res.status(404).json({ error: 'Membership not found' });
        }
        if (action === 'extend') {
            const newEndDate = addMonths(new Date(membership.endDate), extensionMonths).toISOString().split('T')[0];
            await db.run('UPDATE memberships SET endDate = ? WHERE membershipNo = ?', [newEndDate, membershipNo]);
            res.json({ message: 'Membership extended successfully' });
        }
        else if (action === 'cancel') {
            await db.run('UPDATE memberships SET status = ? WHERE membershipNo = ?', ['cancelled', membershipNo]);
            res.json({ message: 'Membership cancelled successfully' });
        }
        else {
            return res.status(400).json({ error: 'Invalid action' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
