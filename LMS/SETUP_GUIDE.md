# Library Management System - Complete Setup Guide

## Quick Start

### Step 1: Install Dependencies
From the LMS root directory:
\`\`\`bash
npm install
\`\`\`

### Step 2: Initialize Database
\`\`\`bash
cd backend
npm run build
npx ts-node src/seed.ts
cd ..
\`\`\`

You should see: "Database seeded successfully!"

### Step 3: Start Backend Server
Open Terminal 1:
\`\`\`bash
npm run backend:dev
\`\`\`

You should see: "Server running on http://localhost:5000"

### Step 4: Start Frontend Server
Open Terminal 2:
\`\`\`bash
npm run frontend:dev
\`\`\`

You should see: "▲ Next.js ... ready - started server on ..."

### Step 5: Access the Application
Open your browser and go to: http://localhost:3000

## Login Credentials

### Admin Account
- Email: admin@library.com
- Password: admin123

### Regular User Account
- Email: rajesh@library.com
- Password: user123

## System Workflow

### For Admin Users:
1. Login with admin credentials
2. Go to Dashboard
3. Click "Maintenance" to manage:
   - Add/Update Books & Movies
   - Add/Manage Memberships
   - Manage Users
4. View "Reports" for system-wide statistics

### For Regular Users:
1. Login with user credentials
2. Go to Dashboard
3. In "Transactions" section:
   - **Issue Book**: Select book, set issue & return dates
   - **Return Book**: Select from issued books, enter return date
   - **My Books**: View all currently issued books
4. View "Reports" for personal transaction history

## Key Functionalities

### Book Management
- Add books with ISBN, Serial Number, and copy count
- Books can be of type: Book, Music, or Video
- Track available copies automatically
- Update book details (only title/author/copies)

### Membership Management
- Create memberships with 6 months, 1 year, or 2 year duration
- Extend membership (default +6 months)
- Cancel membership
- View membership status in reports

### Book Transactions
- **Issue**: Select book → Auto-populate author → Set dates (15-day max)
- **Return**: Select from issued books → Enter return date → Go to fine page
- **Fines**: Auto-calculated at ₹10/day for late returns → Must confirm payment

### Reports
- **Issued Books**: All book issue records with status
- **Fines**: Outstanding and paid fines
- **Memberships**: Active/cancelled memberships (Admin only)

## Validation Rules

### Book Issue
- Issue date must be today or later
- Return date must be within 15 days from issue date
- Book must have available copies
- Author auto-populates (read-only)

### Book Return
- Serial number is mandatory
- Issue & return dates auto-populate (read-only)
- Returns always go to fine page
- Fine payment required if applicable

### Membership
- All fields mandatory
- Default duration: 6 months
- Can only extend or cancel (not modify dates directly)

### User Management
- Name is mandatory
- Email must be unique
- Password required (minimum security)

## Database Schema

### Users Table
- id (Primary Key)
- name, email, password (bcrypt hashed)
- role ('admin' or 'user')
- createdAt

### Books Table
- id (Primary Key)
- title, author, isbn (unique), serialNo (unique)
- type ('book', 'music', 'video')
- totalCopies, availableCopies
- createdAt

### Memberships Table
- id (Primary Key)
- membershipNo (unique)
- userId (Foreign Key)
- startDate, endDate
- status ('active' or 'cancelled')
- createdAt

### BookIssues Table
- id (Primary Key)
- bookId, userId (Foreign Keys)
- issueDate, returnDate
- remarks (optional)
- status ('issued' or 'returned')
- createdAt

### Fines Table
- id (Primary Key)
- issueId (Foreign Key, unique)
- actualReturnDate, fineAmount
- isPaid (boolean)
- remarks (optional)
- createdAt

## Troubleshooting

### Database Error: "UNIQUE constraint failed"
- Database already exists with same data
- Delete \`backend/data/library.db\` and run seed again

### API Connection Error
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify API_URL in frontend .env.local

### Authentication Errors
- Clear browser cookies and localStorage
- Check JWT_SECRET in backend .env
- Verify token format in API requests

### Port Already in Use
- Change PORT in backend/.env (default: 5000)
- Change port in frontend package.json dev script

## Production Deployment

1. Build frontend: \`npm run frontend:build\`
2. Build backend: \`npm run backend:build\`
3. Set environment variables for production
4. Use process manager (PM2) for backend
5. Deploy frontend to Vercel, Netlify, or similar
6. Update API_URL in frontend for production domain

## Support

For issues or questions:
1. Check the README.md in the LMS directory
2. Review this setup guide
3. Check API response errors
4. Verify database is properly initialized
\`\`\`

Now create a sample .env.example files:
