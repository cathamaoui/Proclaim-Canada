import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { createPaidSubscription, PLAN_CONFIGS } from '@/lib/subscription'
import { PlanType } from '@prisma/client'

// PayPal Checkout API Route
// In production, this would integrate with PayPal SDK
// For MVP, we simulate the PayPal flow

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'CHURCH') {
      return NextResponse.json(
        { error: 'Not authenticated as church' },
        { status: 401 }
      )
    }

    const { planType } = await req.json()

    if (!planType || !PLAN_CONFIGS[planType as PlanType]) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      )
    }

    // Get church profile
    const churchProfile = await db.churchProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!churchProfile) {
      return NextResponse.json(
        { error: 'Church profile not found' },
        { status: 404 }
      )
    }

    // In production, this would:
    // 1. Create a PayPal order using PayPal REST API
    // 2. Return the approval URL for the user to complete payment
    // 3. Handle the callback when payment is completed
    
    // For MVP, we'll simulate a successful PayPal payment
    const mockPayPalOrderId = `PP_${Date.now()}`
    const mockPayPalTransactionId = `TXN_${Date.now()}`

    // Create the subscription (in production, this would happen after PayPal confirms payment)
    await createPaidSubscription(
      churchProfile.id,
      planType as PlanType,
      mockPayPalOrderId,
      mockPayPalTransactionId
    )

    // In production, we would return the PayPal approval URL
    // For MVP, we return a success URL
    return NextResponse.json(
      {
        success: true,
        orderId: mockPayPalOrderId,
        // In production: approvalUrl: 'https://www.paypal.com/checkoutnow?token=...'
        message: 'PayPal payment processed successfully (MVP simulation)',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('PayPal checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to process PayPal payment' },
      { status: 500 }
    )
  }
}
