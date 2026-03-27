# Essential Commands Reference

## Starting Development

### Start Dev Server
```bash
npm run dev
```
**Result:** Server runs on `http://localhost:3001`  
**Stop:** Press `Ctrl + C` in terminal

### Check Node is Running
```bash
npm run dev &
```
Runs in background. Check with:
```bash
netstat -ano | findstr :3001
```

---

## Test Data Management

### Create Basic Test Accounts
```bash
node scripts/create-test-users.js
```
Creates:
- test.preacher@example.com / password123
- test.church@example.com / password123

### Create Full Preacher Profile
```bash
node scripts/create-full-preacher.js
```
Creates: full.preacher@example.com / preacher123  
*(With 100% complete profile, 15 years experience, verified status)*

---

## Database Management

### Open Prisma Studio (Visual DB Editor)
```bash
npx prisma studio
```
**Browser opens:** `http://localhost:5555`  
Lets you:
- View all database records
- Add/edit/delete test data
- Check account details

### Apply Schema Changes
```bash
npx prisma db push
```
Updates database with schema.prisma changes

### View Database Logs
Add `DEBUG=prisma:*` to see SQL queries:
```bash
DEBUG=prisma:* npm run dev
```

---

## Git Commands

### Commit Changes (with message)
```bash
git add .
git commit -m "Your message here"
```

### Push to GitHub
```bash
git push origin main
```

### Check Git Status
```bash
git status
```

### View Recent Commits
```bash
git log --oneline -10
```

---

## Testing

### Run Integration Tests
```bash
npm run test:integration -- --testNamePattern="Authentication"
```

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

---

## Linting & Formatting

### Check for Lint Errors
```bash
npm run lint
```

### Fix Lint Errors Automatically
```bash
npm run lint -- --fix
```

---

## Build & Deployment

### Production Build
```bash
npm run build
```
**Result:** Creates optimized build in `.next` folder

### Check Build Size
```bash
npm run build
```
Look for bundle size in console output

---

## Environment Setup

### View Environment Variables
```bash
cat .env.local
```

### Edit Environment Variables
Open `.env.local` file in VS Code and edit directly

### Reload Environment Variables
Restart dev server:
```bash
# Kill current server (Ctrl+C)
npm run dev
```

---

## Quick Debugging

### Clear Next.js Cache
```bash
rm -r .next
npm run dev
```

### Check Server Logs
Look in terminal where `npm run dev` is running

### View Browser Console
Open browser → F12 → Console tab

### Test Database Connection
```bash
npx prisma db execute --stdin < /dev/null
```

---

## File Locations

| What | Path |
|------|------|
| Package scripts | package.json |
| Database schema | prisma/schema.prisma |
| Environment vars | .env.local |
| Test scripts | scripts/ |
| API routes | app/api/ |
| Pages | app/ |

---

## Copy-Paste Ready Commands

```bash
# Start everything
npm run dev

# Create test users
node scripts/create-test-users.js

# Create full preacher
node scripts/create-full-preacher.js

# Open database UI
npx prisma studio

# Push changes to GitHub
git add . && git commit -m "update" && git push origin main

# Clear cache and restart
rm -r .next && npm run dev
```

---

**Keep this file open while developing!**
