// app/api/events/[slug]/route.ts
import Event from "@/database/event.model";
import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await connectDB();

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    // Use findOne to get a single document (or null)
    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event found successfully", event },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching event by slug:", error);
    return NextResponse.json(
      { message: "Failed to fetch event" },
      { status: 500 }
    );
  }
}