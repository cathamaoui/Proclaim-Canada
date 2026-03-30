# Proclaim Canada - Pastor Profile Enhancement Plan (Plan B)
## Phase 2: Preacher Dashboard & Advanced Profile System

**Status:** Planning Phase
**Target Start:** After PLAN_March_30_2026.md completion
**Scope:** Large Feature Addition
**Estimated Duration:** 2-3 weeks

---

## 🎯 Vision
Transform the preacher profile into a **comprehensive ministry resume & feedback platform** that:
- Showcases preachers' unique "DNA" through data visualization
- Enables churches to provide detailed, actionable feedback
- Creates a complete professional ministry portfolio
- Builds trust through transparent, data-driven matching

---

## 📋 Core Components Overview

### A. Preacher Dashboard (Free, No Registration Fee)
### B. Enhanced Pastor Profile Pages
### C. Grading & Feedback System
### D. Radar Chart Visualization ("Preacher DNA")
### E. Homepage Enhancements (Trending Voices, Live Feedback)

---

## 🔧 PHASE 1: Preacher Dashboard System

### 1.1 Dashboard Layout & Navigation
```
Pages to Create:
- /dashboard/preacher (Home/Overview)
- /dashboard/profile-builder (Multi-step form)
- /dashboard/resume (Resume management)
- /dashboard/inbox (Messages from churches)
- /dashboard/my-applications (Jobs applied for)
- /dashboard/available-jobs (Browse opportunities)
- /dashboard/feedback (Testimonials & ratings)
- /dashboard/settings (Preferences)
```

**Components Needed:**
- [ ] Preacher sidebar navigation
- [ ] Profile completion progress indicator (%)
- [ ] Quick stats cards (Applications, Messages, Feedback Score)
- [ ] Activity timeline

### 1.2 Dashboard Home Page
**Layout:**
- Welcome banner with name & photo
- Profile completion bar (motivate to 100%)
- Key metrics cards:
  - Total applications sent
  - Profile views this month
  - Feedback score (0-10)
  - Messages unread
  - Jobs in your area
- Recent activity feed
- Suggested jobs based on profile

### 1.3 Dashboard Features

#### Messages & Inbox
- [ ] Real-time messaging with churches
- [ ] Message counter badge
- [ ] Notification system
- [ ] Archive/unarchive messages
- [ ] Search & filter messages
- [ ] Message templates quick replies

#### Applications Tracker
- [ ] Jobs applied for (with status)
  - Pending
  - Under Review
  - Accepted (Interview Requested)
  - Rejected
  - Withdrawn
- [ ] Application date & church name
- [ ] Last update timestamp
- [ ] Ability to withdraw application
- [ ] Follow-up request feature

#### Job Browsing
- [ ] Available jobs list
- [ ] Filter by:
  - Distance/Location
  - Service type (Sermon, Revival, etc.)
  - Denomination match
  - Role type (Lead, Associate, Youth, etc.)
- [ ] Save/bookmark jobs
- [ ] Job details view
- [ ] Quick apply button

#### Online Status
- [ ] Toggle online/offline status
- [ ] Show "Available Now" badge on profile
- [ ] Last seen timestamp
- [ ] "Quick Response Time" metric

---

## 📄 PHASE 2: Enhanced Pastor Profile Fields

### 2.1 Professional & Personal Identity
**Section 1: Basic Information**
```
Fields:
- Full Name (required)
- Phone Number (required)
- Professional Email (required)
- Photo Upload (required - high quality headshot)
- Bio Photo Gallery
  - Family photos (3-5 images)
  - Ministry photos (3-5 images)
  - Action/preaching photos (2-3 images)
```

**Validation:**
- Phone must be valid format
- Email must be professional
- Photos must be min 800x600px
- Max file size 5MB per photo

### 2.2 Current Role & Location
**Section 2: Current Ministry Position**
```
Fields:
- Current Church/Organization Name
- Current Role (dropdown: Lead Pastor, Associate, Youth Pastor, etc.)
- Years in Current Role (number)
- City (text input)
- Country (dropdown: Canada, USA)
- Province/State (dropdown - populated)
```

