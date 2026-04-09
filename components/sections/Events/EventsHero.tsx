export default function EventsHero() {
  return (
    <section
      className="relative w-full h-48 md:h-[70vh] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/events-hero-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <h1 className="relative z-10 text-3xl md:text-4xl  font-extrabold text-white tracking-widest uppercase">
        All Events
      </h1>
    </section>
  );
}
