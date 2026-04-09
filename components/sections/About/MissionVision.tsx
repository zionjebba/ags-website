import Image from "next/image";

export default function MissionVision() {
  return (
    <section className="bg-[var(--color-pink-accent)] py-16 px-6 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Mission — text left, image right */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-white">
            <h2 className="text-4xl font-extrabold text-[var(--color-primary)] mb-4">
              Mission
            </h2>
            <p className="text-base font-semibold leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          <div className="flex-1 w-full">
            <div className="relative w-full h-56 md:h-64 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/mission-img.png"
                alt="Mission"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Vision — image left, text right */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="flex-1 text-white">
            <h2 className="text-4xl font-extrabold text-[var(--color-primary)] mb-4">
              Vision
            </h2>
            <p className="text-base font-semibold leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          <div className="flex-1 w-full">
            <div className="relative w-full h-56 md:h-64 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/vision-img.png"
                alt="Vision"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