### 2.3 Professional Summary
**Section 3: Ministry Pitch**
```
Fields:
- Professional Summary (textarea - 150-300 words, required)
  - 2-3 sentence core pitch
  - Years of experience
  - Unique ministry qualities
  - Short version: "What 3 words describe your preaching?"
```

### 2.4 Media & Digital Presence
**Section 4: Multimedia**
```
Fields:
- Short Video Intro (YouTube/Vimeo embed, 2-min max)
  - Self-recorded "greeting" or ministry pitch
  - Optional but highly recommended
  
- Sermon Links/Library (up to 5)
  - Sermon Title
  - Date Preached
  - Link (YouTube/Vimeo/Podcast)
  - Church/Event context
  - Time duration
  
- Social Media Links (optional)
  - LinkedIn URL
  - Facebook URL
  - Instagram URL
  - Twitter URL
  
- Personal Website/Blog (optional)
  - Blog/Website URL
  - Short description
```

### 2.5 Ministry Experience & Education
**Section 5: Work History**
```
Fields (Repeatable):
- Position Title
- Church/Organization Name
- Dates (From/To)
- Church Size (attendance avg)
- Key Accomplishments (textarea)
- City/State
- Add/Remove positions
- Ability to reorder chronologically
```

**Section 6: Education**
```
Fields (Repeatable):
- Degree/Diploma Name
- Institution Name
- Graduation Year
- Field of Study
- Honors/Distinction (optional)
- Add/Remove education
- Auto-sort by date (newest first)
```

### 2.6 Ordination & Licensing
**Section 7: Spiritual Credentials**
```
Fields:
- Ordination Status (dropdown)
  - Ordained
  - Licensed
  - In Progress
  - None
  
- Denomination/Network Affiliation
- Ordaining Body/Church
- License/Ordination Date
- License/Ordination Document Upload (PDF)
- Expiration Date (if applicable)
```

### 2.7 Resume Management
**Section 8: Resume Upload**
```
Fields:
- Resume PDF Upload (max 5MB)
- Version control (track multiple versions)
- Download link for churches
- Last updated date
- Option to use LinkedIn as resume source
```

### 2.8 Theology & Philosophy
**Section 9: Statement of Faith**
```
Fields:
- Statement of Faith (textarea - 200-500 words)
- Doctrinal Alignment (checkboxes)
  - Core beliefs checklist
  - Allows churches to filter by theology
```

**Section 10: Ministry Philosophy**
```
Fields (repeated):
- Preaching Style (textarea - How do you approach sermon preparation?)
- Leadership Approach (textarea - Elder-led? Congregational? Other?)
- Leadership Development (textarea - How do you develop other leaders?)
- Ministry Values (textarea - What matters most in your ministry?)
```

**Section 11: Theological Influences**
```
Fields:
- Favorite Authors/Theologians (text tags)
- Key Mentors (repeatable fields)
- Books that shaped your ministry (repeatable)
- Conference/Training influences
```

### 2.9 Spiritual Gifts & Passions
**Section 12: Self-Assessment**
```
Fields:
- Top 5 Spiritual Gifts (multi-select from list)
  - Teaching
  - Preaching
  - Pastoral Care
  - Administration
  - Evangelism
  - Leadership
  - Encouragement
  - etc.

- Areas of Passion (multi-select)
  - Discipleship
  - Youth Ministry
  - Community Outreach
  - Church Planting
  - Small Groups
  - etc.

- Areas for Growth (multi-select - shows humility)
```

### 2.10 Role Preferences & Details
**Section 13: Position Seeking**
```
Fields:
- Desired Role(s) (multi-select)
  - Lead Pastor
  - Preaching Pastor
  - Associate Pastor
  - Youth Pastor
  - Worship Leader
  - Children's Director
  - Other
  
- Employment Type Preference
  - Full-time
  - Part-time
  - Contract/Interim
  - Combination
  
- Compensation Expectations (optional)
  - Salary range
  - Benefits needed
  - Housing provided?
```

### 2.11 References
**Section 14: Professional References**
```
Fields (Repeatable - 3-5 references):
- Reference Name (required)
- Relationship (dropdown: Former Supervisor, Peer, Mentor, etc.)
- Phone Number (required)
- Email (required)
- Organization/Church Name
- Years Known
- Public/Private Toggle (can church see contact info?)
```

