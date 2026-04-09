"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { api, Event } from "@/lib/api";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.events.list(false);
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading events...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-10">
        {/* Hero image */}
        <div className="relative w-full h-52 md:h-72 rounded-2xl overflow-hidden mb-8 shadow-md">
          <Image
            src="/events-hero-bg.png"
            alt="Events"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-4xl font-extrabold text-white">Events</h2>
          </div>
        </div>

        <p className="text-center text-sm font-semibold text-gray-700 mb-6">
          Choose Your Preferred Event and Register Now
        </p>

        {/* Event cards */}
        <div className="flex flex-col gap-5 mb-10">
          {events
            .filter((e) => e.status === "active")
            .map((event) => (
              <div
                key={event.id}
                className="flex flex-col sm:flex-row items-stretch gap-0"
              >
                {/* Thumbnail */}
                <div className="relative w-full sm:w-44 h-36 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm">
                  <Image
                    src={event.heroImagePath || "/events-festival.png"}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* White card */}
                <div className="flex flex-1 bg-white rounded-2xl shadow-sm ml-0 sm:ml-3 mt-3 sm:mt-0 border border-gray-100 overflow-hidden">
                  <div className="flex-1 px-5 py-4 flex flex-col justify-center">
                    <span className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-500 w-fit mb-2">
                      {new Date(event.date).toLocaleDateString()}
                      <span className="text-gray-300">|</span>
                      {event.time}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-xs text-[var(--color-primary)] font-semibold mb-2">
                      📍 {event.location}
                    </p>
                  </div>

                  <div className="w-px bg-[var(--color-pink-accent)] self-stretch my-4" />

                  {/* Register button */}
                  <div className="flex flex-col items-center justify-center gap-3 px-5 py-4 flex-shrink-0">
                    <Link href={`/events/${event.slug}`}>
                      <button className="bg-gray-100 text-black text-xs font-semibold px-5 py-2 rounded-full hover:bg-gray-200 transition whitespace-nowrap">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
