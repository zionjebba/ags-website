"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface SubscriberCounts {
  all: number;
  startup: number;
  investor: number;
  partner: number;
}

export default function AdminNewsletterPage() {
  const [segment, setSegment] = useState("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<SubscriberCounts>({
    all: 0,
    startup: 0,
    investor: 0,
    partner: 0,
  });

  const segments = [
    { label: "All subscribers", value: "all", count: counts.all },
    { label: "Startups only", value: "startup", count: counts.startup },
    { label: "Investors only", value: "investor", count: counts.investor },
    { label: "Partners only", value: "partner", count: counts.partner },
  ];

  const selectedSegment = segments.find((s) => s.value === segment);

  // Fetch subscriber counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await api.subscribers.getCounts();
        setCounts(data as SubscriberCounts);
      } catch (error) {
        console.error("Failed to fetch subscriber counts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setError("Subject and body are required.");
      return;
    }
    setSending(true);
    setError("");

    try {
      await api.newsletter.send(subject.trim(), body.trim(), segment);
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send newsletter.",
      );
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
        <p className="text-gray-500">Loading subscriber data...</p>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center px-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
          ✓
        </div>
        <h2 className="text-lg font-bold text-gray-900">Newsletter sent</h2>
        <p className="text-sm text-gray-500">
          Sent to {selectedSegment?.count.toLocaleString()} subscribers
        </p>
        <button
          onClick={() => {
            setSent(false);
            setSubject("");
            setBody("");
          }}
          className="border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-50 transition mt-2"
        >
          Write another
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto px-4 sm:px-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Send newsletter</h1>
        <p className="text-sm text-gray-500 mt-1">
          Compose and send to your subscriber list
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 flex flex-col gap-5">
        {/* Segment picker */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">
            Send to
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {segments.map((s) => (
              <button
                key={s.value}
                onClick={() => setSegment(s.value)}
                className={`text-left border rounded-lg px-4 py-3 transition ${
                  segment === s.value
                    ? "border-[#0f172a] bg-[#0f172a]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">{s.label}</p>
                <p className="text-xs text-gray-400">
                  {s.count.toLocaleString()} subscribers
                </p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Subject line
          </label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
            placeholder="Upcoming events — April 2026"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Email body
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={14}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none font-mono"
            placeholder="Write your newsletter content here... Use HTML for formatting: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, etc."
          />
          <p className="text-xs text-gray-400 mt-1">
            Tip: You can use HTML tags for formatting
          </p>
        </div>

        {/* Preview note */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-700">
          This will send to {selectedSegment?.count.toLocaleString()}{" "}
          subscribers. This action cannot be undone.
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            onClick={() => {
              setSubject("");
              setBody("");
            }}
            className="border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto order-2 sm:order-1"
          >
            Clear
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-[#0f172a] text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-[#1e293b] transition disabled:opacity-50 w-full sm:w-auto order-1 sm:order-2"
          >
            {sending
              ? "Sending..."
              : `Send to ${selectedSegment?.count.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
}