### 2.12 Relocation Status
**Section 15: Geographic Preferences**
```
Fields:
- Open to Relocation? (Yes/No/Maybe)
- Preferred Locations (multi-select by state/province)
- Distance willing to travel (miles/km)
- Time zone preferences
- Notes on flexibility
```

---

## ⭐ PHASE 3: Grading & Feedback System

### 3.1 Church Grading Rubric
**After a preacher serves at a church, the church can provide feedback:**

#### The 6-Point Evaluation Scale
Churches grade the pastor on these dimensions (1-10 point scale):

1. **Biblical Depth**
   - How well did they handle the original text and context?
   - Did they dig into Greek/Hebrew or theological depth?
   - Score: 1-10

2. **Gospel Centrality**
   - Was the message focused on the work of Jesus?
   - Or was it generic "good advice"?
   - Score: 1-10

3. **Cultural Relevance**
   - Did they bridge the gap to modern life effectively?
   - Were examples and illustrations current and relatable?
   - Score: 1-10

4. **Emotional Intelligence (EQ)**
   - How was their connection with the congregation?
   - How did they interact with staff?
   - Reading the room effectively?
   - Score: 1-10

5. **Delivery & Engagement**
   - Pacing, clarity, volume, and vocal variety
   - Ability to hold attention
   - Non-verbal communication effectiveness
   - Score: 1-10

6. **Professionalism**
   - Punctuality and preparation
   - Communication quality
   - Following service flow
   - Responsiveness
   - Score: 1-10

#### Additional Feedback Components
- [ ] Open-ended comment (textarea, 200 chars min)
- [ ] One-line "Legacy Quote" (what will we remember them by?)
- [ ] Recommend for similar churches? (Yes/No/Maybe)
- [ ] Would invite back? (Yes/No/Need Discussion)
- [ ] Badges assigned (see below)

### 3.2 Badge System
**Churches can assign earned badges (trophy-style icons):**

```
Preaching-Focused Badges:
- 📖 "Deep Teacher" - Consistent high Biblical Depth
- 🎯 "Gospel Centered" - Always returns to Jesus
- 💡 "Creative Mind" - Innovative illustrations & approach
- 🎤 "Engaging Speaker" - High delivery/engagement scores
- 🔥 "Revival Catalyst" - Inspires spiritual renewal

Leadership & Ministry:
- 👥 "Community Builder" - Strong EQ & relational skills
- 🎓 "Developer of Leaders" - Mentors & trains others
- 🚀 "Church Planter DNA" - Good fit for church planting
- 🤝 "Collaborative Leader" - Works well with teams
- 🌟 "All-Around Minister" - Versatile across many areas

Character & Professionalism:
- ✅ "Reliable Professional" - Always prepared & on-time
- 💪 "Servant Heart" - Demonstrates humility & service
- 🎯 "Aligned Values" - Shares church's vision & values
- 🌱 "Growing Leader" - Seeking feedback, developing
- 🏆 "Excellence Pursuer" - High standards in all things

Specializations:
- 👨‍👧‍👦 "Family Focused" - Strong family ministry
- ✨ "Youth Whisperer" - Exceptional with young people
- 🌍 "Cross-Cultural" - Ministers effectively cross-culture
- 🎵 "Worship Pastor" - Leads worship/music effectively
- 📱 "Digital Native" - Tech-savvy, online ministry
- 🤲 "Mercy Ministries" - Pastoral care focused
```

### 3.3 Feedback Display on Profile
**On the preacher's profile, display:**

- [ ] Overall Rating (avg of all 6 dimensions, 0-10)
- [ ] Total Feedback Count (X churches have reviewed)
- [ ] Radar Chart ("Preacher DNA" visualization)
- [ ] Earned Badges Display (grid of badges)
- [ ] Recent Church Shout-outs Feed (scrolling testimonials)
- [ ] "Would Recommend" percentage
- [ ] Feedback Credibility Score (how recent, how many reviews)

---

## 📊 PHASE 4: Radar Chart & Data Visualization

### 4.1 Preacher DNA Radar Chart
**Technology:**
- Library: Recharts or Chart.js
- Type: Radar/Spider Chart
- Update: Real-time as churches submit feedback

