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
    const limit = 20;
    const skip = (page - 1) * limit;
    const status = searchParams.get("status");

    // Get listings with filters
    const listings = await db.churchListing.findMany({
      where: status ? { status: status as any } : {},
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            churchProfile: {
              select: {
                denomination: true,
              },
            },
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
    });

    const total = await db.churchListing.count({
      where: status ? { status: status as any } : {},
    });

    return NextResponse.json({
      listings,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const { listingId, action } = body;

    if (!listingId || !action) {
      return NextResponse.json(
        { error: "listingId and action are required" },
        { status: 400 }
      );
    }

    const listing = await db.churchListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    let updateData: any = {};

    // Use valid ListingStatus enum values: OPEN, IN_PROGRESS, FILLED, CANCELLED
    if (action === "remove" || action === "reject") {
      updateData = {
        status: "CANCELLED",
      };
    } else if (action === "approve" || action === "open") {
      updateData = {
        status: "OPEN",
      };
    } else if (action === "fill") {
      updateData = {
        status: "FILLED",
      };
    } else {
      return NextResponse.json(
        { error: "Invalid action. Must be: remove, approve, reject, open, fill" },
        { status: 400 }
      );
    }

    // Update listing
    const updatedListing = await db.churchListing.update({
      where: { id: listingId },
      data: updateData,
    });

    // TODO: Add audit logging when AuditLog model is implemented
    // For now, just log to console
    console.log(`Admin action: ${action} on listing ${listingId} by user ${session.user.id}`);

    return NextResponse.json(updatedListing, { status: 200 });
  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
