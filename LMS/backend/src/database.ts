import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname,'database.sqlite'),
  logging: false
});

let db: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (db) {
    return db;
  }

  db = await open({
    filename: path.join(__dirname,'data','library.db'),
    driver: sqlite3.Database,
  });

  await db.exec('PRAGMA foreign_keys = ON');
  return db;
}

export async function initializeDatabase(): Promise<void> {
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
