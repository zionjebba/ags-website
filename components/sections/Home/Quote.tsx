import Image from "next/image";

export default function Quote() {
  return (
    <section className="bg-[var(--color-pink-accent)] py-16 px-6 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Text */}
          <div className="w-full md:w-1/2 text-white text-justify md:text-center">
            <blockquote className="text-lg md:text-2xl font-semibold leading-relaxed italic">
              &ldquo;Africas futrure will be built by bold founders and backed by visionary diaspora investors. AD-SIF is where that partbership begins&rdquo;
            </blockquote>

            <p className="mt-4 text-sm text-white/80">Mr Solomon Adjei, President AGS</p>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-center">
            <div className="relative w-50 h-40 md:w-80 md:h-56 rounded-xl overflow-hidden">
              <Image
                src="/quote-img.png"
                alt="Quote image"
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