**Visual Design:**
- Blue shaded polygon (preacher's scores)
- Gray outer ring (maximum 10/10)
- 6 axes for each dimension
- Hover tooltips showing exact scores
- Color gradient based on overall rating

**Example Interpretation:**
- High "Biblical Depth" + Low "Humor" = Scholarly, academic preacher
- High "EQ" + High "Engagement" = Relational, dynamic preacher
- Balanced across all = "Well-rounded" minister

### 4.2 Data Storage Schema (Prisma)
```
Model Feedback {
  id                    String
  preacherId            String     (reference to User)
  churchId              String     (reference to User/Church)
  applicationId         String     (which job/service)
  
  // The 6 Scores (1-10)
  biblicalDepth         Int
  gospelCentrality      Int
  culturalRelevance     Int
  emotionalIntelligence Int
  deliveryEngagement    Int
  professionalism       Int
  
  // Average calculated field
  overallScore          Float      (computed: avg of 6)
  
  // Additional feedback
  openComment           String
  legacyQuote           String
  wouldRecommend        Boolean
  wouldInviteBack       Boolean
  
  // Badges (JSON or separate model)
  badgesAssigned        String[]   (array of badge IDs)
  
  createdAt             DateTime
  updatedAt             DateTime
}

Model Badge {
  id                    String
  badgeType             String     (enum: BADGE_TYPE)
  displayName           String
  icon                  String     (emoji or icon path)
  description           String
  category              String     (Preaching, Leadership, Character, etc.)
}

Model RadarScore {
  id                    String
  preacherId            String
  dimension             String     (enum: BIBLICAL_DEPTH, etc.)
  averageScore          Float      (1-10)
  feedbackCount         Int
  updatedAt             DateTime
}
```

---

## 🏠 PHASE 5: Homepage Enhancements

### 5.1 Trending Voices Section
**On Landing Page:**
```
Features:
- "Top Preachers This Month" carousel
- Filter by:
  - Highest rated cultural relevance
  - Highest rated engagement
  - Most applications received
  - Newest to platform
  
Card Display:
- Pastor photo
- Name & current church
- Top 2 strengths (from radar)
- Overall rating (5 stars)
- One-sentence legacy quote
- "View Profile" CTA
- Carousel pagination (5 pastors visible)
```

### 5.2 Live Feedback Ticker
**Subtle animated bar at top/bottom of landing page:**

```
Design:
- Dark gradient bar
- Scrolling text ticker
- Updates every 30 seconds (if new feedback available)

Format:
"🌟 Grace Community just gave Pastor John a 'Masterful' [badge] rating for Biblical Depth."
"✨ First Baptist assigned 'Revival Catalyst' badge to Pastor Sarah."
"🎯 New feedback: Pastor Mark - 'An incredible gift for connecting Scripture to real life.'"

Content Pool:
- Sample: Last 30 days of feedback
- Priority: High-rated, recent, badges assigned
- Rotation: Change every 5 seconds
- Fallback: Generic testimonials if no new feedback
```

---

## 🗂️ File Structure & Components

### New Pages to Create
```
/app/dashboard/preacher/
  ├── page.tsx                    (Home/Overview)
  ├── profile-builder/
  │   ├── page.tsx               (Multi-step form)
  │   ├── sections/
  │   │   ├── BasicInfo.tsx       (Sec 1-3)
  │   │   ├── Media.tsx           (Sec 4)
  │   │   ├── Experience.tsx      (Sec 5-7)
  │   │   ├── Theology.tsx        (Sec 9-12)
  │   │   ├── Preferences.tsx     (Sec 13-15)
  │   │   └── Review.tsx          (Final review)
  ├── resume/page.tsx
  ├── inbox/page.tsx
  ├── my-applications/page.tsx
  ├── available-jobs/page.tsx
  ├── feedback/page.tsx
  └── settings/page.tsx

/app/preachers/[id]/
  ├── page.tsx                    (ENHANCED profile with radar chart)
  └── new header with DNA chart

/components/
  ├── RadarChart.tsx              (Preacher DNA visualization)
  ├── FeedbackCard.tsx
  ├── BadgeDisplay.tsx
  ├── PreacherSidebar.tsx
  ├── ProfileProgressBar.tsx
  └── LiveFeedbackTicker.tsx

/app/api/preacher/
  ├── profile/route.ts            (GET/POST full profile)
  ├── feedback/route.ts           (GET feedback, POST new)
  ├── radar-data/route.ts         (GET computed scores)
  ├── applications/route.ts       (GET/POST applications)
  ├── messages/route.ts           (Message CRUD)
  ├── available-jobs/route.ts     (GET jobs for preacher)
  └── settings/route.ts
```

### New Database Models (Prisma)
```
- Feedback (6 scores, comments, badges)
- RadarScore (computed averages)
- Badge (definitions)
- PreacherProfile (all new fields)
- Message (church-preacher messaging)
- PreacherApplication (existing, enhance)
- Review/Testimonial (existing)
```

---

## 📈 Implementation Phases & Priorities

### Phase 1: Dashboard Infrastructure (Week 1)
- [ ] Create preacher dashboard layout
- [ ] Build sidebar navigation
- [ ] Create dashboard home page
- [ ] Profile completion progress bar
- [ ] Setup basic page structure

**Effort:** 16 hours

### Phase 2: Profile Builder System (Week 1-2)
- [ ] Multi-step form wizard
- [ ] Section 1-8: Basic info, Media, Experience
- [ ] Photo upload system
- [ ] Form validation
- [ ] Auto-save functionality
- [ ] Back/Next navigation

**Effort:** 24 hours

### Phase 3: Advanced Profile Fields (Week 2)
- [ ] Sections 9-15: Theology, Preferences, References
- [ ] Reference form with validation
- [ ] Tag/badge selection UI
- [ ] Progress indicator refinement
- [ ] Profile review/preview page

**Effort:** 16 hours

### Phase 4: Feedback & Grading System (Week 2-3)
- [ ] Church feedback form (6 scales)
- [ ] Badge assignment UI
- [ ] Store feedback in database
- [ ] Compute radar scores
- [ ] Credibility scoring algorithm

**Effort:** 20 hours

### Phase 5: Radar Chart & Visualization (Week 3)
- [ ] Implement radar chart component
- [ ] Real-time chart updates
- [ ] Responsive design
- [ ] Hover tooltips
- [ ] Share/export functionality

**Effort:** 12 hours

### Phase 6: Messaging & Applications (Week 3-4)
- [ ] Message inbox UI
- [ ] Thread conversation view
- [ ] Application tracker
- [ ] Status updates
- [ ] Notifications

**Effort:** 16 hours

### Phase 7: Homepage Enhancements (Week 4)
- [ ] Trending Voices carousel
- [ ] Live Feedback Ticker
- [ ] Data sampling logic
- [ ] Smooth animations
- [ ] A/B test performance

**Effort:** 12 hours

### Phase 8: Testing & Polish (Week 4)
- [ ] End-to-end testing
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] UI refinement
- [ ] Documentation

