# Resume Access Feature - Complete Implementation
**Date**: March 29, 2026  
**Status**: ✅ Complete - All pages created and committed

---

## Overview

The Resume Access Feature enables churches to browse, search, and view preacher resumes with a quota-based system. This includes:
- **Resume Browsing Page**: Search and filter available preacher resumes
- **Subscription Settings Page**: Manage plan, quota usage, and premium add-ons
- **Subscription Status Endpoint**: Fetch subscription and quota details
- **Integrated Quota System**: Enforces monthly view limits with paid unlimited option

---

## Architecture

### Data Model
- **Subscription Model** (expanded in Prisma schema):
  - `resumeViewsLimit`: Max views per month per plan tier (0-150)
  - `resumeViewsUsed`: Current month's view count
  - `resumeViewsResetDate`: DateTime for monthly boundary
  - `hasUnlimitedResumes`: Boolean flag for add-on status
  - `unlimitedResumesAddOnEnd`: DateTime for premium expiration

- **ResumeView Model** (tracking):
  - Captures individual resume view events
  - Includes subscriptionId, preacherId, viewedAt timestamp
  - Enables analytics on resume access patterns

### Plan Tier Quotas
```
Trial:              0 views/month
Immediate Call:    10 views/month
1-Month:           25 views/month
3-Month:           75 views/month
6-Month:          150 views/month
Unlimited Yearly: 100 views/month
Add-on:           Unlimited (overrides monthly limit, $99/month)
```

---

## Frontend Pages

### 1. Browse Resumes Page
**File**: `app/church-dashboard/browse-resumes/page.tsx`  
**Route**: `/church-dashboard/browse-resumes`

**Features:**
- Search and filter preachers by:
  - Denomination (dropdown with 16+ options)
  - Location (city/state text input)
  - Minimum experience (years)
- Pagination (12 preachers per page)
- Preacher cards showing:
  - Name, denomination, rating
  - Years of experience
  - Bio preview (3 lines max)
  - Verification badge
  - "View Resume" button
- Quota display at top:
  - Current user: X / Y views remaining
  - "Unlimited" badge if add-on active
  - "Upgrade" button if quota exhausted

**API Calls:**
```typescript
// Fetch paginated resumes with filters
GET /api/resumes?page=1&limit=12&denomination=Baptist&location=Toronto&experience=5

// View individual resume (enforces quota)
GET /api/resumes/{preacherId}
```

**Quota Enforcement:**
- Displays remaining views next to pagination
- Shows upgrade prompt if quota exceeded
- Prevents viewing if no views remaining (unless unlimited)

**Navigation:**
- Back to Dashboard link
- Links from church dashboard main page

---

### 2. Subscription Settings Page
**File**: `app/church-dashboard/settings/subscription/page.tsx`  
**Route**: `/church-dashboard/settings/subscription`

**Sections:**

#### Current Plan
- Plan type display
- Status (Active/Inactive)
- Renewal date
- "Change Plan" button → `/listings/select-plan`

#### Resume Access Quota
- Progress bar showing usage (visual feedback)
- View count: X / Y remaining
- Monthly reset information

#### Resume Unlimited Add-on
- Card layout with feature highlights:
  - ✓ Unlimited resume views
  - ✓ Auto-renews monthly ($99/month)
  - ✓ Cancel anytime
- Pricing: $99/month display
- Action buttons:
  - "Add Now" button if not active
  - "Cancel" button if currently active
- Expiration date shown when active

#### Recent Resume Views
- List of last 10 resumes viewed
- Shows: Preacher name, denomination, experience
- View date for each entry
- Useful for audit trail and engagement tracking

**API Calls:**
```typescript
// Get subscription and quota status
GET /api/subscription/resume-addons

// Get full subscription details
GET /api/subscription/status

// Add unlimited add-on ($99/month)
POST /api/subscription/resume-addons
body: { action: 'add' }

// Cancel unlimited add-on
POST /api/subscription/resume-addons
body: { action: 'cancel' }
```

