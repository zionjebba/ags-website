"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

interface DashboardStats {
  events: number;
  bookings: number;
  partners: number;
  subscribers: number;
  revenue: number;
}

interface RecentBooking {
  id: string;
  name: string;
  email: string;
  event: { title: string };
  plan: string;
  amount: number;
  status: string;
  createdAt: string;
}

const quickActions = [
  {
    label: "Create new event",
    href: "/admin/events/new",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    label: "Write blog post",
    href: "/admin/blogs/new",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  {
    label: "Send newsletter",
    href: "/admin/newsletter",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    label: "Review partners",
    href: "/admin/partners",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    events: 0,
    bookings: 0,
    partners: 0,
    subscribers: 0,
    revenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Check authentication first
        await api.auth.me();
        
        // Fetch dashboard data
        const [statsData, bookingsData] = await Promise.all([
          api.dashboard.stats() as Promise<DashboardStats>,
          api.dashboard.recentBookings() as Promise<RecentBooking[]>,
        ]);
        
        setStats(statsData);
        setRecentBookings(bookingsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      label: "Total Events",
      value: stats?.events?.toString() || "0",
      change: "Active events",
      href: "/admin/events",
    },
    {
      label: "Total Bookings",
      value: stats?.bookings?.toString() || "0",
      change: "Completed bookings",
      href: "/admin/bookings",
    },
    {
      label: "Subscribers",
      value: stats?.subscribers?.toString() || "0",
      change: "Newsletter subscribers",
      href: "/admin/subscribers",
    },
    {
      label: "Partner Requests",
      value: stats?.partners?.toString() || "0",
      change: "Pending review",
      href: "/admin/partners",
    },
    {
      label: "Revenue",
      value: `₵${(stats?.revenue / 100)?.toLocaleString() || "0"}`,
      change: "Total revenue",
      href: "/admin/bookings",
    },
  ];

  return (
<div className="flex flex-col gap-8 pt-16 lg:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back. Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition cursor-pointer">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Quick actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <div
                className={`border rounded-lg px-4 py-2 text-sm font-medium cursor-pointer hover:opacity-80 transition ${action.color}`}
              >
                {action.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">
            Recent bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="text-xs text-blue-600 hover:underline"
          >
            View all
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            No bookings yet
          </div>
        ) : (<div>
  {/* Mobile cards */}
  <div className="flex flex-col gap-3 sm:hidden">
    {recentBookings.map((booking) => (
      <div key={booking.id} className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex justify-between items-start mb-2">
          <p className="font-medium text-gray-900 text-sm">{booking.name}</p>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
            booking.status === "confirmed"
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700"
          }`}>
            {booking.status}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3">{booking.event?.title}</p>
        <div className="flex justify-between text-xs text-gray-600">
          <span>{booking.plan}</span>
          <span className="font-medium">₵{booking.amount?.toLocaleString()}</span>
          <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    ))}
  </div>

  {/* Desktop table */}
  <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
    <table className="w-full text-sm min-w-[640px]">
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50">
          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Event</th>
          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan</th>
          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
          <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
        </tr>
      </thead>
      <tbody>
        {recentBookings.map((booking) => (
          <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
            <td className="px-5 py-3 font-medium text-gray-900">{booking.name}</td>
            <td className="px-5 py-3 text-gray-600">{booking.event?.title}</td>
            <td className="px-5 py-3 text-gray-600">{booking.plan}</td>
            <td className="px-5 py-3 text-gray-600">₵{booking.amount?.toLocaleString()}</td>
            <td className="px-5 py-3">
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                booking.status === "confirmed"
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}>
                {booking.status}
              </span>
            </td>
            <td className="px-5 py-3 text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
        )}
      </div>
    </div>
  );
}