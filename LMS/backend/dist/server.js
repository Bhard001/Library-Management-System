"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_js_1 = require("./database.js");
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const books_js_1 = __importDefault(require("./routes/books.js"));
const membership_js_1 = __importDefault(require("./routes/membership.js"));
const issue_js_1 = __importDefault(require("./routes/issue.js"));
const user_js_1 = __importDefault(require("./routes/user.js"));
const reports_js_1 = __importDefault(require("./routes/reports.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes
app.use('/api/auth', auth_js_1.default);
app.use('/api/books', books_js_1.default);
app.use('/api/memberships', membership_js_1.default);
app.use('/api/issues', issue_js_1.default);
app.use('/api/users', user_js_1.default);
app.use('/api/reports', reports_js_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
async function start() {
    try {
        await (0, database_js_1.initializeDatabase)();
        console.log('Database initialized');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
start();
