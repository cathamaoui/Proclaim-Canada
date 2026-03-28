#!/usr/bin/env node

// Load environment variables FIRST
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
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      process.env[key] = value
    }
  })
}

// Now require Prisma and do the push
const { PrismaClient } = require('@prisma/client')
const { execSync } = require('child_process')

try {
  console.log('📊 Pushing database schema changes...')
  execSync('npx prisma db push --skip-generate', { 
    stdio: 'inherit',
    env: process.env
  })
  console.log('✅ Schema pushed successfully!')
} catch (error) {
  console.error('❌ Error pushing schema:', error.message)
  process.exit(1)
}
