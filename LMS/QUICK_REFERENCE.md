# LMS - Quick Reference Card

## Startup Commands

\`\`\`bash
# First time setup
npm install
cd backend && npm run build && npx ts-node src/seed.ts && cd ..

# Terminal 1: Start Backend
npm run backend:dev

# Terminal 2: Start Frontend
npm run frontend:dev
\`\`\`

## Access Application
http://localhost:3000

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@library.com | admin123 |
| User | rajesh@library.com | user123 |

## Admin Features
- Add/Update Books (Maintenance > Add/Update Book)
- Add/Manage Memberships (Maintenance > Add/Update Membership)
- Manage Users (Maintenance > User Management)
- View All Reports (Reports > All tabs)

## User Features
- Issue Books (Transactions > Issue Book)
- Return Books (Transactions > Return Book)
- View My Books (Transactions > My Books)
- View Personal Reports (Reports > Issued Books, Fines)

## Sample Data Loaded
- 6 Books/Movies (mixed types)
- 1 Admin User
- 1 Regular User with active membership
- Ready for immediate testing

## Currency & Fines
- All prices in Indian Rupees (₹)
- Late fine: ₹10 per day
- Default issue duration: 15 days

## Key Validations
- ✓ Issue date ≥ Today
- ✓ Return date ≤ Issue date + 15 days
- ✓ Book must have available copies
- ✓ Fine payment mandatory for late returns
- ✓ All required fields must be filled

## Important Endpoints
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- API Base: http://localhost:5000/api

## Database File
\`backend/data/library.db\`

## Troubleshooting
1. Port in use? Change PORT in backend/.env
2. Database error? Delete library.db and re-seed
3. API error? Check backend is running on port 5000
4. Auth error? Clear cookies and login again

---
**Ready to test!** Follow the startup commands above.
