import SpeakerCard from "../../ui/SpeakerCard";
import WelcomeCard from "../../ui/WelcomeCard";

const speakers = [
  { name: "Dr. Amina Jalloh", title: "CEO, TechAfrica" },
  { name: "Mr. Kwame Mensah", title: "Founder, AfriStart" },
  { name: "Ms. Nneka Okoye", title: "CTO, GreenEnergy" },
  { name: "Mr. Didier Kouassi", title: "Investor, PanAfrica VC" },
  { name: "Dr. Fatoumata Diallo", title: "Entrepreneur, AgroTech" },
  { name: "Ms. Zuri Kamara", title: "Founder, HealthLink" },
  { name: "Mr. Thabo Mokoena", title: "Investor, Ubuntu Capital" },
  { name: "Dr. Sifa Mwangi", title: "CEO, EduTech" },
];

export default function PreviousSpeakers() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <WelcomeCard title="Previous Speakers" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-16">
          {speakers.map((s, i) => (
            <SpeakerCard key={i} name={s.name} title={s.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
