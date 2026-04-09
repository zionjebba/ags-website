"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Event {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  status: string;
  ticketPlans: Array<{ name: string; price: number }>;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.events.list(true);
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.events.delete(id);
      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Events
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage all forum events</p>
        </div>
        <Link href="/admin/events/new" className="w-full sm:w-auto">
          <button className="bg-[#0f172a] text-white text-sm font-semibold px-4 py-2.5 sm:py-2 rounded-lg hover:bg-[#1e293b] transition w-full sm:w-auto">
            + New event
          </button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          No events found. Create your first event!
        </div>
      ) : (
        <>
          {/* Mobile card view */}
          <div className="block lg:hidden space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900 flex-1 mr-2 text-base sm:text-lg">
                    {event.title}
                  </h3>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                      event.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {event.status === "active" ? "Active" : event.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                    <span className="text-gray-500">Date:</span>
                    <span className="text-gray-600">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                    <span className="text-gray-500">Location:</span>
                    <span className="text-gray-600">{event.location}</span>
                  </div>
                  <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                    <span className="text-gray-500">Ticket Plans:</span>
                    <span className="text-gray-600">
                      {event.ticketPlans.length}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100">
                  <Link href={`/admin/events/edit/${event.slug}`}>Edit</Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-sm text-red-500 hover:underline font-medium py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table view */}
          <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Title
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Location
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Ticket Plans
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {event.title}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {event.location}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {event.ticketPlans.length} plans
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          event.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {event.status === "active" ? "Active" : event.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/events/${event.slug}`}
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-xs text-red-500 hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
