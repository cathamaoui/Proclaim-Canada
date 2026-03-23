import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const preachers = [
  {
    name: 'Rev. Marcus Thompson',
    email: 'marcus.thompson@example.com',
    bio: 'Passionate evangelist with 20+ years leading revivals across Canada. My calling is to ignite faith in communities through powerful, Spirit-led preaching. I specialize in multi-day revival meetings and evangelistic crusades.',
    denomination: 'Pentecostal',
    yearsOfExperience: 22,
    hourlyRate: 150,
    languages: ['English', 'French'],
    serviceTypes: ['Revival Meetings (Multi-day)', 'Evangelistic Crusade / Rally', 'Sunday Morning Service'],
    certificates: ['Master of Divinity - Tyndale Seminary', 'Ordained Minister - PAOC'],
    specializations: ['evangelism', 'youth', 'worship'],
  },
  {
    name: 'Pastor Sarah Chen',
    email: 'sarah.chen@example.com',
    bio: 'Bilingual pastor focused on bridging cultures through the Gospel. I have a heart for reaching immigrant communities and second-generation believers. My sermons blend deep theology with practical life application.',
    denomination: 'Baptist',
    yearsOfExperience: 12,
    hourlyRate: 120,
    languages: ['English', 'Mandarin', 'Cantonese'],
    serviceTypes: ['Sunday Morning Service', 'Young Adults Gathering', 'Evangelism Workshop / Seminar'],
    certificates: ['M.Div - Regent College', 'Licensed Baptist Minister'],
    specializations: ['teaching', 'children', 'discipleship'],
  },
  {
    name: 'Evangelist David Okafor',
    email: 'david.okafor@example.com',
    bio: 'On fire for the Lord and called to bring the message of salvation to every corner of this nation. My ministry focuses on street evangelism, crusades, and equipping believers to share their faith boldly.',
    denomination: 'Assemblies of God',
    yearsOfExperience: 15,
    hourlyRate: 100,
    languages: ['English'],
    serviceTypes: ['Evangelistic Crusade / Rally', 'Revival Meetings (Multi-day)', 'Community Event / Festival', 'Campus / University Outreach'],
    certificates: ['B.Th - Master\'s College & Seminary', 'Ordained - Assemblies of God'],
    specializations: ['evangelism', 'youth'],
  },
  {
    name: 'Dr. Rebecca Williams',
    email: 'rebecca.williams@example.com',
    bio: 'Seminary professor turned itinerant preacher. I combine academic rigor with heartfelt passion for the Word. Specializing in leadership development and equipping the next generation of ministry leaders.',
    denomination: 'Evangelical Free Church',
    yearsOfExperience: 18,
    hourlyRate: 200,
    languages: ['English', 'Spanish'],
    serviceTypes: ['Leadership Development', 'Evangelism Workshop / Seminar', 'Sunday Morning Service', "Men's / Women's Conference"],
    certificates: ['D.Min - Gordon-Conwell', 'M.Div - Trinity Western', 'Certified Christian Leadership Coach'],
    specializations: ['teaching', 'worship'],
  },
  {
    name: 'Pastor Jean-Pierre Beaumont',
    email: 'jp.beaumont@example.com',
    bio: 'Francophone evangelist ministering primarily in Quebec and the Maritimes. Passionate about revival in French-speaking Canada. My preaching style is energetic, biblical, and deeply rooted in prayer.',
    denomination: 'Christian and Missionary Alliance',
    yearsOfExperience: 10,
    hourlyRate: 90,
    languages: ['French', 'English'],
    serviceTypes: ['Revival Meetings (Multi-day)', 'Sunday Morning Service', 'Sunday Evening Service', 'Midweek Service / Bible Study'],
    certificates: ['B.Th - Séminaire Évangélique de Québec'],
    specializations: ['evangelism', 'discipleship'],
  },
  {
    name: 'Minister Angela Rodriguez',
    email: 'angela.rodriguez@example.com',
    bio: 'Called to serve the growing Hispanic community in Canada. I preach with passion and authenticity, bringing messages of hope and transformation. Available for bilingual services and conferences.',
    denomination: 'Foursquare',
    yearsOfExperience: 8,
    hourlyRate: 85,
    languages: ['English', 'Spanish', 'Portuguese'],
    serviceTypes: ['Sunday Morning Service', "Men's / Women's Conference", 'Youth Rally / Youth Retreat', 'Holiday Special Service'],
    certificates: ['M.A. Biblical Studies - ACTS Seminaries', 'Licensed Foursquare Minister'],
    specializations: ['youth', 'worship', 'children'],
  },
  {
    name: 'Rev. James Whitehawk',
    email: 'james.whitehawk@example.com',
    bio: 'Indigenous evangelist bringing the Good News with a heart for reconciliation and healing. I travel across Canada sharing testimony of God\'s transforming power in First Nations communities and beyond.',
    denomination: 'Interdenominational',
    yearsOfExperience: 25,
    hourlyRate: 0,
    languages: ['English'],
    serviceTypes: ['Community Event / Festival', 'Revival Meetings (Multi-day)', 'Evangelistic Crusade / Rally', 'Seeker-Sensitive / Guest Sunday'],
    certificates: ['Ordained Minister - Indigenous Ministries Canada', 'Certificate in Pastoral Care'],
    specializations: ['evangelism', 'discipleship'],
  },
  {
    name: 'Pastor Priya Sharma',
    email: 'priya.sharma@example.com',
    bio: 'First-generation Canadian with a passion for reaching South Asian communities. I preach the uncompromising Word of God with cultural sensitivity and deep love. Available for conferences, revivals, and special services.',
    denomination: 'Pentecostal',
    yearsOfExperience: 6,
    hourlyRate: 75,
    languages: ['English', 'Other'],
    serviceTypes: ['Sunday Morning Service', 'Young Adults Gathering', 'Seeker-Sensitive / Guest Sunday', 'VBS / Family Night Keynote'],
    certificates: ['B.Th - South Asian Bible College', 'Credentialed Minister - PAOC'],
    specializations: ['children', 'youth', 'teaching'],
  },
  {
    name: 'Evangelist Michael Brooks',
    email: 'michael.brooks@example.com',
    bio: 'Dynamic speaker and worship leader with a gift for connecting with young adults. Former musician turned evangelist — I use creative arts and compelling storytelling to communicate the Gospel to the next generation.',
    denomination: 'Wesleyan',
    yearsOfExperience: 9,
    hourlyRate: 110,
    languages: ['English', 'Korean'],
    serviceTypes: ['Youth Rally / Youth Retreat', 'Campus / University Outreach', 'Young Adults Gathering', 'Community Event / Festival'],
    certificates: ['B.A. Worship Arts - Kingswood University', 'Ordained Wesleyan Minister'],
    specializations: ['youth', 'worship', 'evangelism'],
  },
  {
    name: 'Dr. Florence Adeyemi',
    email: 'florence.adeyemi@example.com',
    bio: 'Nigerian-Canadian pastor and theologian with a prophetic ministry. I bring a global perspective to the Canadian church, preaching with authority and deep biblical insight. Experienced in conferences, retreats, and Sunday pulpit ministry.',
    denomination: 'Church of God in Christ',
    yearsOfExperience: 16,
    hourlyRate: 175,
    languages: ['English', 'French'],
    serviceTypes: ['Sunday Morning Service', "Men's / Women's Conference", 'Leadership Development', 'Revival Meetings (Multi-day)', 'Holiday Special Service'],
    certificates: ['Ph.D. Theology - University of Toronto', 'M.Div - Wycliffe College', 'Ordained Elder - COGIC'],
    specializations: ['teaching', 'evangelism', 'discipleship'],
  },
]

async function main() {
  console.log('🌱 Seeding 10 preacher profiles...\n')

  const password = await bcrypt.hash('Password123!', 10)

  for (const preacher of preachers) {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: preacher.email } })
    if (existing) {
      console.log(`⏭️  Skipping ${preacher.name} (already exists)`)
      continue
    }

    const user = await prisma.user.create({
      data: {
        name: preacher.name,
        email: preacher.email,
        password,
        role: 'PREACHER',
        preacherProfile: {
          create: {
            bio: preacher.bio,
            denomination: preacher.denomination,
            yearsOfExperience: preacher.yearsOfExperience,
            hourlyRate: preacher.hourlyRate || null,
            languages: preacher.languages,
            serviceTypes: preacher.serviceTypes,
            certificates: preacher.certificates,
            specializations: preacher.specializations,
            verified: true,
          },
        },
      },
    })

    console.log(`✅ Created: ${preacher.name} (${user.id})`)
  }

  console.log('\n🎉 Done! All preacher profiles created.')
  console.log('📧 Login with any email above + password: Password123!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
