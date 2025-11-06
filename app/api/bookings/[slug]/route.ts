import Booking from "@/database/booking.model";
import Event from "@/database/event.model";   // <-- import Event model
import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function POST(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await connectDB();

    const { slug } = await params;
    const { email } = await req.json();

    if (!slug)
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );

    if (!email)
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );

    // -------------------------------------------------
    // 1. Find the event by its **slug**
    // -------------------------------------------------
    const event = await Event.findOne({ slug });
    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    // -------------------------------------------------
    // 2. Create the booking (eventId is the _id from Event)
    // -------------------------------------------------
    const booking = await Booking.create({
      eventId: event._id,   // <-- correct field name
      email,
      EventDetails:slug
    });

    // `create` already saves, but we return the doc for clarity
    return NextResponse.json(
      { message: "Booking successful", booking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Booking error:", error);

    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const msg =
        error.errors?.email?.message ||
        error.message ||
        "Invalid data";
      return NextResponse.json({ message: msg }, { status: 400 });
    }

    // Duplicate key (unique index on eventId + email)
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "You have already booked this event" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}