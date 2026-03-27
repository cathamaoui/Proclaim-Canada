// tests/setup.ts
import dotenv from 'dotenv'
import path from 'path'
import { db } from '@/lib/db'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

// Global test configuration
beforeAll(async () => {
  // Database is already initialized via lib/db.ts
  console.log('Test suite starting...')
})

afterAll(async () => {
  // Clean up database connections
  await db.$disconnect()
  console.log('Test suite completed')
})

// Suppress console logs during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// }