**User Flows:**
1. **View Quota**: Lands on page → sees current usage in progress bar
2. **Add-on Purchase**: Clicks "Add Now" → Immediate status update in UI
3. **Cancel Add-on**: Clicks "Cancel" → Confirmation dialog → Cancellation (takes effect next period)
4. **Upgrade from Browse**: Browse page quota exhausted → Clicks prompt → Navigates to `/settings/subscription` (can add from there)

---

### 3. Dashboard Navigation Update
**File**: `app/church-dashboard/page.tsx`

**Changes:**
- Added quick navigation bar below main header:
  ```
  Dashboard | Browse Resumes | Subscription | Setup Profile
  ```
- Updated "Access to 1000+ Resumes" feature card:
  - Now links to `/church-dashboard/browse-resumes` (was placeholder button)
- Maintains existing functionality:
  - Stats display (active postings, applications, total postings)
  - Feature cards (Seminaries, Resume Access, Applicant Sorting)
  - Recent job postings list

---

## Backend API Endpoints

### 1. GET `/api/subscription/status`
**Purpose**: Fetch full subscription details for authenticated church user

**Authentication**: NextAuth session required (church role)

**Response**:
```json
{
  "success": true,
  "subscription": {
    "id": "sub_123",
    "planType": "1-month",
    "status": "active",
    "startDate": "2026-03-01T00:00:00Z",
    "renewalDate": "2026-04-01T00:00:00Z",
    "postingsRemaining": 5,
    "postingsLimit": 10,
    "resumeViewsLimit": 25,
    "resumeViewsUsed": 12,
    "hasUnlimitedResumes": false,
    "unlimitedResumesAddOnEnd": null
  }
}
```

**Error Cases:**
- 401: Unauthorized (no session)
- 404: No subscription found
- 500: Server error

---

### 2. GET `/api/resumes`
**Purpose**: Browse and search available preacher resumes with pagination

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)
- `denomination`: Filter by denomination (optional)
- `location`: Filter by location (optional, flexible matching)
- `experience`: Minimum years of experience (optional)

**Response**:
```json
{
  "preachers": [
    {
      "id": "preacher_123",
      "userId": "user_456",
      "denomination": "Baptist",
      "yearsOfExperience": 10,
      "bio": "Passionate about...",
      "specialization": "Youth Ministry",
      "rating": 4.8,
      "verified": true,
      "user": {
        "name": "John Smith",
        "email": "john@example.com"
      }
    }
    // ... more preachers
  ],
  "total": 247,
  "page": 1,
  "limit": 20
}
```

**Notes:**
- Only returns preachers with `resumeUrl` (uploaded resume confirmed)
- Returns enriched user data for display

---

### 3. GET `/api/resumes/[id]`
**Purpose**: View individual resume with quota enforcement and tracking

**Authentication**: NextAuth session (church role only)

**Parameters:**
- `id`: Preacher user ID

**Quota Logic**:
1. Check if unlimited add-on is active:
   - `hasUnlimitedResumes === true` AND
   - `unlimitedResumesAddOnEnd > now()` → Skip all limits
2. If not unlimited:
   - Check if month changed:
     - If `now.month !== resumeViewsResetDate.month`, reset counter to 0
   - Check quota:
     - If `resumeViewsUsed >= resumeViewsLimit` → Return 403 with upgrade CTA
3. Increment counter and create ResumeView record

**Success Response (200)**:
```json
{
  "success": true,
  "resume": {
    "id": "preacher_123",
    "userId": "user_456",
    "name": "John Smith",
    "denomination": "Baptist",
    "yearsOfExperience": 10,
    "bio": "..."
    // ... all preacher profile data
  },
  "quotaMetadata": {
    "remainingViews": 13,
    "totalLimit": 25,
    "unlimited": false,
    "monthlyResetDate": "2026-04-01T00:00:00Z"
  }
}
```

**Quota Exceeded Response (403)**:
```json
{
  "error": "Resume view quota exceeded",
  "upgrade": {
    "message": "You've used all your resume views this month. Upgrade to Resume Unlimited for $99/month for unlimited access.",
    "url": "/church-dashboard/settings/subscription"
  }
}
```

