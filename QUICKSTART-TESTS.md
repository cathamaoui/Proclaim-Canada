# Quick Start: Running Integration Tests

## 🚀 Setup Neon Database (2 minutes)

### 1. Create Free Neon Account
- Go to https://neon.tech
- Click "Sign up" → Choose GitHub/Google (fastest)
- Create account

### 2. Create Test Project
- Click "Create a new project"
- Name: `proclaim-canada-test`
- Region: Choose closest to you
- Click "Create project"
- Wait ~10 seconds for database to initialize

### 3. Get Connection String
- In Neon dashboard, you'll see a "Connection string" button
- Copy the full connection string (looks like):
  ```
  postgresql://neon_user:password@host.neon.tech/dbname
  ```

### 4. Update .env.local
1. Open `.env.local` in your editor
2. Find this line:
   ```
   DATABASE_URL="postgresql://user:password@hostname/dbname"
   ```
3. Replace ENTIRE line with connection string from Neon
4. Save file

✅ **Example** (paste your actual string):
```
DATABASE_URL="postgresql://neon_user:abc123@us-east-1.neon.tech/neondb"
```

## ⚡ Run Tests

```bash
cd C:\Users\catha\Proclaim-Canada

# Generate Prisma client
npx prisma generate

# Create database schema
npx prisma db push

# Run all integration tests
npm run test:integration
```

## 📊 Expected Output
```
PASS proclaim-canada tests/integration/authentication.test.ts
  ✓ should create a preacher account
  ✓ should create a church account
  ...

Test Suites: 8 passed, 8 total
Tests:       70+ passed
```

## 🔧 Troubleshooting

### "cannot connect to database"
- Check PostgreSQL is running
- Verify connection string is correct
- Neon: Check in dashboard → Connection string page

### "prisma client error"
```bash
rm -r node_modules/.prisma
npm install --legacy-peer-deps
npx prisma generate
```

### "db.rating undefined"
- Run `npx prisma generate` again
- Clear cache: `rm -r node_modules/.prisma`

## 📝 Test Files Located At
```
tests/integration/
  ├─ authentication.test.ts    (8 tests)
  ├─ messaging.test.ts          (10 tests)
  ├─ availability.test.ts       (8 tests)
  ├─ ratings.test.ts            (10 tests)
  ├─ applications.test.ts       (12 tests)
  ├─ password-reset.test.ts     (8 tests)
  ├─ admin.test.ts              (10 tests)
  └─ email.test.ts              (10+ tests)
```

## ✨ What Gets Tested

✅ User authentication & roles
✅ Messaging system (send, retrieve, notify)
✅ Availability calendar (create, filter, delete)
✅ Ratings system (bidirectional, averages)
✅ Applications (apply, status changes, notifications)
✅ Password reset (tokens, expiration, hashing)
✅ Admin functions (ban, moderate, audit logs)
✅ Email notifications (templates, variables)

## 🎉 Next Steps After Tests Pass
1. Review test results
2. Fix any failing tests (if any)
3. Deploy to production (Vercel for frontend, Neon for DB)

---

**Time to run tests**: ~5-10 seconds per suite
**Total**: ~30-60 seconds for all 70+ tests

Good luck! 🚀
