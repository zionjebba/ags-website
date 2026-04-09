import Image from "next/image";

const partners = [
  { name: "Africa-Diaspora Forum", logo: "/logo.png" },
  { name: "AGS", logo: "/event-partner-2.png" },
  { name: "Partner 3", logo: "/event-partner-3.png" },
];

export default function EventPartners() {
  return (
    <section className="bg-[var(--color-pink-accent)] py-12 px-6 sm:px-8 mt-16 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Plain white centered heading — no pill */}
        <h2 className="text-center text-white text-base font-bold mb-8 tracking-wide">
          Event Partners
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {partners.map((p) => (
            <div
              key={p.name}
              className="bg-white rounded-xl w-36 h-28 flex items-center justify-center shadow-md p-4"
            >
              <Image
                src={p.logo}
                alt={p.name}
                width={110}
                height={110}
                style={{ width: "auto", height: "auto" }}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
