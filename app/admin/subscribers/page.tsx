// app/admin/subscribers/page.tsx
"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  userType?: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const data = await api.subscribers.list();
        setSubscribers(data as Subscriber[]);
        setFilteredSubscribers(data as Subscriber[]);
      } catch (error) {
        console.error("Failed to fetch subscribers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  // Apply filters whenever search term or user type filter changes
  useEffect(() => {
    let filtered = [...subscribers];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply user type filter
    if (userTypeFilter !== "all") {
      filtered = filtered.filter(sub => sub.userType === userTypeFilter);
    }
    
    setFilteredSubscribers(filtered);
  }, [searchTerm, userTypeFilter, subscribers]);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete subscriber: ${email}?`)) return;
    
    setDeleting(id);
    try {
      await api.subscribers.delete(id);
      setSubscribers(prev => prev.filter(sub => sub.id !== id));
    } catch (error) {
      console.error("Failed to delete subscriber:", error);
      alert("Failed to delete subscriber");
    } finally {
      setDeleting(null);
    }
  };

  const exportToCSV = () => {
    const headers = ["Email", "User Type", "Subscribed At"];
    const rows = filteredSubscribers.map(sub => [
      sub.email,
      sub.userType || "all",
      new Date(sub.subscribedAt).toLocaleString()
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getUserTypeCount = (type: string) => {
    if (type === "all") return subscribers.length;
    return subscribers.filter(sub => sub.userType === type).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
      </div>
    );
  }

  return (
<div className="p-4 sm:p-6 pt-20 sm:pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredSubscribers.length} of {subscribers.length} subscribers
          </p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={filteredSubscribers.length === 0}
          className="bg-[#0f172a] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1e293b] transition disabled:opacity-50"
        >
          📥 Export to CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">All</p>
          <p className="text-2xl font-bold text-gray-900">{getUserTypeCount("all")}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Startups</p>
          <p className="text-2xl font-bold text-blue-600">{getUserTypeCount("startup")}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Investors</p>
          <p className="text-2xl font-bold text-green-600">{getUserTypeCount("investor")}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Partners</p>
          <p className="text-2xl font-bold text-purple-600">{getUserTypeCount("partner")}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:border-gray-400"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* User Type Filter */}
        <select
          value={userTypeFilter}
          onChange={(e) => setUserTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-400"
        >
          <option value="all">All Types</option>
          <option value="startup">Startups</option>
          <option value="investor">Investors</option>
          <option value="partner">Partners</option>
        </select>

        {/* Clear Filters Button */}
        {(searchTerm || userTypeFilter !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setUserTypeFilter("all");
            }}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Subscribers Table */}
      <div>
  {filteredSubscribers.length === 0 ? (
    <div className="bg-white rounded-xl border border-gray-200 text-center py-12 text-gray-500">
      No subscribers found
    </div>
  ) : (
    <>
      {/* Mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {filteredSubscribers.map((sub) => {
          const userTypeColors = {
            startup: "bg-blue-50 text-blue-700",
            investor: "bg-green-50 text-green-700",
            partner: "bg-purple-50 text-purple-700",
            all: "bg-gray-50 text-gray-700",
          };
          const userTypeLabel = {
            startup: "🚀 Startup",
            investor: "💰 Investor",
            partner: "🤝 Partner",
            all: "📧 All Updates",
          };
          const userTypeColor = userTypeColors[sub.userType as keyof typeof userTypeColors] || userTypeColors.all;
          const userTypeLabelText = userTypeLabel[sub.userType as keyof typeof userTypeLabel] || userTypeLabel.all;

          return (
            <div key={sub.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between items-start gap-2 mb-2">
                <p className="text-sm text-gray-900 break-all">{sub.email}</p>
                <button
                  onClick={() => handleDelete(sub.id, sub.email)}
                  disabled={deleting === sub.id}
                  className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50 flex-shrink-0"
                >
                  {deleting === sub.id ? "Deleting..." : "Delete"}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${userTypeColor}`}>
                  {userTypeLabelText}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(sub.subscribedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed At</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSubscribers.map((sub) => {
              const userTypeColors = {
                startup: "bg-blue-50 text-blue-700",
                investor: "bg-green-50 text-green-700",
                partner: "bg-purple-50 text-purple-700",
                all: "bg-gray-50 text-gray-700",
              };
              const userTypeLabel = {
                startup: "🚀 Startup",
                investor: "💰 Investor",
                partner: "🤝 Partner",
                all: "📧 All Updates",
              };
              const userTypeColor = userTypeColors[sub.userType as keyof typeof userTypeColors] || userTypeColors.all;
              const userTypeLabelText = userTypeLabel[sub.userType as keyof typeof userTypeLabel] || userTypeLabel.all;

              return (
                <tr key={sub.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">{sub.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${userTypeColor}`}>
                      {userTypeLabelText}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(sub.subscribedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => handleDelete(sub.id, sub.email)}
                      disabled={deleting === sub.id}
                      className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                    >
                      {deleting === sub.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  )}
</div>

      {/* Footer Stats */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredSubscribers.length} of {subscribers.length} subscribers
      </div>
    </div>
  );
}