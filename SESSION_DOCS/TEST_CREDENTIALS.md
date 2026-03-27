# Test Credentials & Accounts

## Quick Reference

### Preacher Account (Basic)
```
Email: test.preacher@example.com
Password: password123
Role: PREACHER
Status: 0% profile complete
```
**Use for:** Testing basic preacher features, dashboard, navigation

---

### Church Account (Basic)
```
Email: test.church@example.com
Password: password123
Role: CHURCH
Status: 0% profile complete
```
**Use for:** Testing church dashboard, listings, church features

---

### Complete Pastor Account ⭐ RECOMMENDED
```
Email: pastor.complete@example.com
Password: pastor2026
Name: Dr. Michael Richardson
Role: PREACHER
Status: ✅ FULLY VERIFIED & COMPLETE
```

**Profile Details:**
- **Experience:** 20+ years ordained
- **Denomination:** Evangelical Free Church
- **Rating:** 4.9/5 (28 verified ratings)
- **Speaking Events:** 156 completed engagements
- **Languages:** English, Spanish, Portuguese
- **Travel Range:** 1,000+ miles (1,600 km)
- **Fee Range:** $800-$2,000 per event
- **Verification Status:** ✅ Fully Verified & Ordained
- **Specialization:** Revival, Evangelism & Conference Ministry
- **Resume/CV:** Included (resumeUrl field)
- **Profile Photo:** Included (profilePhotoUrl field)
- **Education:** M.Div (Southern Baptist Seminary) + B.A (Boyce College)
- **Availability:** 5 calendar slots configured

**Use for:** Testing advanced features, complete profile viewing, applications, matching algorithms

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
