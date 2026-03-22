import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, phone, role } = await req.json()

    // Validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        role: role as 'PREACHER' | 'CHURCH' | 'ADMIN',
      },
    })

    // Create profile based on role
    if (role === 'PREACHER') {
      await prisma.preacherProfile.create({
        data: {
          userId: user.id,
        },
      })
    } else if (role === 'CHURCH') {
      await prisma.churchProfile.create({
        data: {
          userId: user.id,
        },
      })
    }

    return NextResponse.json(
      {
        message: 'User created successfully',
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
