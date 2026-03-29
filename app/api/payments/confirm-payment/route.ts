import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planType, clientSecret } = await req.json()

    if (!planType || !clientSecret) {
      return NextResponse.json(
        { error: 'Missing planType or clientSecret' },
        { status: 400 }
      )
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(
      clientSecret.split('_secret_')[0]
    )

    // Check if payment was successful
    if (paymentIntent.status === 'succeeded') {
      // Activate subscription
      const activateResponse = await fetch(
        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/subscription/activate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: req.headers.get('cookie') || '',
          },
          body: JSON.stringify({ planType }),
        }
      )

      if (!activateResponse.ok) {
        throw new Error('Failed to activate subscription')
      }

      // Create payment record in database
      await prisma.payment.create({
        data: {
          userId: session.user.id,
          stripePaymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: 'succeeded',
          planType,
          metadata: {
            email: session.user.email || '',
          },
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Payment processed successfully',
      })
    } else if (paymentIntent.status === 'requires_action') {
      return NextResponse.json(
        {
          success: false,
          requiresAction: true,
          clientSecret: paymentIntent.client_secret,
        },
        { status: 402 }
      )
    } else {
      return NextResponse.json(
        { error: 'Payment failed' },
        { status: 402 }
      )
    }
  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}
