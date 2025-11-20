# Library Management System (LMS)

A full-stack Library Management System built with Next.js (Frontend), Node.js + TypeScript (Backend), and SQLite (Database).

## Project Structure

\`\`\`
LMS/
├── backend/              # Node.js + TypeScript Backend
│   ├── src/
│   │   ├── database.ts   # Database initialization
│   │   ├── server.ts     # Express server
│   │   ├── seed.ts       # Database seeding script
│   │   ├── middleware/   # Authentication middleware
│   │   └── routes/       # API routes
│   ├── data/             # SQLite database files
│   └── package.json
├── frontend/             # Next.js Frontend
│   ├── src/
│   │   ├── app/          # Next.js app directory
│   │   ├── context/      # React context for auth
│   │   └── lib/          # Utility functions
│   └── package.json
└── package.json          # Root workspace config
\`\`\`

## Features

### Admin Features
- **Maintenance Module**: Manage books, users, and memberships
- **Reports**: View issued books, fines, and membership reports
- **Transactions**: Handle book issues and returns

### User Features
- **Issue Books**: Request books from the library
- **Return Books**: Return issued books
- **View My Books**: See all currently issued books
- **Reports**: View transaction and fine reports

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the LMS folder:
   \`\`\`bash
   cd LMS
   \`\`\`

3. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

4. Seed the database with initial data:
   \`\`\`bash
   cd backend
   npm run build
   npx ts-node src/seed.ts
   cd ..
   \`\`\`

### Running the Application

#### Terminal 1 - Start Backend
\`\`\`bash
npm run backend:dev
\`\`\`
The backend will run on http://localhost:5000

#### Terminal 2 - Start Frontend
\`\`\`bash
npm run frontend:dev
\`\`\`
The frontend will run on http://localhost:3000

## Default Credentials

### Admin
- Email: admin@library.com
- Password: admin123

### User
- Email: rajesh@library.com
- Password: user123

## Sample Data

The system comes pre-seeded with:
- 6 books/movies (Books, Music, Videos)
- 1 admin user
- 1 regular user with active membership

## Fine System

- Fine is charged at ₹10 per day for late returns
- Users can return books up to 15 days from issue date
- Fine payment is mandatory to complete the return process

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login
- POST `/api/auth/register` - Register

### Books
- GET `/api/books` - Get all books
- GET `/api/books/available` - Get available books
- POST `/api/books` - Add book (Admin only)
- PUT `/api/books/:id` - Update book (Admin only)
- DELETE `/api/books/:id` - Delete book (Admin only)

### Issues
- POST `/api/issues/issue` - Issue a book
- POST `/api/issues/return` - Return a book
- GET `/api/issues/user/:userId` - Get user's issued books

### Memberships
- POST `/api/memberships` - Add membership (Admin only)
- PUT `/api/memberships/:membershipNo` - Update membership (Admin only)

### Reports
- GET `/api/reports/issued-books` - Issued books report
- GET `/api/reports/fines` - Fines report
- GET `/api/reports/memberships` - Memberships report (Admin only)

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Axios
- **Backend**: Express.js, TypeScript, SQLite3
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Minimal CSS with focus on functionality

## Notes

- All dates are in YYYY-MM-DD format
- Currency is in Indian Rupees (₹)
- Validation is enforced on both client and server sides
- JWT tokens expire in 24 hours
- Database file is stored in `backend/data/library.db`
