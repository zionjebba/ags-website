import Hero from "@/components/sections/Home/Hero";
import About from "@/components/sections/Home/About";
import Quote from "@/components/sections/Home/Quote";
import AudienceSection from "@/components/sections/Home/AudienceSection";
import UpcomingSummit from "@/components/sections/Home/UpcomingSummit";
import PreviousSpeakers from "@/components/sections/Home/PreviousSpeakers";
import Newsletter from "@/components/sections/Home/NewsLetter";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Quote />
      <AudienceSection />
      <UpcomingSummit />
      <PreviousSpeakers />
      <Newsletter />
    </main>
  );
}
