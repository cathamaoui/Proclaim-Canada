import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists (security best practice)
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a reset link will be sent",
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token valid for 1 hour
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    // Store token in database
    await db.passwordResetToken.create({
      data: {
        token: resetTokenHash,
        userId: user.id,
        expiresAt: resetExpires,
      },
    });

    // TODO: Send email with reset link
    // const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    // await sendPasswordResetEmail(user.email, user.name, resetUrl);

    console.log(`Password reset token created for ${email}`);
    console.log(`Reset link: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`);

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, a reset link will be sent",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
