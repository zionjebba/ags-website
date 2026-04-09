import SectionHeading from "../../ui/SectionHeading";
import AudienceCard from "../../ui/AudienceCard";

const audiences = [
  { label: "Startup", imageUrl: "/startup.png" },
  { label: "Investor", imageUrl: "/investor.png" },
  { label: "Partner", imageUrl: "/partner.png" },
];

export default function AudienceSection() {
  return (
    <section className="py-16 px-4 bg-[var(--color-bg-light)]">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Why Attend Our Events?" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((a) => (
            <AudienceCard key={a.label} label={a.label} imageUrl={a.imageUrl} />
          ))}
        </div>
      </div>
    </section>
  );
}
