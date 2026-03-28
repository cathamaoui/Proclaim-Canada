# Sunday March 29th To Do

## Priority Tasks

### 1. Fix Remaining Build Error
- [ ] Fix `app/api/admin/audit-logs/route.ts` - References `AuditLog` Prisma model that doesn't exist
- Options: Add AuditLog model to schema OR delete/stub the route

### 2. Test All Features End-to-End
- [ ] Test church homepage loads correctly at `/church-home`
- [ ] Test checkout flow with each payment method
- [ ] Test messaging system between church and preacher accounts
- [ ] Test all navigation links work
- [ ] Test search functionality on church homepage

### 3. Database Verification
- [ ] Verify all 10 churches seeded correctly
- [ ] Verify all 14 listings are visible in browse
- [ ] Test login with church accounts (`church2026` password)

### 4. Push to GitHub
- [ ] Run final `npm run build` to verify no errors
- [ ] Push all changes to remote repository
- [ ] Verify deployment (if using Vercel/Netlify)

---

## Enhancement Tasks (If Time Permits)

### Homepage Improvements
- [ ] Add real search functionality to church homepage hero
- [ ] Add animations/transitions for better UX
- [ ] Make testimonials carousel auto-rotate

### Payment Integration
- [ ] Set up actual Stripe integration (test mode)
- [ ] Configure PayPal sandbox for testing
- [ ] Test invoice email delivery

### Messaging System
- [ ] Add real-time updates with WebSockets or polling
- [ ] Add unread message indicators
- [ ] Add email notifications for new messages

### Admin Dashboard
- [ ] Fix audit logs route (add AuditLog model to Prisma)
- [ ] Add admin analytics dashboard
- [ ] Add user management functionality

---

## Testing Checklist

### Church Accounts to Test
| Church | Email | Password |
|--------|-------|----------|
| Grace Community Toronto | church-grace-community@test.com | church2026 |
| First Baptist Calgary | church-first-baptist@test.com | church2026 |
| Living Hope Vancouver | church-living-hope@test.com | church2026 |

### Pages to Verify
- [ ] `/` - Landing page
- [ ] `/church-home` - Church homepage
- [ ] `/browse` - Browse listings
- [ ] `/browse/preachers` - Browse preachers
- [ ] `/checkout` - Checkout page
- [ ] `/listings/[id]` - Individual listing pages
- [ ] `/dashboard` - Preacher dashboard
- [ ] `/church-dashboard` - Church dashboard
- [ ] `/auth/login` - Login page
- [ ] `/auth/signup` - Signup page

---

## Notes

- Dev server runs on port 3002
- Database is on Neon Cloud (PostgreSQL)
- All seeded churches use password: `church2026`

---

## Commands Reference

```bash
# Start dev server
npm run dev

# Run build check
npm run build

# Open Prisma Studio
npx prisma studio

# Reseed churches if needed
node scripts/seed-churches.js

# Push schema changes
npx prisma db push

# Commit changes
git add -A && git commit -m "message"

# Push to GitHub
git push origin main
```
