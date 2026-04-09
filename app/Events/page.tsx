import EventsHero from "@/components/sections/Events/EventsHero";
import UpcomingEvents from "@/components/sections/Events/UpcomingEvents";
import EventsList from "@/components/sections/Events/EventsList";
import EventPartners from "@/components/sections/Events/EventPartners";
import PartnerForm from "@/components/sections/Events/PartnerForm";

export default function EventsPage() {
  return (
    <main>
      <EventsHero />
      <UpcomingEvents />
      <EventsList />
      <EventPartners />
      <PartnerForm />
    </main>
  );
}
