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
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-white">{event.title}</h1>
     
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
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
              <p className="text-gray-300 mb-6">{event.overview}</p>
              <div className="space-y-2 text-gray-200">
                <p>
                  <strong className="text-emerald-400">Location:</strong> {event.venue}, {event.location}
                </p>
                <p>
                  <strong className="text-emerald-400">Date:</strong> {event.date}
                </p>
                <p>
                  <strong className="text-emerald-400">Time:</strong> {event.time}
                </p>
                <p>
                  <strong className="text-emerald-400">Mode:</strong> {event.mode}
                </p>
                <p>
                  <strong className="text-emerald-400">Audience:</strong> {event.audience}
                </p>
                <p>
                  <strong className="text-emerald-400">Organizer:</strong> {event.organizer}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-white">Agenda</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  {event.agenda.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-white">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-emerald-900 text-emerald-200 text-xs font-medium px-2.5 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  Full Description: {event.description}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <BookingForm slug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
}