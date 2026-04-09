"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { api, Event } from "@/lib/api";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        const allEvents = await api.events.list();
        const activeEvents = allEvents.filter(
          (event) => event.status === "active",
        );
        setEvents(activeEvents);
        setError(null);
      } catch (err) {
        setError("Unable to load upcoming events.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + events.length) % events.length);
  const next = () => setCurrent((c) => (c + 1) % events.length);
  const event = events[current];

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-full px-6 py-2 shadow-inner">
            <span className="text-sm font-bold text-gray-700 tracking-wide uppercase">
              Upcoming Events
            </span>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
            Loading upcoming events...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
            No upcoming events found.
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl shadow-xl">
            <div className="relative w-full h-72 sm:h-96 lg:h-[520px]">
              <Image
                src={
                  event.heroImagePath ??
                  event.aboutImagePath ??
                  "/events-festival.png"
                }
                alt={event.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-8 sm:px-10 lg:px-14">
              <p className="text-xs uppercase tracking-[0.26em] text-white/70 mb-2 sm:text-sm">
                {event.date} · {event.location}
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 max-w-3xl">
                {event.title}
              </h2>
              <p className="max-w-2xl text-sm sm:text-base text-white/80 leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-4 px-4 sm:bottom-6">
              <button
                onClick={prev}
                className="w-11 h-11 rounded-full border border-white/60 bg-white/10 text-white shadow-lg backdrop-blur hover:bg-white/20 transition"
                aria-label="Previous"
              >
                ←
              </button>
              <button
                onClick={next}
                className="w-11 h-11 rounded-full border border-white/60 bg-white/10 text-white shadow-lg backdrop-blur hover:bg-white/20 transition"
                aria-label="Next"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
