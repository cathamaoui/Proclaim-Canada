import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

// Map plan types to Stripe product prices
const PLAN_PRICES: Record<string, { amount: number; name: string }> = {
  'immediate-call': { amount: 4999, name: 'Immediate Call' },
  '1-month': { amount: 9999, name: '1-Month' },
  '3-month': { amount: 24999, name: '3-Month' },
  '6-month': { amount: 44999, name: '6-Month' },
  'unlimited-yearly': { amount: 79999, name: 'Unlimited Yearly' },
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planType, amount } = await req.json()

    if (!planType || !(planType in PLAN_PRICES)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'cad',
      metadata: {
        userId: session.user.id,
        planType,
        email: session.user.email || '',
      },
      description: `Proclaim Canada - ${PLAN_PRICES[planType].name} Plan`,
    })

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
