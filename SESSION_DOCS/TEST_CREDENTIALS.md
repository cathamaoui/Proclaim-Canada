# Test Credentials & Accounts

## Current Test Accounts

### Preacher Account (Basic)
```
Email: test.preacher@example.com
Password: password123
Role: PREACHER
Status: Created - Profile 0% complete
```
**Use for:** Testing basic preacher dashboard, profile completion flow

---

### Church Account (Basic)
```
Email: test.church@example.com
Password: password123
Role: CHURCH
Status: Created - Profile 0% complete
```
**Use for:** Testing basic church dashboard, profile completion flow

---

### Full Preacher Account (Complete Profile)
```
Email: full.preacher@example.com
Password: preacher123
Role: PREACHER
Status: Ready (pending creation script fix)
```
**Details:**
- Name: Rev. John Smith
- Experience: 15 years
- Denomination: Evangelical Free Church
- Status: Ordained & Verified
- Rating: 4.8/5 (12 ratings)
- Profile Completion: 100%
- Languages: English, Spanish
- Travel Distance: 500 miles

**Use for:** Testing advanced features (messaging, applications, matching)

---

## Creating Test Users

### Quick Method (Already Created)
Preacher and Church accounts exist in database. Just sign in!

### Full Profile Method (For Tomorrow)
```bash
node scripts/create-full-preacher.js
```
This creates the "Full Preacher" account with complete profile data.

---

## How to Add More Test Accounts

If you need additional accounts, use:
```bash
node scripts/create-test-users.js
```

Or create manually via Prisma Studio:
```bash
npx prisma studio
```

---

## Password Hashing Note

⚠️ **Important**: All passwords are hashed with bcryptjs (10 rounds)
- Never store plaintext passwords
- Always use the scripts to create accounts
- If you manually add accounts in database, hash the password first
