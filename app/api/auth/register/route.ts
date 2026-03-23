import { prisma } from '@/lib/db'
import { sendEmail, emailTemplates } from '@/lib/email'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { 
      email, 
      password, 
      name, 
      phone, 
      role, 
      churchName, 
      organizationName, 
      denomination, 
      specifyAffiliation,
      street,
      city,
      province,
      postalCode,
      website,
      averageAttendance,
      serviceTypes,
      customService
    } = await req.json()

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
          serviceTypes: serviceTypes || [],
          customService: customService || null,
        },
      })
    } else if (role === 'CHURCH') {
      await prisma.churchProfile.create({
        data: {
          userId: user.id,
          churchName: churchName || null,
          organizationName: organizationName || null,
          denomination: denomination || null,
          specifyAffiliation: specifyAffiliation || null,
          street: street || null,
          city: city || null,
          province: province || null,
          postalCode: postalCode || null,
          website: website || null,
          averageAttendance: averageAttendance || null,
        },
      })
    }

    // Send welcome email (non-blocking)
    const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`
    const emailContent = emailTemplates.welcome(
      name,
      role as 'PREACHER' | 'CHURCH',
      dashboardUrl
    )

    // Fire and forget - don't await
    sendEmail({
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
    }).catch((err) => console.error('Email send failed:', err))

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
