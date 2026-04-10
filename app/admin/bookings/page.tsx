"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  amount: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
  paymentRef: string;
  event: { title: string };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const params = statusFilter !== "all" ? `status=${statusFilter}` : "";
        const data = await api.bookings.list(params);
        setBookings(data || []);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.bookings.updateStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "completed")
    .reduce((sum, b) => sum + Number(b.amount), 0);

  if (loading) {
    return <div className="text-center py-20 px-4">Loading bookings...</div>;
  }

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Bookings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {bookings.length} bookings · ${totalRevenue.toLocaleString()} revenue
        </p>
      </div>

      {/* Status filter buttons - horizontal scroll on mobile */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-3 min-w-max sm:min-w-0">
          {["all", "pending", "confirmed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-sm font-medium px-4 py-1.5 rounded-full capitalize transition whitespace-nowrap ${
                statusFilter === status
                  ? "bg-[#0f172a] text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile card view */}
      <div className="block lg:hidden space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-base">
                  {booking.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {booking.event?.title}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                  booking.status === "confirmed"
                    ? "bg-green-50 text-green-700"
                    : booking.status === "cancelled"
                      ? "bg-red-50 text-red-600"
                      : "bg-amber-50 text-amber-700"
                }`}
              >
                {booking.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <span className="text-gray-500">Plan:</span>
                <span className="text-gray-600 font-medium">
                  {booking.plan}
                </span>
              </div>
              <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <span className="text-gray-500">Amount:</span>
                <span className="text-gray-900 font-semibold">
                  ${Number(booking.amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <span className="text-gray-500">Date:</span>
                <span className="text-gray-600">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-500 text-xs">Status:</span>
                <select
                  value={booking.status}
                  onChange={(e) =>
                    handleUpdateStatus(booking.id, e.target.value)
                  }
                  className={`px-2 py-1 rounded-full text-xs font-semibold border-0 focus:ring-1 focus:ring-gray-300 ${
                    booking.status === "confirmed"
                      ? "bg-green-50 text-green-700"
                      : booking.status === "cancelled"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-700"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
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
                Name
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Event
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Plan
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Amount
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Date
              </th>
            
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition"
              >
                <td className="px-5 py-3 font-medium text-gray-900">
                  {booking.name}
                </td>
                <td className="px-5 py-3 text-gray-600">
                  {booking.event?.title}
                </td>
                <td className="px-5 py-3 text-gray-600">{booking.plan}</td>
                <td className="px-5 py-3 font-medium text-gray-900">
                  ${Number(booking.amount).toLocaleString()}
                </td>
                <td className="px-5 py-3">
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      handleUpdateStatus(booking.id, e.target.value)
                    }
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold border-0 focus:ring-1 focus:ring-gray-300 ${
                      booking.status === "confirmed"
                        ? "bg-green-50 text-green-700"
                        : booking.status === "cancelled"
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-5 py-3 text-gray-500">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          No bookings found
        </div>
      )}
    </div>
  );
}