**Effort:** 12 hours

---

## 🎯 Success Metrics

### Launch Metrics
- [ ] 100% of profile fields editable for preachers
- [ ] Radar chart displays accurately
- [ ] Feedback form accessible to churches
- [ ] Dashboard loads in < 2 seconds
- [ ] Mobile responsiveness 100%

### Adoption Metrics
- [ ] 50%+ of preachers complete full profile
- [ ] 20%+ of churches provide feedback
- [ ] Trending Voices section 40%+ CTR
- [ ] Feedback submission 3+ per week

### Quality Metrics
- [ ] Zero critical bugs post-launch
- [ ] Radar chart accuracy: 100% (validated)
- [ ] Message delivery: 99%+
- [ ] Profile load time: <1.5s

---

## 🚀 Technical Considerations

### Frontend Stack
- React 19 hooks for complex form state
- Recharts for radar chart visualization
- React-hook-form for multi-step form
- Framer Motion for smooth animations
- Tailwind for responsive design

### Backend Enhancements
- Computed fields for radar averages (Prisma)
- Message queue for notifications
- Real-time updates via WebSockets (future)
- Caching for frequently viewed profiles

### Performance
- Lazy load images in photo galleries
- Paginate feedback/messages
- Debounce auto-save
- CDN for video embeds

### Security
- Role validation (preachers only)
- Private reference contacts (toggle)
- Message encryption (future)
- Rate limit feedback submissions
- Spam detection for comments

---

