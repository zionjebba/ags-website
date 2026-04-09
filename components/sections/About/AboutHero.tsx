import Image from "next/image";

export default function AboutHero() {
  return (
    <section
      className="relative w-full py-16 px-6 flex flex-col items-center justify-center text-center bg-cover bg-center min-h-[320px]"
      style={{ backgroundImage: "url('/about-hero-bg.png')" }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
          About
          <br />
          Africa-Diaspora Startups Investment Forum
        </h1>

        {/* Logo centered below title */}
        <div className="mt-2">
          <Image
            src="/logo.png"
            alt="Africa-Diaspora Startups Investment Forum"
            width={160}
            height={160}
            style={{ width: "auto", height: "auto" }}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
