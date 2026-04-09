"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

interface TicketPlan {
  name: string;
  price: number;
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [eventId, setEventId] = useState("");
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [aboutFile, setAboutFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [aboutPreview, setAboutPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    venue: "",
    email: "",
    phone: "",
    heroImagePath: "",
    aboutImagePath: "",
    ticketPlans: [] as TicketPlan[],
    status: "draft" as "draft" | "active" | "ended",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await api.events.get(slug);
        setEventId(event.id);
        setForm({
          title: event.title,
          description: event.description,
          date: event.date.split("T")[0],
          time: event.time,
          location: event.location,
          venue: event.venue || "",
          email: event.email || "",
          phone: event.phone || "",
          heroImagePath: event.heroImagePath || "",
          aboutImagePath: event.aboutImagePath || "",
          ticketPlans: event.ticketPlans || [],
          status: event.status,
        });
        setHeroPreview(event.heroImagePath ? `${process.env.NEXT_PUBLIC_API_URL}${event.heroImagePath}` : null);
        setAboutPreview(event.aboutImagePath ? `${process.env.NEXT_PUBLIC_API_URL}${event.aboutImagePath}` : null);
      } catch (error) {
        console.error("Failed to fetch event:", error);
        setNotFound(true);
      } finally {
        setFetching(false);
      }
    };
    fetchEvent();
  }, [slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handlePlanChange = (index: number, field: "name" | "price", value: string | number) => {
    const newPlans = [...form.ticketPlans];
    newPlans[index] = { ...newPlans[index], [field]: value };
    setForm({ ...form, ticketPlans: newPlans });
  };

  const addPlan = () => {
    setForm({
      ...form,
      ticketPlans: [...form.ticketPlans, { name: `Plan ${form.ticketPlans.length + 1}`, price: 0 }],
    });
  };

  const removePlan = (index: number) => {
    const newPlans = form.ticketPlans.filter((_, i) => i !== index);
    setForm({ ...form, ticketPlans: newPlans });
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHeroFile(file);
      setHeroPreview(URL.createObjectURL(file));
    }
  };

  const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAboutFile(file);
      setAboutPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof typeof form, string>> = {};
    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.description.trim()) nextErrors.description = "Description is required";
    if (!form.date.trim()) nextErrors.date = "Date is required";
    if (!form.time.trim()) nextErrors.time = "Time is required";
    if (!form.location.trim()) nextErrors.location = "Location is required";
    if (!form.venue.trim()) nextErrors.venue = "Venue is required";
    if (form.ticketPlans.length === 0) {
      nextErrors.ticketPlans = "At least one ticket plan is required";
    } else if (form.ticketPlans.some(plan => plan.price <= 0)) {
      nextErrors.ticketPlans = "All ticket plans must have a price greater than 0";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async (publish?: boolean) => {
  if (!validateForm()) return;
  setLoading(true);
  try {
    const status = publish ? "active" : form.status;
    
    // Use FormData for image uploads
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("date", new Date(form.date).toISOString());
    formData.append("time", form.time);
    formData.append("location", form.location);
    formData.append("venue", form.venue);
    formData.append("email", form.email || "");
    formData.append("phone", form.phone || "");
    // IMPORTANT: Send ticketPlans as JSON string
    formData.append("ticketPlans", JSON.stringify(form.ticketPlans));
    formData.append("status", status);
    
    if (heroFile) {
      formData.append("hero", heroFile);
    }
    if (aboutFile) {
      formData.append("about", aboutFile);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/events/${eventId}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    const result = await response.json();
    console.log("Response:", result);

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to update event");
    }

    router.push("/admin/events");
  } catch (error) {
    console.error("Failed to save event:", error);
    alert("Failed to save event. Please check all fields.");
  } finally {
    setLoading(false);
  }
};

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <p className="text-gray-900 font-semibold">Event not found</p>
        <button
          onClick={() => router.push("/admin/events")}
          className="text-sm text-blue-600 hover:underline"
        >
          Back to events
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit event</h1>
          <p className="text-sm text-gray-500 mt-1">{form.title}</p>
        </div>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            form.status === "active"
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {form.status === "active" ? "Published" : "Draft"}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Basic information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ... existing form fields (title, description, date, time, location, venue, email, phone) ... */}
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

        {/* Hero Image Upload */}
        <div className="border-t border-gray-100 pt-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Hero Image</h2>
          <div className="space-y-3">
            {heroPreview && (
              <div className="relative w-48 h-32 rounded-lg overflow-hidden">
                <img src={heroPreview} alt="Hero preview" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleHeroChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-400">Leave empty to keep current image</p>
          </div>
        </div>

        {/* About Image Upload */}
        <div className="border-t border-gray-100 pt-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">About Section Image</h2>
          <div className="space-y-3">
            {aboutPreview && (
              <div className="relative w-48 h-32 rounded-lg overflow-hidden">
                <img src={aboutPreview} alt="About preview" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAboutChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-400">Leave empty to keep current image</p>
          </div>
        </div>

        {/* Dynamic Ticket Plans */}
        <div className="border-t border-gray-100 pt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Ticket Plans (Amount in Cedis) *</h2>
            <button
              type="button"
              onClick={addPlan}
              className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition"
            >
              + Add Plan
            </button>
          </div>
          
          <div className="space-y-3">
            {form.ticketPlans.map((plan, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={plan.name}
                    onChange={(e) => handlePlanChange(index, "name", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
                    placeholder="e.g., Early Bird, VIP, Standard"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Price (Cedis)</label>
                  <input
                    type="number"
                    value={plan.price}
                    onChange={(e) => handlePlanChange(index, "price", parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
                    placeholder="0"
                  />
                </div>
                {form.ticketPlans.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePlan(index)}
                    className="text-red-500 hover:text-red-700 text-sm mb-1 px-2 py-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.ticketPlans && <p className="text-red-500 text-xs mt-2">{errors.ticketPlans}</p>}
          {form.ticketPlans.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">
              No ticket plans yet. Click "&lt;Add Plan&gt;" to create one.
            </p>
          )}
        </div>

        <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
          <button
            onClick={() => router.push("/admin/events")}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={loading}
              className="border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Save draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={loading}
              className="bg-[#0f172a] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#1e293b] transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Publish event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}