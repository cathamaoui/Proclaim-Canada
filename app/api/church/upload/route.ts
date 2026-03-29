import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import path from 'path'
import fs from 'fs/promises'
import { randomUUID } from 'crypto'

// Configure max file size (100MB)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}

// Ensure upload directory exists
const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads'

async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  } catch (error) {
    console.error('Failed to create upload directory:', error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'logo', 'photo', 'video', 'intro-video'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['logo', 'photo', 'video', 'intro-video']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Validate MIME types
    const mimeType = file.type
    const isVideo = mimeType.startsWith('video/')
    const isImage = mimeType.startsWith('image/')

    if ((type === 'video' || type === 'intro-video') && !isVideo) {
      return NextResponse.json({ error: 'File must be a video' }, { status: 400 })
    }

    if ((type === 'logo' || type === 'photo') && !isImage) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size
    const maxSize = isVideo ? 500 * 1024 * 1024 : 10 * 1024 * 1024 // 500MB for video, 10MB for images
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    await ensureUploadDir()

    // Generate unique filename
    const ext = path.extname(file.name)
    const filename = `${type}-${session.user.id}-${randomUUID()}${ext}`
    const filepath = path.join(UPLOAD_DIR, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await fs.writeFile(filepath, buffer)

    // Create URL path for accessing the file
    const fileUrl = `/uploads/${filename}`

    // Update church profile with file URL
    const churchProfile = await prisma.churchProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!churchProfile) {
      return NextResponse.json({ error: 'Church profile not found' }, { status: 404 })
    }

    let updateData: any = {}

    if (type === 'logo') {
      updateData.logoUrl = fileUrl
    } else if (type === 'intro-video') {
      updateData.introVideoUrl = fileUrl
    } else if (type === 'photo') {
      // Add to photos array
      const currentPhotos = churchProfile.photos || []
      updateData.photos = [...currentPhotos, fileUrl]
    }

    const updated = await prisma.churchProfile.update({
      where: { userId: session.user.id },
      data: updateData,
    })

    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        url: fileUrl,
        profile: updated,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('File upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
