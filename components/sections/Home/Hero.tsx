import Image from "next/image"; // ← this was missing
import CountdownTimer from "../../ui/CountdownTimer";

export default function Hero() {
  return (
    <section className="relative w-full pb-16">
      <div
        className="relative w-full h-[480px] md:h-[560px]  bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-20 text-center px-4">
          <div className="hidden md:block absolute top-4 right-4 w-36 md:w-48">
  {/* Background image */}
  <div className="relative">
    <div className="absolute top-4 right-4 w-80 md:w-80 h-56 md:h-64">
                {/* Back image — top-left */}
                <Image
                  alt=""
                  src="/hero-b.png"
                  className="absolute top-0 left-0 w-[70%] rounded-xl shadow-lg object-cover"
                  width={1920}
                  height={1080}
                />
                {/* Front image — bottom-right, its top-left corner touches back image's bottom-right */}
                <Image
                  alt=""
                  src="/hero-f.png"
                  className="absolute bottom-0 right-0 w-[70%] rounded-xl shadow-xl object-cover z-10"
                  width={1920}
                  height={1080}
                />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold uppercase leading-tight text-white drop-shadow-lg">
            Africa-Diaspora
            <br />
            <span className="text-[var(--color-primary)]">
              Startups Investment
            </span>
          </h1>
        </div>
      </div>

      {/* Floating panel */}
      <div className="relative z-20 -mt-14 mx-4 md:mx-auto md:max-w-2xl flex flex-col items-center gap-4">
        <div className="w-full bg-[url('/hero-rectangle.png')] bg-cover bg-center rounded-2xl shadow-xl px-6 py-4">
          <CountdownTimer targetDate="2026-09-13T00:00:00" />
        </div>

        <div className="flex flex-wrap gap-12 mt-4 justify-center w-full">
          <span className="flex items-center gap-2 bg-white text-black text-xs font-medium rounded-md px-4 py-2 shadow-md border border-black-100">
            <Image alt="" src="/email-icon.png" width={25} height={25} />{" "}
            info@africaforum.org
          </span>
          <span className="flex items-center gap-2 bg-white text-black text-xs font-medium rounded-md px-4 py-2 shadow-md border border-black-100">
            <Image alt="" src="/location-icon.png" width={25} height={25} />{" "}
            Germany, Africa
          </span>
          <span className="flex items-center gap-2 bg-white text-black text-xs font-medium rounded-md px-4 py-2 shadow-md border border-black-100">
            <Image alt="" src="/phone-icon.png" width={20} height={20} /> +49
            000 000 000
          </span>
        </div>
      </div>
    </section>
  );
}
