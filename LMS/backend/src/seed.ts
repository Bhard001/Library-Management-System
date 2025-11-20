import { getDatabase, initializeDatabase } from './database';
import bcryptjs from 'bcryptjs';

async function seedData() {
  try {
    await initializeDatabase();
    const db = await getDatabase();

    // Clear existing data
    await db.exec('DELETE FROM fines');
    await db.exec('DELETE FROM bookIssues');
    await db.exec('DELETE FROM memberships');
    await db.exec('DELETE FROM books');
    await db.exec('DELETE FROM users');

    // Seed users
    const adminPassword = await bcryptjs.hash('admin123', 10);
    const userPassword = await bcryptjs.hash('user123', 10);

    await db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin User', 'admin@library.com', adminPassword, 'admin']
    );

    const userResult = await db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Harsh Bhardwaj', 'Harsh@library.com', userPassword, 'user']
    );

    // Seed books
    const books = [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: 'ISBN001', serialNo: 'BOOK001', type: 'book', copies: 5 },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: 'ISBN002', serialNo: 'BOOK002', type: 'book', copies: 3 },
      { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: 'ISBN003', serialNo: 'BOOK003', type: 'book', copies: 4 },
      { title: 'Mungerilal Ke Haseen Sapne', author: 'Various Artists', isbn: 'ISBN004', serialNo: 'MUSIC001', type: 'music', copies: 2 },
      { title: 'Sholay', author: 'Film', isbn: 'ISBN005', serialNo: 'VIDEO001', type: 'video', copies: 2 },
      { title: 'Clean Code', author: 'Robert C. Martin', isbn: 'ISBN006', serialNo: 'BOOK004', type: 'book', copies: 3 },
    ];

    for (const book of books) {
      await db.run(
        'INSERT INTO books (title, author, isbn, serialNo, type, totalCopies, availableCopies) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [book.title, book.author, book.isbn, book.serialNo, book.type, book.copies, book.copies]
      );
    }

    // Seed membership
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0];

    await db.run(
      'INSERT INTO memberships (membershipNo, userId, startDate, endDate, status) VALUES (?, ?, ?, ?, ?)',
      ['MEM20241119', userResult.lastID, startDate, endDate, 'active']
    );

    console.log('Database seeded successfully!');
    console.log('Admin: admin@library.com / admin123');
    console.log('User: Harsh@library.com / user123');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedData();
