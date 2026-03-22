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
        ratedUserId: userId,
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
        relatedApplication: {
          select: {
            id: true,
            status: true,
          },
        },
        relatedListing: {
          select: {
            id: true,
            title: true,
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
        ratedUserId: userId,
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
    const {
      ratedUserId,
      rating,
      review,
      type,
      relatedApplicationId,
      relatedListingId,
    } = body;

    // Validation
    if (!ratedUserId || !rating) {
      return NextResponse.json(
        { error: "ratedUserId and rating are required" },
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
    if (session.user.id === ratedUserId) {
      return NextResponse.json(
        { error: "Cannot rate yourself" },
        { status: 400 }
      );
    }

    // Check for duplicate rating (prevent multiple ratings from same person)
    const existingRating = await db.rating.findFirst({
      where: {
        AND: [
          { ratedById: session.user.id },
          { ratedUserId: ratedUserId },
          { type: type || "GENERAL" },
        ],
      },
    });

    if (existingRating) {
      return NextResponse.json(
        { error: "You have already rated this user in this context" },
        { status: 400 }
      );
    }

    // Verify relationship exists (check if they've interacted)
    let hasInteraction = false;

    if (type === "APPLICATION") {
      if (!relatedApplicationId) {
        return NextResponse.json(
          { error: "relatedApplicationId required for APPLICATION rating" },
          { status: 400 }
        );
      }

      const application = await db.application.findUnique({
        where: { id: relatedApplicationId },
      });

      if (
        !application ||
        (application.preacherId !== session.user.id &&
          application.preacherId !== ratedUserId)
      ) {
        return NextResponse.json(
          { error: "Invalid application reference" },
          { status: 400 }
        );
      }

      hasInteraction = true;
    } else if (type === "LISTING") {
      if (!relatedListingId) {
        return NextResponse.json(
          { error: "relatedListingId required for LISTING rating" },
          { status: 400 }
        );
      }

      const listing = await db.churchListing.findUnique({
        where: { id: relatedListingId },
      });

      if (
        !listing ||
        (listing.churchId !== session.user.id && listing.churchId !== ratedUserId)
      ) {
        return NextResponse.json(
          { error: "Invalid listing reference" },
          { status: 400 }
        );
      }

      hasInteraction = true;
    } else {
      // GENERAL ratings require direct message or application history
      const hasCorrespondence =
        (await db.message.count({
          where: {
            OR: [
              {
                AND: [
                  { senderId: session.user.id },
                  { receiverId: ratedUserId },
                ],
              },
              {
                AND: [
                  { senderId: ratedUserId },
                  { receiverId: session.user.id },
                ],
              },
            ],
          },
        })) > 0;

      hasInteraction = hasCorrespondence;
    }

    if (!hasInteraction && type !== "GENERAL") {
      return NextResponse.json(
        { error: "No interaction found to rate" },
        { status: 400 }
      );
    }

    // Create the rating
    const newRating = await db.rating.create({
      data: {
        ratedById: session.user.id,
        ratedUserId,
        rating,
        review: review || null,
        type: type || "GENERAL",
        relatedApplicationId: relatedApplicationId || null,
        relatedListingId: relatedListingId || null,
      },
      include: {
        ratedBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    // Update profile averages
    const ratedUser = await db.user.findUnique({
      where: { id: ratedUserId },
      select: {
        preacherProfile: true,
        churchProfile: true,
      },
    });

    if (ratedUser?.preacherProfile) {
      const ratings = await db.rating.findMany({
        where: { ratedUserId },
      });

      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      await db.preacherProfile.update({
        where: { userId: ratedUserId },
        data: {
          rating: avgRating,
          totalRatings: ratings.length,
        },
      });
    }

    if (ratedUser?.churchProfile) {
      const ratings = await db.rating.findMany({
        where: { ratedUserId },
      });

      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      await db.churchProfile.update({
        where: { userId: ratedUserId },
        data: {
          rating: avgRating,
          totalRatings: ratings.length,
        },
      });
    }

    return NextResponse.json(newRating, { status: 201 });
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
