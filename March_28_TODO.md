# Proclaim Canada - Daily Plan
**Date**: March 28, 2026  
**Session Goal**: Test all created features and seed data

---

## Testing & QA Plan

### Phase 1: Database & Seed Data Verification

- [ ] **Verify Seed Data Created**
  - [ ] Run `npm run seed:all` command
  - [ ] Confirm 10 preachers created in database
  - [ ] Confirm 10 churches created in database
  - [ ] Check all preachers have rating data (4.4-4.9★/5)
  - [ ] Verify each preacher has 8-10 ratings
  - [ ] Confirm 150 availability slots created (15 per preacher)
  - [ ] Check 10 messages created between churches and preachers

- [ ] **Verify Resume Files**
  - [ ] Check `/public/resumes/` directory has 10 PDF files
  - [ ] Confirm all files are named correctly (e.g., `pastor-john-smith-resume.pdf`)
  - [ ] Verify each PDF is accessible via URL (`/resumes/[name]-resume.pdf`)
  - [ ] Test downloading a PDF to ensure it opens correctly
  - [ ] Verify resume is in database (check `resumeUrl` field in `preacherProfile`)

---

### Phase 2: API Endpoint Testing

- [ ] **Test GET /api/preachers**
  - [ ] Endpoint returns 10+ preachers
  - [ ] Each preacher has `id`, `name`, `image`, `preacherProfile`
  - [ ] PreacherProfile includes `rating`, `totalRatings`, `resumeUrl`
  - [ ] Response time is reasonable (<500ms)

- [ ] **Test GET /api/preachers/[id]**
  - [ ] Use valid preacher ID (e.g., `cmn9nrmpw0012bpeexdbjmc9m`)
  - [ ] Endpoint returns single preacher with full profile
  - [ ] Includes array of `receivedRatings` (not `ratingsReceived`)
  - [ ] Each rating has `id`, `rating`, `comment`, `ratedBy` (with church name)
  - [ ] Ratings ordered by `createdAt` descending (newest first)
  - [ ] Response includes all nested church profile data

---

### Phase 3: Preacher Profile Page Testing

**URL**: `http://localhost:3003/browse/preachers/[preacher-id]`

#### Test Preacher: Rev. Jessica Anderson
**ID**: `cmn9nrmpw0012bpeexdbjmc9m`

- [ ] **Page Loads Without Errors**
  - [ ] No console errors (F12 Developer Tools)
  - [ ] No runtime exceptions
  - [ ] Page fully renders in <3 seconds

- [ ] **Preacher Information Display**
  - [ ] Name displays correctly ("Rev. Jessica Anderson")
  - [ ] Photo/avatar displays (circular badge)
  - [ ] Denomination shows ("Baptist")
  - [ ] Experience displays ("24 years")
  - [ ] Verification badge shows (✓ Verified)
  - [ ] Bio text displays completely and readable

- [ ] **Rating Display**
  - [ ] Overall rating shows as decimal (e.g., "4.7★/5")
  - [ ] Star displays in yellow (★)
  - [ ] Total number of reviews shows (e.g., "9 reviews")
  - [ ] Rating calculation correct (average of all ratings)

- [ ] **Resume Button**
  - [ ] "📄 View Resume" button visible
  - [ ] Button is clickable and styled correctly (blue)
  - [ ] Clicking opens PDF in new tab
  - [ ] PDF file name matches preacher (e.g., `rev.-jessica-anderson-resume.pdf`)
  - [ ] PDF displays correctly in browser/downloads

- [ ] **Back Navigation**
  - [ ] "← Back to Preachers" link visible at top
  - [ ] Clicking navigates back to `/browse/preachers` page
  - [ ] No 404 errors on navigation

---

### Phase 4: Testimonials Testing

**Location**: "What Churches Are Saying" section on preacher profile

- [ ] **Testimonial Carousel Loads**
  - [ ] Carousel component renders without errors
  - [ ] At least 1 testimonial visible
  - [ ] Expected: 8-10 testimonials for Rev. Jessica Anderson

- [ ] **Testimonial Content Display**
  - [ ] Church name displays (e.g., "Grace Baptist Church")
  - [ ] Church denomination displays (e.g., "Baptist")
  - [ ] Rating shows as stars (★★★★★)
  - [ ] Testimonial quote/comment displays fully
  - [ ] Author name shows (church contact name)

- [ ] **Carousel Navigation**
  - [ ] Left arrow (←) button works
  - [ ] Right arrow (→) button works
  - [ ] Clicking arrows changes testimonial
  - [ ] Dot indicators show current position
  - [ ] Clicking dots navigates to specific testimonial

- [ ] **Auto-Rotation**
  - [ ] Carousel auto-rotates every 5 seconds
  - [ ] Testimonial changes automatically
  - [ ] Hovering on carousel pauses auto-rotation
  - [ ] Moving mouse away resumes auto-rotation

- [ ] **Empty State Handling**
  - [ ] If no testimonials: shows "No testimonials yet" message
  - [ ] Message is user-friendly and informative

---

### Phase 5: Browse Preachers Page Testing

**URL**: `http://localhost:3003/browse/preachers`

- [ ] **Page Loads**
  - [ ] Page renders without errors
  - [ ] Loading state appears briefly while fetching
  - [ ] Displays 10 preacher cards

- [ ] **Preacher Cards Display**
  - [ ] Each card shows avatar/emoji
  - [ ] Name displays and is clickable
  - [ ] Experience shows (e.g., "24 years experience")
  - [ ] Rating shows correctly (convert Decimal to float)
  - [ ] Total reviews count shows
  - [ ] Bio excerpt displays (truncated)
  - [ ] Resume link visible if available

