# Proclaim Canada

A modern web platform connecting preachers with churches and synagogues across Canada. Churches and synagogues can post service openings with detailed descriptions, and preachers can search and apply for opportunities.

## Project Overview

Proclaim Canada is a full-stack application that helps:
- **Preachers** discover speaking opportunities, manage applications, and build their professional profile
- **Churches & Synagogues** post service openings with detailed information and review preacher applications
- **All denominations** connect and collaborate in reaching their communities

## Tech Stack

- **Frontend**: Next.js 15+, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Validation**: Zod

## Key Features

### ✅ Implemented (MVP)

**Authentication & Accounts**
- User registration with role selection (Preacher/Church)
- Secure login with NextAuth.js
- Session management with JWT
- Password hashing with bcryptjs

**For Churches/Synagogues**
- Create detailed service opportunity listings
- Post with: title, description, service type, date/time, location, denomination, compensation
- Manage multiple listings
- Review preacher applications
- Accept/reject applications
- Church profile with contact information

**For Preachers**
- Browse all available opportunities with search and filtering
- Search by: title, location, service type, date range
- View detailed opportunity information
- Apply to opportunities with optional cover letter
- Track application status (pending/accepted/rejected)
- Preacher profile setup

**Dashboards**
- Church dashboard: view listings and applications
- Preacher dashboard: track applications and opportunities
- Real-time stats and metrics

**API Endpoints**
- `POST /api/auth/register` - User registration
- `GET/POST /api/listings` - List and create opportunities
- `GET /api/listings/[id]` - View listing details
- `PATCH/DELETE /api/listings/[id]` - Edit/delete listings
- `GET /api/listings/search` - Search opportunities (filtering by location, type, date)
- `GET/POST /api/applications` - Apply to opportunities
- `GET/PATCH/DELETE /api/applications/[id]` - Manage applications

### 🚧 To Be Implemented

- Messaging system between preachers and churches
- Preacher availability calendar
- Rating and review system
- Admin dashboard
- Email notifications
- Advanced profile features (certifications, specializations)
- Real-time chat
- Payment/billing integration
- Mobile app

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ database
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cathamaoui/Proclaim-Canada.git
cd Proclaim-Canada
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/proclaim_canada"

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"
```

4. Initialize the database:
```bash
npm run db:push
npm run db:generate
```

5. Run the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
Proclaim-Canada/
├── app/
│   ├── api/                    # REST API routes
│   │   ├── auth/              # Authentication (register, NextAuth)
│   │   ├── listings/          # Opportunity CRUD and search
│   │   └── applications/      # Application management
│   ├── auth/                  # Auth pages (login, signup)
│   ├── browse/                # Browse opportunities page
│   ├── dashboard/             # User dashboards (preacher/church)
│   ├── listings/              # Listing pages (create, view, edit)
│   ├── page.tsx               # Homepage
│   ├── layout.tsx             # Root layout with SessionProvider
│   └── globals.css            # Global styles
├── components/                # Reusable React components
│   ├── Button.tsx
│   └── SessionProvider.tsx
├── lib/
│   ├── auth.ts               # NextAuth configuration
│   ├── db.ts                 # Prisma client singleton
│   └── utils.ts              # Helper functions
├── prisma/
│   └── schema.prisma         # Database schema
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Database Schema

### Core Models

- **User** - User account with email, password, role (PREACHER/CHURCH/ADMIN)
- **PreacherProfile** - Extended preacher info (denomination, experience, rating)
- **ChurchProfile** - Extended church info (denomination, address, contact)
- **ChurchListing** - Service opportunity posting with details
- **Application** - Preacher application to a listing
- **AvailabilitySlot** - Preacher availability calendar (future feature)
- **Message** - Direct messaging between users (future feature)

## User Flows

### Church Posts an Opportunity

1. Church signs in → Dashboard
2. Click "Post Opportunity" → Form with:
   - Service title
   - Detailed description
   - Service type (sermon, revival, workshop, etc.)
   - Date & time
   - Location
   - Denomination preference
   - Compensation details
3. Listing goes live → Preachers can apply

### Preacher Applies for Opportunity

1. Preacher signs in → Browse page
2. Search filters (location, type, date range)
3. Click on opportunity → View church details
4. Submit application (with optional cover letter)
5. Application appears in dashboard
6. Church reviews → Accepts/rejects
7. Preacher sees status in dashboard

## Development Workflow

### Commands

```bash
# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Database commands
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio (visual DB editor)
npm run db:generate  # Generate Prisma client
```

## API Documentation

### Authentication

**Register User**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe",
  "phone": "+1-555-1234",
  "role": "PREACHER"  # or CHURCH
}
```

### Listings API

**Get All Listings**
```bash
GET /api/listings?status=OPEN&skip=0&take=10
```

**Create Listing (Church only)**
```bash
POST /api/listings
Authorization: Bearer [jwt-token]
Content-Type: application/json

{
  "title": "Sunday Morning Service",
  "description": "We're looking for a gifted preacher...",
  "type": "SERMON",
  "date": "2024-04-15T10:30:00",
  "location": "Toronto, Ontario",
  "compensation": "$300 honorarium"
}
```

**Search Listings**
```bash
GET /api/listings/search?q=sermon&location=Toronto&type=SERMON&dateFrom=2024-04-01&dateTo=2024-04-30&skip=0&take=20
```

### Applications API

**Submit Application (Preacher)**
```bash
POST /api/applications
Authorization: Bearer [jwt-token]
Content-Type: application/json

{
  "listingId": "listing-id-here",
  "coverLetter": "I'm interested in this opportunity because..."
}
```

**Get My Applications**
```bash
GET /api/applications
Authorization: Bearer [jwt-token]
```

**Update Application Status (Church)**
```bash
PATCH /api/applications/[id]
Authorization: Bearer [jwt-token]
Content-Type: application/json

{
  "status": "ACCEPTED"  # PENDING, ACCEPTED, REJECTED, WITHDRAWN
}
```

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Push to GitHub
git add .
git commit -m "Initial implementation"
git push origin main

# Connect to Vercel
# 1. Go to vercel.com
# 2. Import GitHub repo
# 3. Add environment variables
# 4. Deploy
```

### Environment Variables for Production

```
DATABASE_URL=postgresql://...production-database...
NEXTAUTH_URL=https://proclaim-canada.com
NEXTAUTH_SECRET=...generate-new-secret...
NODE_ENV=production
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

**Phase 1 (Current)** - MVP with listing and applications
**Phase 2** - Messaging, ratings, availability calendar
**Phase 3** - Payment processing, advanced profiles
**Phase 4** - Mobile app, advanced analytics
**Phase 5** - AI matching, premium features

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- GitHub Issues: https://github.com/cathamaoui/Proclaim-Canada/issues
- Email: support@proclaimcanada.com

---

**Made with ❤️ for churches and preachers across Canada**
