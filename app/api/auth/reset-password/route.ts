import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password, passwordConfirm } = body;

    if (!token || !password || !passwordConfirm) {
      return NextResponse.json(
        { error: "Token, password, and password confirmation are required" },
        { status: 400 }
      );
    }

    if (password !== passwordConfirm) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Hash the provided token to match database
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find the reset token
    const resetTokenRecord = await db.passwordResetToken.findUnique({
      where: { token: tokenHash },
      include: { user: true },
    });

    if (!resetTokenRecord) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    const now = new Date();
    if (resetTokenRecord.expiresAt < now) {
      // Delete expired token
      await db.passwordResetToken.delete({
        where: { token: tokenHash },
      });

      return NextResponse.json(
        { error: "Reset token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset fields
    await db.user.update({
      where: { id: resetTokenRecord.userId },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetExpires: null,
      },
    });

    // Delete the used reset token
    await db.passwordResetToken.delete({
      where: { token: tokenHash },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: resetTokenRecord.userId,
        action: "PASSWORD_RESET",
        details: JSON.stringify({
          method: "reset-token",
          timestamp: new Date().toISOString(),
        }),
      },
    });

    return NextResponse.json(
      { message: "Password reset successful. You can now log in." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reset-password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Verify token validity without resetting password
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const resetTokenRecord = await db.passwordResetToken.findUnique({
      where: { token: tokenHash },
    });

    if (!resetTokenRecord) {
      return NextResponse.json(
        { valid: false, error: "Invalid reset token" },
        { status: 400 }
      );
    }

    const now = new Date();
    if (resetTokenRecord.expiresAt < now) {
      return NextResponse.json(
        { valid: false, error: "Token has expired" },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error("Error verifying reset token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
