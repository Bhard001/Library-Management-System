"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.getDatabase = getDatabase;
exports.initializeDatabase = initializeDatabase;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const __dirname = path_1.default.resolve();
exports.sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: path_1.default.join(__dirname, 'database.sqlite'),
    logging: false
});
let db = null;
async function getDatabase() {
    if (db) {
        return db;
    }
    db = await (0, sqlite_1.open)({
        filename: path_1.default.join(__dirname, '../data/library.db'),
        driver: sqlite3_1.default.Database,
    });
    await db.exec('PRAGMA foreign_keys = ON');
    return db;
}
async function initializeDatabase() {
    const database = await getDatabase();
    // Users table
    await database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    // Books table
    await database.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      isbn TEXT UNIQUE NOT NULL,
      serialNo TEXT UNIQUE NOT NULL,
      type TEXT DEFAULT 'book' CHECK(type IN ('book', 'music', 'video')),
      totalCopies INTEGER NOT NULL,
      availableCopies INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    // Memberships table
    await database.exec(`
    CREATE TABLE IF NOT EXISTS memberships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      membershipNo TEXT UNIQUE NOT NULL,
      userId INTEGER NOT NULL,
      startDate DATE NOT NULL,
      endDate DATE NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'cancelled')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
    // Book Issues table
    await database.exec(`
    CREATE TABLE IF NOT EXISTS bookIssues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bookId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      issueDate DATE NOT NULL,
      returnDate DATE NOT NULL,
      remarks TEXT,
      status TEXT DEFAULT 'issued' CHECK(status IN ('issued', 'returned')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bookId) REFERENCES books(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
    // Fines table
    await database.exec(`
    CREATE TABLE IF NOT EXISTS fines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      issueId INTEGER NOT NULL UNIQUE,
      actualReturnDate DATE,
      fineAmount DECIMAL(10, 2) DEFAULT 0,
      isPaid BOOLEAN DEFAULT 0,
      remarks TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (issueId) REFERENCES bookIssues(id)
    )
  `);
}
