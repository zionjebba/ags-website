"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    venue: "",
    email: "",
    phone: "",
    ticketPlans: [
      { name: "Basic Plan", price: 0 },
      { name: "Premium Plan", price: 0 },
      { name: "Gold Plan", price: 0 },
    ],
    status: "draft" as "draft" | "active" | "ended",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handlePlanChange = (index: number, price: number) => {
    const newPlans = [...form.ticketPlans];
    newPlans[index] = { ...newPlans[index], price };
    setForm({ ...form, ticketPlans: newPlans });
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof typeof form, string>> = {};
    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.description.trim()) nextErrors.description = "Description is required";
    if (!form.date.trim()) nextErrors.date = "Date is required";
    if (!form.time.trim()) nextErrors.time = "Time is required";
    if (!form.location.trim()) nextErrors.location = "Location is required";
    if (!form.venue.trim()) nextErrors.venue = "Venue is required";
    if (form.ticketPlans.some(plan => plan.price <= 0)) {
      nextErrors.ticketPlans = "All ticket plans must have a price greater than 0";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (publish: boolean) => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.events.create({
        title: form.title,
        description: form.description,
        date: new Date(form.date).toISOString(),
        time: form.time,
        location: form.location,
        venue: form.venue,
        email: form.email || undefined,
        phone: form.phone || undefined,
        ticketPlans: form.ticketPlans,
        status: publish ? "active" : "draft",
      });
      router.push("/admin/events");
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New event</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
        {/* Basic info */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Basic information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Event title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Time (GMT) *
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              />
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Location *
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City, Country"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Venue *
              </label>
              <input
                name="venue"
                value={form.venue}
                onChange={handleChange}
                placeholder="Specific venue name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              />
              {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Contact email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Contact phone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t border-gray-100 pt-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Ticket Plans (Amount in Cedis) *
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {form.ticketPlans.map((plan, index) => (
              <div key={plan.name}>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {plan.name}
                </label>
                <input
                  type="number"
                  value={plan.price}
                  onChange={(e) => handlePlanChange(index, parseInt(e.target.value) || 0)}
                  placeholder="Price in Cedis"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
            ))}
          </div>
          {errors.ticketPlans && <p className="text-red-500 text-xs mt-1">{errors.ticketPlans}</p>}
        </div>

        {/* Actions */}
        <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Save draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="bg-[#0f172a] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#1e293b] transition disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}