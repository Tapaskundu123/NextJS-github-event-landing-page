// app/events/[slug]/page.tsx
import BookingForm from "@/components/BookingForm";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface Event {
  title: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  slug: string;
}

export default async function EventBySlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;


  // Optional: Validate slug format
  if (!slug || slug.includes("..") || slug.includes("/")) {
    notFound();
  }

  let event: Event | null = null;

  try {
    const response = await fetch(`${BASE_URL}/api/events/${slug}`, {
      cache: "no-store", // Always fresh
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    // API returns: { message: "...", event: { ... } }
    event = result.event || null;

    if (!event) {
      notFound();
    }
  } catch (error) {
    console.error("Failed to fetch event:", error);
    notFound();
  }


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
     
     <div className="flex justify-between">
       <div className="">
        <div>
          <Image
            src={event.image}
            alt={event.title}
             width={410}
              height={300}
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>
        <div>
          <p className="text-gray-600 mb-4">{event.overview}</p>
          <div className="space-y-2">
            <p>
              <strong>Location:</strong> {event.venue}, {event.location}
            </p>
            <p>
              <strong>Date:</strong> {event.date}
            </p>
            <p>
              <strong>Time:</strong> {event.time}
            </p>
            <p>
              <strong>Mode:</strong> {event.mode}
            </p>
            <p>
              <strong>Audience:</strong> {event.audience}
            </p>
            <p>
              <strong>Organizer:</strong> {event.organizer}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Agenda</h3>
            <ul className="list-disc list-inside space-y-1">
              {event.agenda.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-500">
              Full Description: {event.description}
            </p>
          </div>
        </div>
      </div>

       <BookingForm slug={slug} />
     </div>

    </div>
  );
}