import { connectDB } from "@/lib/mongodb";
import Event from "@/database/event.model";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// ✅ Manual config for reliability (ensure .env has all 3 values)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Ensure the request is multipart/form-data
    const formData = await req.formData();
    const file = formData.get("image") as File;
    if (!file) {
      return NextResponse.json({ message: "Image file is required" }, { status: 400 });
    }

    // ✅ Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Upload to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "DevEvent",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string });
        }
      );
      uploadStream.end(buffer);
    });

    // ✅ Helper to get trimmed string values
    const getString = (key: string): string => {
      const value = formData.get(key);
      return typeof value === 'string' ? value.trim() : '';
    };

    // ✅ Helper to parse array fields (handles multiple values or comma-separated string)
    const parseArray = (key: string): string[] => {
      const values = formData.getAll(key);
      if (values.length > 1) {
        return values
          .map((v) => (typeof v === 'string' ? v.trim() : ''))
          .filter(Boolean);
      } else if (values.length === 1) {
        const val = values[0];
        if (typeof val === 'string') {
          return val.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
      return [];
    };

    // ✅ Extract and validate required fields
    const title = getString('title');
    const description = getString('description');
    const overview = getString('overview');
    const venue = getString('venue');
    const location = getString('location');
    const date = formData.get('date') as string || ''; // No trim for date
    const time = formData.get('time') as string || ''; // No trim for time
    const mode = getString('mode');
    const audience = getString('audience');
    const organizer = getString('organizer');
    const agenda = parseArray('agenda');
    const tags = parseArray('tags');

    // ✅ Upfront check for missing required fields
    const missingFields: string[] = [];
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (!overview) missingFields.push('overview');
    if (!venue) missingFields.push('venue');
    if (!location) missingFields.push('location');
    if (!date) missingFields.push('date');
    if (!time) missingFields.push('time');
    if (!mode) missingFields.push('mode');
    if (!audience) missingFields.push('audience');
    if (!organizer) missingFields.push('organizer');
    if (agenda.length === 0) missingFields.push('agenda');
    if (tags.length === 0) missingFields.push('tags');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // ✅ Create event data object (slug generated in pre-save hook)
    const eventData = {
      title,
      description,
      overview,
      venue,
      location,
      date,
      time,
      mode,
      audience,
      agenda,
      organizer,
      tags,
      image: uploadResult.secure_url,
    };

    // ✅ Create event (Mongoose validation and pre-save hooks will run)
    const createdEvent = await Event.create(eventData);

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Event creation error:", err);
    return NextResponse.json(
      {
        message: "Event creation failed",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {

     await connectDB();

    const Events= await Event.find().sort({createdAt:-1});// db find events and sort from new to old
  
    return NextResponse.json({message:"Events found successfully",Events}) 
  } 
  catch (error) {
      console.error(error);
      return NextResponse.json({message:"sww", error})
  }
   
}