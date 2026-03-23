import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    
    const bio = formData.get('bio') as string
    const yearsOfExperience = formData.get('yearsOfExperience') as string
    const hourlyRate = formData.get('hourlyRate') as string
    const denomination = formData.get('denomination') as string
    const languagesJson = formData.get('languages') as string
    const certificates = formData.get('certificates') as string
    const serviceTypesJson = formData.get('serviceTypes') as string
    const customService = formData.get('customService') as string
    const elevatorPitchFile = formData.get('elevatorPitch') as File | null
    const resumeFile = formData.get('resume') as File | null
    const profilePhotoFile = formData.get('profilePhoto') as File | null
    const isDraft = formData.get('isDraft') === 'true'

    // Only validate required fields if not saving as draft
    if (!isDraft && (!bio || bio.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Bio is required' },
        { status: 400 }
      )
    }

    // Parse languages
    let languages: string[] = []
    try {
      languages = JSON.parse(languagesJson || '[]')
    } catch {
      languages = []
    }

    // Parse service types
    let serviceTypes: string[] = []
    try {
      serviceTypes = JSON.parse(serviceTypesJson || '[]')
    } catch {
      serviceTypes = []
    }

    // Handle file uploads
    let elevatorPitchUrl: string | undefined
    let resumeUrl: string | undefined
    let profilePhotoUrl: string | undefined

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', session.user.id)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Save profile photo
    if (profilePhotoFile && profilePhotoFile.size > 0) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(profilePhotoFile.type)) {
        return NextResponse.json(
          { error: 'Profile photo must be JPEG, PNG, or WebP' },
          { status: 400 }
        )
      }
      // Validate file size (5MB max)
      if (profilePhotoFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Profile photo must be under 5MB' },
          { status: 400 }
        )
      }

      const buffer = Buffer.from(await profilePhotoFile.arrayBuffer())
      const ext = profilePhotoFile.type.split('/')[1] === 'jpeg' ? 'jpg' : profilePhotoFile.type.split('/')[1]
      const fileName = `profile-photo-${Date.now()}.${ext}`
      const filePath = join(uploadsDir, fileName)
      
      await writeFile(filePath, buffer)
      profilePhotoUrl = `/uploads/${session.user.id}/${fileName}`
    }

    // Save elevator pitch audio
    if (elevatorPitchFile && elevatorPitchFile.size > 0) {
      const buffer = Buffer.from(await elevatorPitchFile.arrayBuffer())
      const fileName = `elevator-pitch-${Date.now()}.webm`
      const filePath = join(uploadsDir, fileName)
      
      await writeFile(filePath, buffer)
      elevatorPitchUrl = `/uploads/${session.user.id}/${fileName}`
    }

    // Save resume
    if (resumeFile && resumeFile.size > 0) {
      const buffer = Buffer.from(await resumeFile.arrayBuffer())
      const fileExtension = resumeFile.name.split('.').pop()
      const fileName = `resume-${Date.now()}.${fileExtension}`
      const filePath = join(uploadsDir, fileName)
      
      await writeFile(filePath, buffer)
      resumeUrl = `/uploads/${session.user.id}/${fileName}`
    }

    const updateData: Record<string, any> = {
      bio: bio ? bio.trim() : '',
      yearsOfExperience: parseInt(yearsOfExperience) || 0,
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
      denomination: denomination || null,
      languages: languages,
      certificates: Array.isArray(certificates)
        ? certificates
        : certificates
        ? [certificates]
        : [],
      serviceTypes: serviceTypes,
      customService: customService || null,
    }

    if (profilePhotoUrl) updateData.profilePhotoUrl = profilePhotoUrl
    if (elevatorPitchUrl) updateData.elevatorPitchUrl = elevatorPitchUrl
    if (resumeUrl) updateData.resumeUrl = resumeUrl

    // Find or create preacher profile
    const preacherProfile = await prisma.preacherProfile.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: {
        userId: session.user.id,
        ...updateData,
        serviceTypes: [],
      },
    })

    return NextResponse.json({
      success: true,
      draft: isDraft,
      profile: preacherProfile,
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.preacherProfile.findUnique({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
