import WelcomeCard from "../../ui/WelcomeCard";
import Image from "next/image";
export default function About() {
  return (
    <section className="flex flex-col gap-12 py-16 px-6 sm:px-8 lg:px-16 bg-white max-w-7xl mt-8 mx-auto">
      <WelcomeCard title="Welcome to African-Diaspora Startups Investment Forum" />

      {/* Text */}
      <div className="text-center max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)] mb-4 ">
          Bridging diaspora capital with Africa&rsquo;s boldest startups to
          power innovation, scale ventures, and build Africa&rsquo;s future.
        </h2>

        <p className="text-base text-gray-600 leading-relaxed">
          We connect African entrepreneurs with diaspora investors and global
          partners to create lasting economic impact across the continent.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
<div className="relative w-full h-56 sm:h-48">
          <Image
            src="/about-2.png"
            alt="About 1"
            fill
            className="rounded-lg object-cover"
          />
        </div>

<div className="relative w-full h-56 sm:h-48">
          <Image
            src="/about-1.png"
            alt="About 2"
            fill
            className="rounded-lg object-cover"
          />
        </div>

<div className="relative w-full h-56 sm:h-48">
          <Image
            src="/about-3.png"
            alt="About 3"
            fill
            className="rounded-lg object-cover"
          />
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <WelcomeCard title="What Are People Saying" />
      </div>
    </section>
  );
}
