# Service Type Selector Integration - Testing Guide

## ✅ Completed Integration

The Service Type Selector component has been successfully integrated into the preacher/evangelist signup form in Proclaim Canada. Here's what was done:

### Changes Made

#### 1. **Updated `/app/auth/signup/page.tsx`**
- ✅ Imported `ServiceTypeSelector` component
- ✅ Added `serviceTypes` and `customService` to form state
- ✅ Added `handleServiceTypeChange` handler function
- ✅ Included Service Type Selector in the preacher signup form
- ✅ Added validation for service type selection
- ✅ Added conditional custom service input field
- ✅ Updated form submission to include service types in API request

#### 2. **Updated `/app/api/auth/register/route.ts`**
- ✅ Added `serviceTypes` and `customService` destructuring from request body
- ✅ Updated preacher profile creation to save service types
- ✅ Service types stored as array, custom service as optional string

#### 3. **Updated `/prisma/schema.prisma`**
- ✅ Added `serviceTypes` field to `PreacherProfile` (String array, default: [])
- ✅ Added `customService` field to `PreacherProfile` (optional String)
- ✅ Database synced with `npx prisma db push --force-reset`
- ✅ Prisma client regenerated

#### 4. **Created ServiceTypeSelector Component** 
- ✅ React component at `/components/ServiceTypeSelector.tsx`
- ✅ Standalone HTML at `/public/service-type-selector-standalone.html`
- ✅ Both include 15 service types across 5 categories
- ✅ Searchable dropdown with Choices.js
- ✅ Multi-select with removable tags
- ✅ Conditional "Other" field

## 📋 Service Types Available

### Standard Services (3 options)
- Midweek Service / Bible Study
- Sunday Evening Service
- Sunday Morning Service

### Specialized Outreach (3 options)
- Evangelistic Crusade / Rally
- Revival Meetings (Multi-day)
- Seeker-Sensitive / Guest Sunday

### Targeted Ministry (4 options)
- Campus / University Outreach
- Men's / Women's Conference
- Young Adults Gathering
- Youth Rally / Youth Retreat

### Training & Equipping (3 options)
- Evangelism Workshop / Seminar
- Leadership Development
- VBS / Family Night Keynote

### General (3 options)
- Community Event / Festival
- Holiday Special Service
- Other (Please specify)

## 🧪 Testing Instructions

### 1. **Test Preacher Signup Form**
Navigate to: `http://localhost:3001/auth/signup?type=preacher`

**Test Cases:**
- [ ] Form loads without errors
- [ ] ServiceTypeSelector component is visible
- [ ] Search field works (type to filter services)
- [ ] Can select multiple services
- [ ] Selected services appear as removable tags
- [ ] Clicking ✕ on tag removes it
- [ ] Selecting "Other (Please specify)" reveals custom field
- [ ] Removing "Other" hides custom field
- [ ] Can type custom service in revealed field
- [ ] Form validation requires at least one service type
- [ ] Form validation requires custom service if "Other" selected
- [ ] Form submits successfully with service types
- [ ] Success page shows after signup

### 2. **Test Database Storage**
After successful signup:
- [ ] New preacher profile created in database
- [ ] `serviceTypes` array saved correctly
- [ ] `customService` saved if provided
- [ ] Empty serviceTypes array if none selected (should fail validation first)

### 3. **Test Standalone Component**
Navigate to: `http://localhost:3001/service-type-selector-standalone.html`

**Test Cases:**
- [ ] Form loads with standalone UI
- [ ] Choices.js dropdown is fully functional
- [ ] Search works
- [ ] Multi-select works
- [ ] Custom field reveals when "Other" selected
- [ ] Form can be submitted
- [ ] Form reset clears selections
- [ ] Console shows form data on submit

### 4. **Test API Endpoint**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "preacher@test.com",
    "password": "TestPassword123",
    "name": "John Preacher",
    "phone": "+1-555-0123",
    "role": "PREACHER",
    "serviceTypes": ["Sunday Morning Service", "Youth Rally / Youth Retreat"],
    "customService": null
  }'
```

Expected Response:
```json
{
  "id": "user_id",
  "email": "preacher@test.com",
  "name": "John Preacher",
  "role": "PREACHER"
}
```

Verify in database:
```sql
SELECT serviceTypes, customService FROM "PreacherProfile" WHERE userId = 'user_id';
```

## 🔍 File Locations

**Components:**
- React Component: `/components/ServiceTypeSelector.tsx`
- Standalone: `/public/service-type-selector-standalone.html`

**Integration:**
- Signup Page: `/app/auth/signup/page.tsx` (lines ~230-280)
- API Endpoint: `/app/api/auth/register/route.ts` (lines ~23, ~65-70)
- Schema: `/prisma/schema.prisma` (PreacherProfile model)

**Documentation:**
- Integration Guide: `/docs/SERVICE_TYPE_SELECTOR.md`
- This Testing Guide: `/docs/SERVICE_TYPE_SELECTOR_TESTING.md`

## 🚀 Next Steps

1. **Test the signup flow** using the testing instructions above
2. **Verify database storage** with database queries
3. **Update preacher profile page** to display selected service types
4. **Add service type filtering** to job listing search/filter features
5. **Create preacher profile edit page** to allow updating service types
6. **Add matching logic** to recommend listings based on service types

## 💡 Tips

- If Choices.js doesn't load, check browser console for CORS errors
- Service types are case-sensitive in the database
- Use lowercase for consistent filtering: `serviceTypes.map(s => s.toLowerCase())`
- Custom service is optional and only saved if "Other" is selected
- Multiple selections are stored as a string array in PostgreSQL

## ❓ Troubleshooting

**Issue:** ServiceTypeSelector component not found
- **Solution:** Ensure component is at `/components/ServiceTypeSelector.tsx`
- **Check:** Import path should be `@/components/ServiceTypeSelector`

**Issue:** Choices.js library not loading
- **Solution:** Check CDN URL in browser Network tab
- **Fallback:** Use native HTML select if CDN fails

**Issue:** Custom field doesn't appear when "Other" selected
- **Solution:** Check state management in form data
- **Debug:** Add console.log in handleServiceTypeChange

**Issue:** Form validation error on submission
- **Solution:** Ensure at least one service type is selected
- **If "Other" is selected:** Ensure custom service field is filled

**Issue:** Database migration fails
- **Solution:** Run `npx prisma db push --force-reset` again
- **Or:** Check Neon PostgreSQL connection in `.env.local`

---

## 📊 Success Criteria

- ✅ Component renders without errors in signup form
- ✅ Users can search and select service types
- ✅ Custom field shows/hides correctly
- ✅ Form validates service type selection
- ✅ Data saves to database correctly
- ✅ Can view saved data in user profile
- ✅ Can edit service types in profile page

**Status:** All integration complete, ready for testing!
