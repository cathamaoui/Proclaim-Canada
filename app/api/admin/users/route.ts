import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Helper to check admin status
async function isAdmin(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });
  return user?.isAdmin || false;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const admin = await isAdmin(session.user.id);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || "";

    // Get users with optional search
    const users = await db.user.findMany({
      where: search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isAdmin: true,
        isBanned: true,
        bannedReason: true,
        bannedUntil: true,
        createdAt: true,
        preacherProfile: {
          select: {
            rating: true,
            totalRatings: true,
          },
        },
        churchProfile: {
          select: {
            rating: true,
            totalRatings: true,
            verified: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
    });

    const total = await db.user.count({
      where: search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
    });

    return NextResponse.json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const admin = await isAdmin(session.user.id);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, action, reason, durationDays } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: "userId and action are required" },
        { status: 400 }
      );
    }

    // Prevent admins from being banned/modified
    const targetUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.isAdmin) {
      return NextResponse.json(
        { error: "Cannot modify admin users" },
        { status: 400 }
      );
    }

    let updateData: any = {};

    if (action === "ban") {
      const bannedUntil = durationDays
        ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
        : new Date("9999-12-31"); // Permanent ban

      updateData = {
        isBanned: true,
        bannedReason: reason || "No reason provided",
        bannedUntil: bannedUntil,
      };
    } else if (action === "unban") {
      updateData = {
        isBanned: false,
        bannedReason: null,
        bannedUntil: null,
      };
    } else if (action === "makeAdmin") {
      updateData = {
        isAdmin: true,
      };
    } else if (action === "removeAdmin") {
      updateData = {
        isAdmin: false,
      };
    } else {
      return NextResponse.json(
        { error: "Invalid action. Must be: ban, unban, makeAdmin, removeAdmin" },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: `USER_${action.toUpperCase()}`,
        details: JSON.stringify({
          targetUserId: userId,
          targetEmail: targetUser.email,
          reason: reason || null,
          durationDays: durationDays || null,
        }),
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
