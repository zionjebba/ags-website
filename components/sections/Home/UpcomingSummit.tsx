import Button from "../../ui/Button";

export default function UpcomingSummit() {
  return (
    <section className="py-16 px-4 bg-[var(--color-secondary)] text-white">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-[var(--color-primary)] mb-12">
        Upcoming Events
      </h1>{" "}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Text */}
        <div className="flex-1">
          <p className="text-[var(--color-primary)] uppercase text-xs tracking-widest mb-2 font-semibold">
            Upcoming Summit
          </p>
          <h2 className="text-3xl font-extrabold uppercase mb-3">
            CLEVA SUMMIT:
          </h2>
          <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-4">
            Building Global Pathways for African Innovation
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-6">
            This summit is to connect Startups, capital and investors between
            Africa and Europe.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button variant="primary">Get Tickets</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>

        {/* Summit poster / date card */}
        <div className="relative flex-1 max-w-full h-[500px]">
          {/* Background image */}
          <div
            className="absolute -top-6 -right-6 w-full h-full rounded-xl shadow-lg bg-cover bg-center"
            style={{ backgroundImage: "url('/summit-bg.png')" }}
          />

          {/* Foreground card with poster as background */}
          <div
            className="relative rounded-xl p-6 flex flex-col items-center text-center shadow-xl h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/summit-fg.png')" }}
          ></div>
        </div>
      </div>
    </section>
  );
}