- [ ] **Card Buttons**
  - [ ] "View Profile" button present and clickable
  - [ ] Clicking "View Profile" navigates to detail page
  - [ ] "Add to Cart" button present
  - [ ] Cart count updates when items added

- [ ] **Navigation**
  - [ ] clicking preacher name navigates to detail page
  - [ ] "← Back to Preachers" works from detail page
  - [ ] All links work without 404 errors

---

### Phase 6: Complete Feature Integration Testing

- [ ] **End-to-End Flow**
  - [ ] Browse preachers page → Click "View Profile"
  - [ ] Detail page loads → See resume link
  - [ ] Click resume → PDF opens/downloads
  - [ ] Scroll down → See testimonials carousel
  - [ ] Interact with carousel → Works as expected
  - [ ] Click back button → Returns to browse page

- [ ] **Database Consistency**
  - [ ] Ratings in database match displayed ratings
  - [ ] Preacher profiles complete with all fields
  - [ ] Resume URLs valid and accessible
  - [ ] Church profile data complete in ratings

---

### Phase 7: Error Handling & Edge Cases

- [ ] **Invalid ID Handling**
  - [ ] Navigate to `/browse/preachers/invalid-id`
  - [ ] Shows error message gracefully
  - [ ] "Back to Preachers" link still works

- [ ] **Network Error Handling**
  - [ ] Temporarily disconnect network
  - [ ] Page shows appropriate error message
  - [ ] Retry mechanism works

- [ ] **Empty Data Scenarios**
  - [ ] Preacher with no ratings shows appropriate message
  - [ ] Rating display handles null values
  - [ ] No testimonials shows "No testimonials yet"

---

### Phase 8: Performance Testing

- [ ] **Page Load Times**
  - [ ] Browse page: <2 seconds
  - [ ] Detail page: <1 second
  - [ ] Resume download: <1 second
  - [ ] Carousel rotation smooth at 5 second intervals

- [ ] **Network Requests**
  - [ ] Open DevTools Network tab
  - [ ] Check GET /api/preachers request
  - [ ] Check GET /api/preachers/[id] request
  - [ ] Verify response sizes reasonable
  - [ ] No unnecessary duplicate requests

- [ ] **Browser Compatibility**
  - [ ] Test in Chrome/Edge
  - [ ] Test in Firefox
  - [ ] Verify responsive design on mobile (375px width)
  - [ ] Tablet view (768px) works correctly

---

### Phase 9: Documentation & Fixes

- [ ] **Record Findings**
  - [ ] Document any bugs found
  - [ ] Note missing features
  - [ ] List performance issues
  - [ ] Screenshot errors if occurred

- [ ] **Quick Fixes**
  - [ ] Fix any layout issues
  - [ ] Correct typos
  - [ ] Improve error messages
  - [ ] Optimize slow queries if found

---

### Phase 10: Commit & Push Results

- [ ] **Git Operations**
  - [ ] Stage any test-related changes
  - [ ] Commit with message "test: complete testing of preacher profiles and testimonials"
  - [ ] Push to GitHub
  - [ ] Verify push successful

---

## Testing Checklist Summary

**Total Test Cases**: 50+

**Priority Tests** (Must Pass):
- [ ] Seed data creates 10 preachers + 10 churches
- [ ] Resume PDFs accessible and downloadable
- [ ] Preacher detail page loads without errors
- [ ] Testimonials display correctly
- [ ] Carousel navigation works
- [ ] Browse page shows all preachers

**Secondary Tests** (Should Pass):
- [ ] API endpoints return correct data
- [ ] Rating calculations accurate
- [ ] Church profile data nested correctly
- [ ] Error handling graceful
- [ ] Performance acceptable

**Polish Tests** (Nice to Have):
- [ ] Responsive design works
- [ ] Smooth animations
- [ ] Loading states visible
- [ ] Empty states handled

---

## Testing Notes

**Test Preachers Available**:
1. Rev. Jessica Anderson (ID: cmn9nrmpw0012bpeexdbjmc9m) - Baptist, 24 yrs
2. And 9 others in database

**Test Churches Available**:
- Grace Baptist Church (Toronto)
- First Methodist Church (Vancouver)
- And 8 others

**Expected Results**:
- All 10 preachers should have 4.4-4.9★/5 ratings
- Each should have 8-10 testimonials
- Each should have professional resume PDF

---

## If Issues Found

### Common Issues & Quick Fixes

**Issue**: "toFixed is not a function"
- **Fix**: Already applied - using `Number(rating).toFixed(1)`

**Issue**: Params not awaited in API
- **Fix**: Already applied - using `await params`

**Issue**: Wrong field name in Prisma
- **Fix**: Already applied - using `receivedRatings` not `ratingsReceived`

**Issue**: Resume not found (404)
- **Check**: /public/resumes/ directory exists with PDFs
- **Check**: resumeUrl in database matches actual file

**Issue**: Testimonials not showing
- **Check**: Preacher has ratings in database with comments
- **Check**: receivedRatings array populated in API response
- **Check**: TestimonialCarousel component imported correctly

---

## Next Steps After Testing

1. If all tests pass → Mark features complete ✅
2. If bugs found → Fix + retest
3. Document findings in daily summary
4. Plan improvements for browse page
5. Move to next MVP feature (messaging, booking, etc.)

---

## Time Estimate

- Seed data verification: 5 minutes
- API testing: 10 minutes
- Preacher profile page: 15 minutes
- Testimonials testing: 10 minutes
- Browse page testing: 10 minutes
- Error handling: 5 minutes
- Performance testing: 5 minutes
- Documentation/fixes: 15 minutes

**Total Estimated Time**: 60-90 minutes

---

**Created**: March 27, 2026 (Evening)  
**For**: March 28, 2026 (Next Session)  
**Project**: Proclaim Canada MVP  
**Focus**: Complete testing of all newly created features
