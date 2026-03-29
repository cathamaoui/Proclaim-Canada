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

// MVP STUB: AuditLog model not yet implemented
// TODO: Add AuditLog model to Prisma schema for full audit functionality
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;
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
    const days = parseInt(searchParams.get("days") || "7");
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");

    // Return empty audit logs for MVP (model not yet implemented)
    return NextResponse.json({
      logs: [],
      total: 0,
      page,
      pages: 0,
      message: "Audit logging coming soon - MVP placeholder",
      filters: {
        days,
        action: action || null,
        userId: userId || null,
      },
    });
  } catch (error) {
    console.error("Error in audit logs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