## 📱 Mobile Considerations

**Responsive Breakpoints:**
- Mobile (< 640px): Stack sections vertically
- Tablet (640px - 1024px): 2-column layouts
- Desktop (> 1024px): Full sidebar + content

**Mobile-First Features:**
- Swipeable photo gallery
- Bottom sheet for contact info
- Touch-optimized form inputs
- Simplified radar chart (show top 3 vs all 6)

---

## 🔄 Integration with Existing Systems

### Church Dashboard Updates
- [ ] Show preacher applications with feedback visible
- [ ] Quick-access to preacher profiles from inbox
- [ ] Feedback submission link after service date

### Existing Preacher Profile
- [ ] Enhance `/app/preachers/[id]` page
- [ ] Add radar chart section
- [ ] Add feedback ticker section
- [ ] Link to apply/message CTA

### Admin Dashboard
- [ ] Monitor feedback quality
- [ ] Track trending preachers
- [ ] Manage inappropriate badges/comments
- [ ] Analytics on feedback submission rates

---

## 📝 Notes & Constraints

### Content Strategy
- Profile completeness = profile visibility boost
- Encourage video intro (15% boost in applications)
- Recent feedback > old feedback (algorithms)
- Badges build trust (visual cues)

### Data Privacy
- References are optional public display
- Churches can see feedback summary only
- Comments are moderated before display
- Preachers can dispute feedback

### Timeline
- **Start:** After PLAN_March_30_2026 completion
- **Target:** 4 weeks for MVP
- **Phase 2 Features:** Messaging, advanced filtering (future)

---

## 📚 Dependencies & Tech Stack

**Required Packages:**
- recharts (radar chart visualization)
- react-hook-form (form management)
- zod (form validation)
- framer-motion (animations)
- react-hot-toast (notifications)

**Database Migrations:**
- Add 8+ new tables/models
- Add 15+ fields to PreacherProfile
- Add indexes for performance

**API Endpoints:**
- 15+ new preacher routes
- 8+ new feedback routes
- Message system (10+ routes)

---

## ✅ Definition of Done

A feature is complete when:
- [ ] All tests pass
- [ ] Mobile responsive
- [ ] Accessibility (WCAG AA)
- [ ] Performance < 2s load time
- [ ] Documentation complete
- [ ] User tested with 3+ people
- [ ] No console errors/warnings
- [ ] Deployed to staging

---

## 🗓️ Milestones

| Milestone | Target Date | Key Deliverables |
|-----------|------------|-----------------|
| Phase 1 Complete | +1 week | Dashboard, basic profile |
| Phase 2-3 Complete | +2 weeks | Full profile builder |
| Phase 4-5 Complete | +3 weeks | Feedback system + radar |
| Phase 6-7 Complete | +4 weeks | Messaging + homepage |
| Launch Ready | End Week 4 | QA, testing, docs |

---

## 💡 Future Enhancements (Phase 2+)

1. **Real-time Messaging** - WebSocket-based chat
2. **Video Interviews** - Built-in video call scheduling
3. **Sermon Library** - Upload/manage sermon recordings directly
4. **Portfolio Builder** - Photo/video timeline of ministry
5. **Endorsements** - Peer-to-peer credibility (LinkedIn-style)
6. **Certification Program** - "Proclaim Certified" badge path
7. **Mentorship Network** - Connect growing pastors with mentors
8. **Speaking Tour** - Book multi-church speaking engagements
9. **CPD Credits** - Track continuing education for licensing
10. **Integration with ChurchStaffing Sites** - Apple/Vanderbloemen sync

---

## 📞 Questions & Clarifications Needed

- [ ] Should feedback scores be public or private initially?
- [ ] Auto-publish feedback or review before display?
- [ ] Can preachers update profiles after feedback received?
- [ ] Minimum feedback (2? 3?) before radar chart displays?
- [ ] Price point for any premium preacher features (future)?
- [ ] Integration with payment for churches to access details?

---

**Created:** March 30, 2026
**Status:** Ready for Review
**Next Step:** Submit for approval before development begins

---

**Note:** This is a comprehensive 4-week project. All components are designed to be launched together for maximum impact and user engagement. The radar chart visualization is the "anchor" feature that differentiates Proclaim Canada from competitors.
