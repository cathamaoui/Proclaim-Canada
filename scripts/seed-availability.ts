import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Generate dates for the next 8 weeks from today
function getUpcomingDates(startOffset: number, count: number, daysOfWeek: number[]): Date[] {
  const dates: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = startOffset; i < startOffset + 60 && dates.length < count; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    if (daysOfWeek.includes(d.getDay())) {
      dates.push(d)
    }
  }
  return dates
}

const preacherAvailability: Record<string, {
  daysOfWeek: number[] // 0=Sun,1=Mon,...6=Sat
  startTime: string
  endTime: string
  willingToTravel: boolean
  travelDistance: number
  notes: string
  slotCount: number
}> = {
  'marcus.thompson@example.com': {
    daysOfWeek: [0, 5, 6], // Sun, Fri, Sat
    startTime: '09:00',
    endTime: '17:00',
    willingToTravel: true,
    travelDistance: 200,
    notes: 'Available for multi-day revivals. Prefer weekend bookings.',
    slotCount: 12,
  },
  'sarah.chen@example.com': {
    daysOfWeek: [0, 3, 6], // Sun, Wed, Sat
    startTime: '10:00',
    endTime: '15:00',
    willingToTravel: true,
    travelDistance: 100,
    notes: 'Available for bilingual (English/Mandarin) services.',
    slotCount: 10,
  },
  'david.okafor@example.com': {
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Every day
    startTime: '08:00',
    endTime: '20:00',
    willingToTravel: true,
    travelDistance: 500,
    notes: 'Full-time evangelist. Available any day for crusades and rallies.',
    slotCount: 15,
  },
  'rebecca.williams@example.com': {
    daysOfWeek: [5, 6], // Fri, Sat
    startTime: '09:00',
    endTime: '16:00',
    willingToTravel: true,
    travelDistance: 150,
    notes: 'Available weekends only. Weekdays committed to seminary teaching.',
    slotCount: 8,
  },
  'jp.beaumont@example.com': {
    daysOfWeek: [0, 4, 5, 6], // Sun, Thu, Fri, Sat
    startTime: '09:00',
    endTime: '18:00',
    willingToTravel: true,
    travelDistance: 300,
    notes: 'Serves primarily Quebec and Maritimes. French & English.',
    slotCount: 12,
  },
  'angela.rodriguez@example.com': {
    daysOfWeek: [0, 6], // Sun, Sat
    startTime: '10:00',
    endTime: '14:00',
    willingToTravel: false,
    travelDistance: 50,
    notes: 'GTA area only. Bilingual Spanish/English services.',
    slotCount: 8,
  },
  'james.whitehawk@example.com': {
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    startTime: '07:00',
    endTime: '21:00',
    willingToTravel: true,
    travelDistance: 1000,
    notes: 'Will travel anywhere across Canada. No fee required — love offerings accepted.',
    slotCount: 14,
  },
  'priya.sharma@example.com': {
    daysOfWeek: [0, 3, 6], // Sun, Wed, Sat
    startTime: '10:00',
    endTime: '16:00',
    willingToTravel: true,
    travelDistance: 75,
    notes: 'Available for South Asian community events and Sunday services.',
    slotCount: 10,
  },
  'michael.brooks@example.com': {
    daysOfWeek: [4, 5, 6], // Thu, Fri, Sat
    startTime: '18:00',
    endTime: '22:00',
    willingToTravel: true,
    travelDistance: 200,
    notes: 'Evening events preferred. Great for youth rallies and campus events.',
    slotCount: 10,
  },
  'florence.adeyemi@example.com': {
    daysOfWeek: [0, 5, 6], // Sun, Fri, Sat
    startTime: '09:00',
    endTime: '17:00',
    willingToTravel: true,
    travelDistance: 250,
    notes: 'Available for conferences, Sunday pulpit, and leadership seminars.',
    slotCount: 10,
  },
}

async function main() {
  console.log('📅 Seeding availability slots for all preachers...\n')

  for (const [email, config] of Object.entries(preacherAvailability)) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      console.log(`⏭️  Skipping ${email} (user not found — run seed-preachers.ts first)`)
      continue
    }

    // Check if they already have slots
    const existing = await prisma.availabilitySlot.count({ where: { userId: user.id } })
    if (existing > 0) {
      console.log(`⏭️  Skipping ${user.name} (already has ${existing} slots)`)
      continue
    }

    const dates = getUpcomingDates(1, config.slotCount, config.daysOfWeek)

    let created = 0
    for (const date of dates) {
      await prisma.availabilitySlot.create({
        data: {
          userId: user.id,
          date,
          startTime: config.startTime,
          endTime: config.endTime,
          available: true,
          willingToTravel: config.willingToTravel,
          travelDistance: config.travelDistance,
          notes: config.notes,
        },
      })
      created++
    }
    console.log(`✅ ${user.name}: ${created} availability slots (${config.startTime}–${config.endTime})`)
  }

  console.log('\n🎉 Done! All availability slots created.')
  console.log('📊 Check Neon SQL Editor: SELECT u.name, a.date, a."startTime", a."endTime" FROM "AvailabilitySlot" a JOIN "User" u ON u.id = a."userId" ORDER BY u.name, a.date;')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