---

### 4. GET/POST `/api/subscription/resume-addons`
**Purpose**: Manage Resume Unlimited add-on (add/cancel) and get quota status

**Authentication**: NextAuth session (church role)

#### GET Request
**Response**:
```json
{
  "success": true,
  "subscription": {
    "resumeViewsLimit": 25,
    "resumeViewsUsed": 12,
    "resumeViewsRemaining": 13,
    "hasUnlimitedResumes": true,
    "unlimited": true,
    "unlimitedResumesAddOnEnd": "2026-04-29T00:00:00Z"
  },
  "recentViews": [
    {
      "id": "view_123",
      "preacher": {
        "user": { "name": "John Smith" },
        "denomination": "Baptist",
        "yearsOfExperience": 10
      },
      "viewedAt": "2026-03-29T14:32:00Z"
    }
    // ... last 10 views
  ]
}
```

#### POST Request - Add Unlimited
**Body**:
```json
{
  "action": "add"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Resume Unlimited add-on activated",
  "subscription": {
    "hasUnlimitedResumes": true,
    "unlimitedResumesAddOnEnd": "2026-04-29T00:00:00Z"
  }
}
```

**Logic**:
- Sets `hasUnlimitedResumes = true`
- Sets `unlimitedResumesAddOnEnd = now + 1 month`
- Charges $99/month (Stripe integration required)

#### POST Request - Cancel Unlimited
**Body**:
```json
{
  "action": "cancel"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Resume Unlimited has been cancelled",
  "subscription": {
    "hasUnlimitedResumes": false,
    "unlimitedResumesAddOnEnd": null
  }
}
```

**Logic**:
- Sets `hasUnlimitedResumes = false`
- Cancellation takes effect at end of current billing period
- ResumeView counting logic handles the transition

---

## Integration Points

### From Church Dashboard
1. "Access to 1000+ Resumes" card → `/church-dashboard/browse-resumes`
2. Quick nav "Browse Resumes" → `/church-dashboard/browse-resumes`
3. Quick nav "Subscription" → `/church-dashboard/settings/subscription`

### From Browse Resumes Page
1. Quota exhausted → Shows upgrade modal
   - User clicks "Upgrade" → `/church-dashboard/settings/subscription`
2. "View Resume" button → Calls `/api/resumes/[preacherId]`
   - If quota exceeded → Shows upgrade prompt with link
   - If successful → Displays resume data

### From Subscription Settings Page
1. "Change Plan" → `/listings/select-plan` (existing plan selection flow)
2. "Add Now" (add-on) → POST `/api/subscription/resume-addons`
3. "Cancel" (add-on) → POST `/api/subscription/resume-addons`
4. "Browse Resumes" link → `/church-dashboard/browse-resumes`

---

## Database Migrations

### Prisma Schema Changes (Already Applied)

#### Subscription Model Expansion
```prisma
model Subscription {
  // ... existing fields ...
  
  // Resume Access Fields
  resumeViewsLimit      Int       @default(0)
  resumeViewsUsed       Int       @default(0)
  resumeViewsResetDate  DateTime  @default(now())
  hasUnlimitedResumes   Boolean   @default(false)
  unlimitedResumesAddOnEnd DateTime?
  
  // Relationship
  resumeViews           ResumeView[]
  
  @@index([userId])
}
```

#### New ResumeView Model
```prisma
model ResumeView {
  id              String   @id @default(cuid())
  subscriptionId  String
  subscription    Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)
  preacherId      String
  preacher        PreacherProfile @relation(fields: [preacherId], references: [id], onDelete: Cascade)
  viewedAt        DateTime @default(now())
  
  @@index([subscriptionId])
  @@index([preacherId])
  @@index([viewedAt])
}
```

#### User Model Update
```prisma
model User {
  // ... existing fields ...
  resumeViews    ResumeView[]
}
```

---

## File Summary

