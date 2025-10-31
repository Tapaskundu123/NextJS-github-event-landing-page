
import ExploreBtn from "@/components/ExploreBtn";
import EventPage from "@/components/EventPage";

export default function Home() {

      // 1️⃣ Define the Event type
  interface Event {
    title: string;
    slug: string;
    location: string;
    date: string;  // e.g. "2025-10-31"
    time: string;  // e.g. "18:30"
  }
  
  // 2️⃣ Create an array of events (sample GitHub-like event data)
  const githubEvents: Event[] = [
    {
      title: "GitHub Universe 2025",
      slug: "github-universe-2025",
      location: "San Francisco, CA",
      date: "2025-11-10",
      time: "09:00",
    },
    {
      title: "Open Source Contributor Summit",
      slug: "open-source-contributor-summit",
      location: "Berlin, Germany",
      date: "2025-12-01",
      time: "10:00",
    },
    {
      title: "GitHub Actions Workshop",
      slug: "github-actions-workshop",
      location: "Online",
      date: "2025-11-15",
      time: "16:00",
    },
    {
      title: "AI-Powered Development with Copilot",
      slug: "ai-powered-development-with-copilot",
      location: "New York, USA",
      date: "2025-12-05",
      time: "11:30",
    },
    {
      title: "Maintainers Meetup",
      slug: "maintainers-meetup",
      location: "Tokyo, Japan",
      date: "2025-11-20",
      time: "14:00",
    },
    {
      title: "Founders Meetup",
      slug: "Startup-meetup",
      location: "Delhi, India",
      date: "2025-11-25",
      time: "19:00",
    }
  ];
  
  return (
    <>
       <section className="text-center">
         <h1 className="">The Hub for Every Dev <br/> Even You Can't Miss</h1>
         <p className="pt-2">Hackathons, Meetups and Conferences, All in One Place</p>
         <ExploreBtn/>
         <EventPage GithubEventDetails={githubEvents}/>
       </section>
    </>
  );
}
