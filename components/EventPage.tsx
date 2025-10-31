import Link from "next/link";
import Image, { StaticImageData } from "next/image";

// ✅ Import event images
import event1 from "../app/assets/images/event1.png";
import event2 from "../app/assets/images/event2.png";
import event3 from "../app/assets/images/event3.png";
import event4 from "../app/assets/images/event4.png";
import event5 from "../app/assets/images/event5.png";
import event6 from "../app/assets/images/event6.png";

// ✅ Define interfaces *outside* the component
interface Event {
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

interface EventPageProps {
  GithubEventDetails: Event[];
}

// ✅ Component starts here
const EventPage = ({ GithubEventDetails }: EventPageProps) => {
  // Pair each GitHub event with a static image
  const images: StaticImageData[] = [event1, event2, event3, event4, event5, event6];

  return (
    <section>
      <h3 className="p-4 text-xl font-semibold">Featured Events</h3>

      <div className="flex flex-wrap gap-10 justify-center p-10">
        {GithubEventDetails.map((event, index) => (
          <Link href={`/events/${event.slug}`} key={event.slug} className="w-[410px]">
            <Image
              src={images[index]} // ✅ loops through images safely
              alt={event.title}
              width={410}
              height={300}
              className="rounded-2xl object-cover"
            />
            <div className="mt-2 text-left">
              <p className="font-bold">{event.title}</p>
              <p className="text-sm text-gray-600">{event.location}</p>
              <p className="text-sm">{event.date} • {event.time}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default EventPage;
