"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api, Event } from "@/lib/api";

const roles = [
  { label: "Startup", image: "/about-1.png", userType: "startup" },
  { label: "Investor", image: "/about-2.png", userType: "investor" },
  { label: "Partner", image: "/about-3.png", userType: "partner" },
];

export default function RegisterPage() {
  const params = useParams();
const slug = params.slug as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Get all events and find by ID
        const data = await api.events.get(slug);
        setEvent(data);
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Event not found
          </h1>
          <Link href="/events" className="text-blue-600 hover:underline">
            ← Back to events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex">
      {/* Left — role selector */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-16 py-16">
        <div className="max-w-xl w-full flex flex-col items-center text-center">
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Africa-Diaspora Forum"
            width={220}
            height={220}
            className="mb-6"
          />

          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Register for {event.title}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Choose how you would like to be involved in this event
          </p>

          {/* Role cards */}
          <div className="flex gap-6 justify-center mb-8 flex-wrap">
            {roles.map((role) => (
              <Link
                key={role.label}
                href={`/register/${slug}/${role.userType}/book`}
              >
                <div className="flex flex-col items-center gap-3 cursor-pointer group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-[var(--color-primary)] transition shadow-md group-hover:shadow-xl">
                    <Image
                      src={role.image}
                      alt={role.label}
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {role.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-[10px] text-gray-400 mt-10">
            © Africa-Diaspora Startups Investment Forum 2026
          </p>
        </div>
      </div>

      {/* Right — full-height image */}
      <div className="relative hidden md:block w-1/2 min-h-screen">
        <Image
          src={event.heroImagePath || "/about-1.png"}
          alt="Event"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
      </div>
    </main>
  );
}
