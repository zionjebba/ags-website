"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { api, Event } from "@/lib/api";

export default function EventRegistrationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await api.events.get(slug);
        setEvent(data);
      } catch (error) {
        console.error("Event not found:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading event details...</div>
      </main>
    );
  }

  if (notFound || !event) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Event not found
          </h1>
          <p className="text-gray-500 mb-4">
            The event you are looking for does not exist.
          </p>
          <Link href="/events" className="text-blue-600 hover:underline">
            ← Back to events
          </Link>
        </div>
      </main>
    );
  }

  // Parse ticket plans
  // const ticketPlans = Array.isArray(event.ticketPlans) ? event.ticketPlans : [];
  // const speakers = event.speakers || [];
  // const schedule = event.schedule || [];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 pb-16">
        {/* ── Selected event notice ── */}
        <p className="text-center text-sm mt-4 font-semibold text-gray-600 mb-4">
          You&apos;ve Selected the event below. Read More About Event
        </p>

        {/* ── Event title ── */}
        <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-4">
          {event.title}
        </h2>

        {/* ── Hero section ── */}
        <section className="relative w-full pb-16">
          <div
            className="relative w-full h-[480px] md:h-[560px] bg-cover bg-center"
            style={{
              backgroundImage: `url('${event.heroImagePath || "/events-festival.png"}')`,
            }}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 h-full flex flex-col items-center justify-end pb-20 text-center px-4">
              <h1 className="text-4xl md:text-5xl font-extrabold uppercase leading-tight text-white drop-shadow-lg">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Floating panel */}
          <div className="relative z-20 -mt-14 mx-4 md:mx-auto md:max-w-2xl flex flex-col items-center gap-4">
            <div className="w-full bg-[url('/hero-rectangle.png')] bg-cover bg-center rounded-2xl shadow-xl px-6 py-4">
              <CountdownTimer targetDate={event.date} />
            </div>

            <div className="flex flex-wrap gap-12 mt-4 justify-center w-full">
              <span className="flex items-center gap-2 bg-white text-black text-xs font-medium rounded-md px-4 py-2 shadow-md">
                {event.email || "info@forum.com"}
              </span>
              <span className="flex items-center gap-2 bg-white text-black text-xs font-medium rounded-md px-4 py-2 shadow-md">
                {event.location}
              </span>
              <span className="flex items-center gap-2 bg-white text-black text-xs font-medium rounded-md px-4 py-2 shadow-md">
                {event.phone || "+233 (0) 00 0000 000"}
              </span>
            </div>
          </div>
        </section>

        {/* ── About section ── */}
        <section className="bg-[var(--color-pink-accent)] rounded-2xl px-8 py-10 mb-10">
          <h3 className="text-center text-white font-extrabold text-lg uppercase tracking-widest mb-6">
            About {event.title.toUpperCase()}
          </h3>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {event.aboutImagePath && (
              <div className="relative w-full md:w-48 h-36 flex-shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={event.aboutImagePath}
                  alt="About"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <p className="text-white text-sm leading-relaxed font-medium">
              {event.description}
            </p>
          </div>
        </section>

        {/* ── Register Now button ── */}
        <div className="flex justify-center mb-16">
          <Link href={`/register/${event.slug}`}>
            <button className="bg-[var(--color-primary)] text-black font-extrabold px-10 py-3 rounded-full hover:bg-[var(--color-primary-dark)] transition">
              Register Now
            </button>
          </Link>
        </div>

        {/* ── Partners section ── */}
        <section className="bg-[var(--color-pink-accent)] rounded-2xl px-8 py-10">
          <p className="text-center text-white text-sm font-bold mb-4">
            Powered By :
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {/* Add your powered by logos here */}
          </div>

          <p className="text-center text-white text-sm font-bold mb-4">
            In Partnership with :
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {/* Add your partner logos here */}
          </div>
        </section>
      </div>
    </main>
  );
}
