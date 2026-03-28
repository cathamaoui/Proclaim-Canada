import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter required" },
        { status: 400 }
      );
    }

    // Get ratings for the specified user
    const ratings = await db.rating.findMany({
      where: {
        ratedToId: userId,
      },
      include: {
        ratedBy: {
          select: {
            id: true,
            email: true,
            name: true,
            preacherProfile: {
              select: {
                yearsOfExperience: true,
              },
            },
            churchProfile: {
              select: {
                denomination: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: skip,
    });

    const total = await db.rating.count({
      where: {
        ratedToId: userId,
      },
    });

    // Calculate average rating
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    return NextResponse.json({
      ratings,
      average: Math.round(averageRating * 10) / 10,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ratedToId, rating, comment, relatedTo, relatedId } = body;

    // Validation
    if (!ratedToId || rating === undefined) {
      return NextResponse.json(
        { error: "ratedToId and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Prevent self-rating
    if (session.user.id === ratedToId) {
      return NextResponse.json(
        { error: "Cannot rate yourself" },
        { status: 400 }
      );
    }

    // Check for duplicate rating
    const existingRating = await db.rating.findFirst({
      where: {
        ratedById: session.user.id,
        ratedToId: ratedToId,
        relatedTo: relatedTo || "GENERAL",
        relatedId: relatedId || null,
      },
    });

    if (existingRating) {
      return NextResponse.json(
        { error: "You have already rated this user in this context" },
        { status: 400 }
      );
    }

    const newRating = await db.rating.create({
      data: {
        ratedById: session.user.id,
        ratedToId: ratedToId,
        rating,
        comment: comment || null,
        relatedTo: relatedTo || "GENERAL",
        relatedId: relatedId || null,
      },
      include: {
        ratedBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Update preacher profile average rating
    const allRatings = await db.rating.findMany({
      where: { ratedToId: ratedToId, relatedTo: "GENERAL" },
      select: { rating: true },
    });

    if (allRatings.length > 0) {
      const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
      await db.preacherProfile.update({
        where: { userId: ratedToId },
        data: {
          rating: avgRating,
          totalRatings: allRatings.length,
        },
      });
    }

    return NextResponse.json({ 
      success: true,
      rating: newRating 
    });
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
