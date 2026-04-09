"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";

interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  venue: string | null;
  phone: string | null;
  email: string | null;
  heroImagePath: string | null;
  aboutImagePath: string | null;
  ticketPlans: Array<{ name: string; price: number }>;
  status: "draft" | "active" | "ended";
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const tabs = [
  "All Events",
  "Summits",
  "Mixers",
  "Cooperate",
  "WorkShop",
  "Seminars",
];

const ITEMS_PER_PAGE = 3;

export default function EventsList() {
  const [activeTab, setActiveTab] = useState("All Events");
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await api.events.list();
        setEvents(data);
        setError(null);
      } catch (err) {
        setError("Failed to load events");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filter events based on selected tab
  const filtered =
    activeTab === "All Events"
      ? events
      : events.filter((e) => {
          // Map frontend tabs to backend status
          const statusMap: Record<string, string> = {
            Summits: "active",
            Mixers: "active",
            Cooperate: "active",
            WorkShop: "active",
            Seminars: "active",
          };
          return e.status === statusMap[activeTab];
        });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="py-10 px-6 sm:px-8 lg:px-16 bg-[url('/events-list-bg.png')] bg-cover rounded-2xl shadow-lg mx-auto max-w-7xl">
        <div className="text-center py-20">Loading events...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 px-6 sm:px-8 lg:px-16 bg-[url('/events-list-bg.png')] bg-cover rounded-2xl shadow-lg mx-auto max-w-7xl">
        <div className="text-center py-20 text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="py-10 px-6 sm:px-8 lg:px-16 bg-[url('/events-list-bg.png')] bg-cover rounded-2xl shadow-lg mx-auto max-w-7xl">
      <div className="max-w-7xl mx-auto ">
        {/* Tab bar */}
        <div className="bg-white rounded-2xl sm:rounded-full px-4 py-3 flex flex-wrap gap-2 mb-8 shadow-sm">
  {tabs.map((tab) => (
    <button
      key={tab}
      onClick={() => {
        setActiveTab(tab);
        setPage(1);
      }}
      className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-all ${
        activeTab === tab
          ? "bg-blue-500 text-white"
          : "text-gray-500 hover:text-black bg-gray-100"
      }`}
    >
      {tab}
    </button>
  ))}
</div>

        {/* Event rows */}
        <div className="flex flex-col gap-5">
          {paginated.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              No events in this category yet.
            </p>
          )}

          {paginated.map((event) => (
            <div
              key={event.id}
              className="flex flex-col sm:flex-row items-stretch gap-0"
            >
              {/* Image */}
              <div className="relative w-full sm:w-52 h-44 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm">
                {event.heroImagePath ? (
                  <Image
                    src={event.heroImagePath}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 208px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>

              {/* White card */}
              <div className="flex flex-1 bg-white rounded-2xl shadow-sm ml-0 sm:ml-3 mt-3 sm:mt-0 overflow-hidden">
                {/* Event info */}
                <div className="flex-1 px-5 py-4 flex flex-col justify-center">
                  <span className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-500 w-fit mb-3">
                    {formatDate(event.date)}
                    <span className="text-gray-300">|</span>
                    {event.time}
                  </span>

                  <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                    {event.title}
                  </h3>

                  <p className="text-xs text-[var(--color-pink-accent)] font-semibold flex items-center gap-1">
                    📍 {event.location}
                  </p>
                </div>

                {/* Pink vertical divider */}
                <div className="w-px bg-[var(--color-pink-accent)] self-stretch my-4" />

                {/* Register + speakers */}
                <div className="flex flex-col items-center justify-center gap-3 px-5 py-4 flex-shrink-0">
                  <Link
                    href={`/register/${event.slug}`}
                    className="w-full text-center"
                  >
                    <button className="bg-gray-100 text-black text-xs font-semibold px-5 py-2 rounded-full hover:bg-gray-300 transition whitespace-nowrap w-full">
                      Register
                    </button>
                  </Link>

                  {/* Speaker avatars - optional, can be removed or kept as static */}
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                        <Image
                          src="/speaker-1.png"
                          alt="Speaker"
                          width={28}
                          height={28}
                          className="object-cover"
                        />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-gray-400 border-2 border-white overflow-hidden">
                        <Image
                          src="/speaker-2.png"
                          alt="Speaker"
                          width={28}
                          height={28}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Speakers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition text-sm disabled:opacity-40"
            >
              ←
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-full text-sm font-semibold transition ${
                  page === i + 1
                    ? "bg-gray-900 text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition text-sm disabled:opacity-40"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
