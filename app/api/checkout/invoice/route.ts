import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PLAN_CONFIGS } from '@/lib/subscription'
import { PlanType } from '@prisma/client'

// Invoice Generation API Route for Bank Transfer / Interac payments
// In production, this would generate a real invoice and send it via email

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'CHURCH') {
      return NextResponse.json(
        { error: 'Not authenticated as church' },
        { status: 401 }
      )
    }

    const { planType, paymentMethod } = await req.json()

    if (!planType || !PLAN_CONFIGS[planType as PlanType]) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      )
    }

    // Get church profile
    const churchProfile = await db.churchProfile.findUnique({
      where: { userId: session.user.id },
      include: { user: true },
    })

    if (!churchProfile) {
      return NextResponse.json(
        { error: 'Church profile not found' },
        { status: 404 }
      )
    }

    const planConfig = PLAN_CONFIGS[planType as PlanType]
    
    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    
    // Calculate due date (7 days from now)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 7)

    // In production, this would:
    // 1. Create an invoice record in the database
    // 2. Send the invoice via email
    // 3. Set up a pending subscription that activates upon payment confirmation

    // For MVP, we simulate invoice creation
    const invoice = {
      invoiceNumber,
      churchName: churchProfile.churchName,
      email: churchProfile.user.email,
      plan: planConfig.name,
      amount: planConfig.price,
      currency: 'CAD',
      dueDate: dueDate.toISOString(),
      paymentMethod: paymentMethod,
      status: 'pending',
      paymentInstructions: paymentMethod === 'interac' 
        ? {
            type: 'Interac e-Transfer',
            recipient: 'payments@proclaimcanada.com',
            message: invoiceNumber,
            autoDeposit: true,
          }
        : {
            type: 'Bank Transfer',
            bank: 'TD Canada Trust',
            accountName: 'Proclaim Canada Inc.',
            transitNumber: '12345',
            institutionNumber: '004',
            accountNumber: '1234567',
            swiftCode: 'TDOMCATTTOR',
            reference: invoiceNumber,
          },
    }

    // Create a pending subscription (would be activated upon payment confirmation)
    await db.subscription.upsert({
      where: { churchProfileId: churchProfile.id },
      create: {
        churchProfileId: churchProfile.id,
        planType: planType as PlanType,
        status: 'PENDING',
        currentPeriodStart: new Date(),
        currentPeriodEnd: dueDate,
        postingsRemaining: 0, // Will be set when payment is confirmed
      },
      update: {
        planType: planType as PlanType,
        status: 'PENDING',
        currentPeriodEnd: dueDate,
      },
    })

    // In production, send email with invoice
    console.log('📧 Invoice generated:', invoice)

    return NextResponse.json(
      {
        success: true,
        invoice,
        message: `Invoice ${invoiceNumber} has been generated. Please complete payment within 7 days.`,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Invoice generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}