### Created Files
| File | Lines | Purpose |
|------|-------|---------|
| `app/church-dashboard/browse-resumes/page.tsx` | 238 | Resume browsing and search UI |
| `app/church-dashboard/settings/subscription/page.tsx` | 290 | Subscription management and quota UI |
| `app/api/subscription/status/route.ts` | 50 | Fetch subscription details endpoint |

### Modified Files
| File | Changes | Purpose |
|------|---------|---------|
| `app/church-dashboard/page.tsx` | +15 lines | Added quick nav + updated resume card link |
| `prisma/schema.prisma` | (from Phase 2) | Complete schema with resume tracking |
| `app/api/subscription/activate/route.ts` | (from Phase 2) | Plan activation with quota assignment |
| `app/api/resumes/route.ts` | (from Phase 2) | Resume list/search endpoint |
| `app/api/resumes/[id]/route.ts` | (from Phase 2) | Resume view with quota enforcement |
| `app/api/subscription/resume-addons/route.ts` | (from Phase 2) | Add-on management endpoint |
| `app/listings/select-plan/page.tsx` | (from Phase 2) | Plan page with resume metrics |

---

## Testing Checklist

- [ ] Test browse resumes with filters
- [ ] Test pagination on resume browse
- [ ] Test quota display on browse and settings pages
- [ ] Test "View Resume" button with quota checks
- [ ] Test adding unlimited add-on
- [ ] Test canceling unlimited add-on
- [ ] Test monthly reset logic (change system date to verify)
- [ ] Test quota exceeded response and upgrade prompt
- [ ] Test recent views list on settings page
- [ ] Test navigation between all pages
- [ ] Test quota display in multiple states:
  - [ ] With quota remaining
  - [ ] With no quota remaining
  - [ ] With unlimited active
  - [ ] After unlimited expires (back to monthly limit)

---

## Next Steps

### Priority 1: Stripe Checkout Integration
- Create `/checkout` page to process plan purchases
- Integrate Stripe Elements for payment
- Implement webhook handlers for Stripe events
- Unblocks actual monetization

### Priority 2: Resume Detail View Enhancement
- Create modal or detail page to show full resume
- Add contact/invite button for preacher
- Integration with existing application system

### Priority 3: Admin Dashboard
- View subscription analytics
- Monitor revenue from Resume Unlimited add-ons
- See most-viewed preachers and engagement metrics
- Resume view trends over time

### Priority 4: Email Notifications
- Notify when churches view preacher resumes
- Notify about plan renewals
- Notify about add-on renewals

---

## Security & Authorization

All endpoints enforce:
1. **Session Validation**: `getServerSession()` required
2. **Role Check**: Church users only (`session.user.role === 'CHURCH'`)
3. **Subscription Validation**: Only church with active subscription can browse resumes
4. **Data Isolation**: Churches only see their own subscription and quota

---

## Performance Considerations

### Pagination
- Browse resumes: 12 per page (balances UX with performance)
- Recent views: Limited to 10 views for quick loading

### Database Indexes
- `Subscription.userId` - Fast user lookup
- `ResumeView.subscriptionId` - Fast quota queries
- `ResumeView.preacherId` - Analytics queries
- `ResumeView.viewedAt` - Time-based sorting

### Caching Opportunities (Future)
- Cache preacher list for 1 hour (resume data doesn't change frequently)
- Cache user subscription for 5 minutes
- Cache denomination list (static)

---

## Deployment Notes

1. **Database Migration Required**:
   ```bash
   npx prisma db push
   ```

2. **Environment Variables** (already configured):
   - DATABASE_URL should be set in `.env.local`
   - NEXTAUTH_SECRET should be set

3. **Stripe Integration** (pending):
   - Add `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` to `.env.local`
   - Implement webhook URL for payment events

---

## Related Documentation
- [Implementation Status](./IMPLEMENTATION_COMPLETE.md)
- [Service Type Selector](./SERVICE_TYPE_SELECTOR.md)
- [Testing Guide](../TESTING.md)

---

**Last Updated**: March 29, 2026  
**Status**: ✅ Complete - Ready for testing and Stripe integration
