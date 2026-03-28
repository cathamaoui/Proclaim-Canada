#!/usr/bin/env node

// Load environment variables from .env.local
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=')
      const key = trimmed.substring(0, idx).trim()
      let value = trimmed.substring(idx + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      process.env[key] = value
    }
  })
}

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const resumeUrls = {
  'pastor-john-smith': '/resumes/pastor-john-smith-resume.pdf',
  'rev.-sarah-johnson': '/resumes/rev.-sarah-johnson-resume.pdf',
  'pastor-michael-chen': '/resumes/pastor-michael-chen-resume.pdf',
  'rev.-patricia-williams': '/resumes/rev.-patricia-williams-resume.pdf',
  'pastor-david-rodriguez': '/resumes/pastor-david-rodriguez-resume.pdf',
  'rev.-emily-thompson': '/resumes/rev.-emily-thompson-resume.pdf',
  'pastor-james-wilson': '/resumes/pastor-james-wilson-resume.pdf',
  'rev.-maria-garcia': '/resumes/rev.-maria-garcia-resume.pdf',
  'pastor-daniel-lee': '/resumes/pastor-daniel-lee-resume.pdf',
  'rev.-jessica-anderson': '/resumes/rev.-jessica-anderson-resume.pdf',
}

async function main() {
  console.log('📄 Updating preachers with resume URLs...\n')

  try {
    let updated = 0
    for (const [emailPart, resumeUrl] of Object.entries(resumeUrls)) {
      const email = `preacher-${emailPart}@test.com`
      
      const user = await prisma.user.findUnique({
        where: { email },
        include: { preacherProfile: true }
      })

      if (user && user.preacherProfile) {
        await prisma.preacherProfile.update({
          where: { userId: user.id },
          data: { resumeUrl }
        })
        console.log(`✅ ${user.name}: ${resumeUrl}`)
        updated++
      } else {
        console.log(`⚠️  ${email}: User or profile not found`)
      }
    }

    console.log('\n' + '═'.repeat(60))
    console.log(`✨ UPDATED ${updated} PREACHERS WITH RESUME URLS!`)
    console.log('═'.repeat(60))
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
