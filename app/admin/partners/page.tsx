"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Partner {
  id: string;
  name: string;
  company: string;
  email: string;
  goal: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  message?: string;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await api.partners.list();
        setPartners(data as Partner[]);
      } catch (error) {
        console.error("Failed to fetch partners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdating(id);
    try {
      await api.partners.updateStatus(id, status);
      setPartners((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p)),
      );
    } catch (error) {
      console.error("Failed to update partner status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filtered =
    filter === "all" ? partners : partners.filter((p) => p.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
      </div>
    );
  }

  return (
<div className="flex flex-col gap-6 px-4 sm:px-0 pt-20 sm:pt-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Partner requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          {partners.filter((p) => p.status === "pending").length} pending review
        </p>
      </div>

      {/* Filter tabs - horizontal scroll on mobile if needed */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex flex-wrap gap-2 min-w-max sm:min-w-0">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm font-medium px-4 py-1.5 rounded-full capitalize transition whitespace-nowrap ${
                filter === f
                  ? "bg-[#0f172a] text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {p.name}
                  </p>
                  <span className="text-gray-400 text-xs hidden sm:inline">
                    ·
                  </span>
                  <p className="text-sm text-gray-600 break-words">{p.company}</p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      p.status === "approved"
                        ? "bg-green-50 text-green-700"
                        : p.status === "rejected"
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3 break-all">
                  {p.email} · {formatDate(p.createdAt)}
                </p>
                <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg px-4 py-3 break-words">
                  {p.goal}
                </div>
                {p.message && p.status === "rejected" && (
                  <p className="text-xs text-red-500 mt-2 break-words">Note: {p.message}</p>
                )}
              </div>

              {p.status === "pending" && (
                <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateStatus(p.id, "approved")}
                    disabled={updating === p.id}
                    className="bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition flex-1 sm:flex-none disabled:opacity-50"
                  >
                    {updating === p.id ? "Updating..." : "Approve"}
                  </button>
                  <button
                    onClick={() => updateStatus(p.id, "rejected")}
                    disabled={updating === p.id}
                    className="border border-red-300 text-red-600 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition flex-1 sm:flex-none disabled:opacity-50"
                  >
                    {updating === p.id ? "Updating..." : "Reject"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-12 text-center text-gray-400 text-sm">
            No partner requests in this category
          </div>
        )}
      </div>
    </div>
  );
}