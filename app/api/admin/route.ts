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

    // Get all statistics
    const totalUsers = await db.user.count();
    const totalPreachers = await db.user.count({ where: { role: "PREACHER" } });
    const totalChurches = await db.user.count({ where: { role: "CHURCH" } });
    const bannedUsers = await db.user.count({ where: { isBanned: true } });

    const totalListings = await db.churchListing.count();
    const activeListings = await db.churchListing.count({
      where: { status: "ACTIVE" },
    });
    const removedListings = await db.churchListing.count({
      where: { status: "REMOVED" },
    });

    const totalApplications = await db.application.count();
    const pendingApplications = await db.application.count({
      where: { status: "PENDING" },
    });
    const acceptedApplications = await db.application.count({
      where: { status: "ACCEPTED" },
    });
    const rejectedApplications = await db.application.count({
      where: { status: "REJECTED" },
    });

    const totalMessages = await db.message.count();
    const totalRatings = await db.rating.count();

    // Get stats for the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const newUsersLastWeek = await db.user.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    });

    const newListingsLastWeek = await db.churchListing.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    });

    const newApplicationsLastWeek = await db.application.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    });

    const newMessagesLastWeek = await db.message.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    });

    // Get recent activity
    const recentLogs = await db.auditLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      users: {
        total: totalUsers,
        preachers: totalPreachers,
        churches: totalChurches,
        banned: bannedUsers,
        newLastWeek: newUsersLastWeek,
      },
      listings: {
        total: totalListings,
        active: activeListings,
        removed: removedListings,
        newLastWeek: newListingsLastWeek,
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        accepted: acceptedApplications,
        rejected: rejectedApplications,
        newLastWeek: newApplicationsLastWeek,
      },
      messages: {
        total: totalMessages,
        newLastWeek: newMessagesLastWeek,
      },
      ratings: {
        total: totalRatings,
      },
      recentActivity: recentLogs,
    });
  } catch (error) {
    console.error("Error fetching admin statistics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
