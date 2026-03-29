import Stripe from 'stripe'
import { prisma } from '@/lib/db'
import { sendPaymentFailedNotification } from '@/lib/email-notifications'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { userId, planType } = paymentIntent.metadata as {
      userId: string
      planType: string
    }

    // Activate subscription
    const subscription = await prisma.subscription.upsert({
      where: { userId },
      update: {
        planType,
        status: 'active',
        startDate: new Date(),
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        userId,
        planType,
        status: 'active',
        startDate: new Date(),
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        userId,
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'succeeded',
        planType,
      },
    })

    console.log(
      `✅ Payment succeeded for user ${userId}, plan ${planType}`
    )
  } catch (error) {
    console.error('Error handling payment_intent.succeeded:', error)
    throw error
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { userId, planType } = paymentIntent.metadata as {
      userId: string
      planType: string
    }

    // Create payment record for failed payment
    await prisma.payment.create({
      data: {
        userId,
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'failed',
        planType,
        failureReason: paymentIntent.last_payment_error?.message || 'Unknown error',
      },
    })

    // Send payment failed notification
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      })

      if (user?.email) {
        const errorMessage = paymentIntent.last_payment_error?.message || 'Your payment could not be processed'
        
        await sendPaymentFailedNotification(
          user.email,
          user.name || 'Valued Customer',
          planType,
          errorMessage,
          `${process.env.NEXTAUTH_URL}/church-dashboard/settings/subscription`
        )
      }
    } catch (emailError) {
      console.error('Failed to send payment failed notification:', emailError)
    }

    console.log(`❌ Payment failed for user ${userId}`)
  } catch (error) {
    console.error('Error handling payment_intent.payment_failed:', error)
    throw error
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    const paymentIntentId = charge.payment_intent as string

    // Update payment status
    await prisma.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntentId },
      data: { status: 'refunded' },
    })

    console.log(`🔄 Charge refunded: ${charge.id}`)
  } catch (error) {
    console.error('Error handling charge.refunded:', error)
    throw error
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge)
        break

      // Add more event handlers as needed
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
