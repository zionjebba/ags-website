"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Event } from "@/lib/api";

type Form = {
  name: string;
  phone: string;
  email: string;
  company: string;
  role: string;
};

type PaymentMethod = "card" | "bank" | "mobile";

export default function BookingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const userType = params.userType as "startup" | "investor" | "partner";

  const [event, setEvent] = useState<Event | null>(null);
  const [eventLoading, setEventLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const fetchedEvent = await api.events.get(slug);
        setEvent(fetchedEvent);
      } catch (error) {
        console.error("Failed to load event:", error);
      } finally {
        setEventLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("card");
  const [form, setForm] = useState<Form>({
    name: "",
    phone: "",
    email: "",
    company: "",
    role: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Form & { plan: string; agree: string; paymentMethod: string }>
  >({});
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!selectedPlan) e.plan = "Please select a plan";
    if (!selectedPaymentMethod) e.paymentMethod = "Please select a payment method";
    if (!form.name.trim()) e.name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    else if (!/^\+?[0-9\s\-]{7,20}$/.test(form.phone.trim()))
      e.phone = "Enter a valid phone number";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Enter a valid email address";
    if (!form.company.trim()) e.company = "Required";
    if (!form.role.trim()) e.role = "Required";
    if (!agreed) e.agree = "You must agree to the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = () => {
    setSubmissionError("");
    if (validate()) setShowSummary(true);
  };

  const handleBooking = async () => {
    if (!event) {
      setSubmissionError("Event not found");
      return;
    }

    // Use the event's ticket plans instead of hardcoded plans
    const selected = event.ticketPlans?.find((plan) => plan.name === selectedPlan);
    if (!selected) {
      setSubmissionError("Please choose a booking plan before continuing.");
      return;
    }

    setLoading(true);
    setSubmissionError("");

    try {
      const response = await api.bookings.initialize({
        eventId: event.id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        userType: userType,
        plan: selected.name,
        amount: selected.price, // Use the price from the event's ticket plan
      });

      if (response.authorizationUrl) {
        window.location.href = response.authorizationUrl;
        return;
      }
    } catch (error) {
      setSubmissionError(
        error instanceof Error ? error.message : "Unable to process booking.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (eventLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Event not found
          </h1>
          <p className="text-gray-600">
            The event you are looking for does not exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-10">
        {/* Step indicator */}
        <p className="text-center text-sm font-semibold text-gray-600 mb-4">
          Kindly Follow The Steps To Complete Your Registration
        </p>
        <div className="flex items-center justify-center gap-3 mb-10">
          {["Fill Form", "Select Payment", "Pay"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm bg-[var(--color-primary)] text-black">
                {i + 1}
              </div>
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            {/* Booking event card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-600 mb-3 text-center">
                You are booking the event below
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={
                      event.heroImagePath ||
                      event.aboutImagePath ||
                      "/events-festival.png"
                    }
                    alt="Event"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">
                  {event.title}
                </h3>
              </div>
            </div>

            {/* Event details */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-gray-700 mb-4">
                Event Details
              </h4>
              <div className="grid grid-cols-2 gap-y-3 text-xs">
                <div>
                  <p className="text-gray-400 font-medium">Name:</p>
                  <p className="text-[var(--color-pink-accent)] font-semibold">
                    {event.title}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Venue:</p>
                  <p className="text-[var(--color-pink-accent)] font-semibold">
                    {event.venue}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Date:</p>
                  <p className="text-[var(--color-pink-accent)] font-semibold">
                    {event.date}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Phone:</p>
                  <p className="text-[var(--color-pink-accent)] font-semibold">
                    {event.phone}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Location:</p>
                  <p className="text-[var(--color-pink-accent)] font-semibold">
                    {event.location}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Email:</p>
                  <p className="text-[var(--color-pink-accent)] font-semibold">
                    {event.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing plans - NOW DYNAMIC */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-gray-700 mb-4">Pricing</h4>
              {errors.plan && (
                <p className="text-red-500 text-xs mb-2">{errors.plan}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {event.ticketPlans?.map((plan) => (
                  <div
                    key={plan.name}
                    onClick={() => setSelectedPlan(plan.name)}
                    className={`flex flex-col rounded-xl border-2 p-3 transition cursor-pointer ${selectedPlan === plan.name ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10" : "border-gray-200"}`}
                  >
                    <p className="text-xs font-bold text-gray-700 mb-1">
                      {plan.name}
                    </p>
                    <p className="text-lg font-extrabold text-[var(--color-pink-accent)] mb-2">
                      ₵{plan.price.toLocaleString()}
                    </p>
                    {/* Note: Perks are not stored in the event, so they're removed */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(plan.name);
                      }}
                      className="mt-auto bg-[var(--color-primary)] text-black text-[10px] font-bold py-1.5 rounded-full hover:bg-[var(--color-primary-dark)] transition"
                    >
                      Select plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - same as before */}
          <div className="flex flex-col gap-6">
            {/* Personal details */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-gray-700 mb-4">
                Personal Details
              </h4>
              <div className="flex flex-col gap-3">
                {(["name", "phone", "email", "company", "role"] as const).map(
                  (field) => (
                    <div key={field}>
                      <label className="text-xs text-gray-500 font-medium capitalize mb-1 block">
                        {field}:
                      </label>
                      <input
                        name={field}
                        type={
                          field === "email"
                            ? "email"
                            : field === "phone"
                              ? "tel"
                              : "text"
                        }
                        value={form[field]}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors[field])}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                      />
                      {errors[field] && (
                        <p className="text-red-500 text-[10px] mt-0.5">
                          {errors[field]}
                        </p>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-gray-700 mb-1">
                Payment Method
              </h4>
              <p className="text-xs text-[var(--color-pink-accent)] font-semibold mb-3">
                Select how you want to pay
              </p>

              <div className="flex gap-3 mb-4">
                {[
                  { id: "card", label: "💳 Card", icon: "💳" },
                  { id: "bank", label: "🏦 Bank Transfer", icon: "🏦" },
                  { id: "mobile", label: "📱 Mobile Money", icon: "📱" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id as PaymentMethod)}
                    className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition ${
                      selectedPaymentMethod === method.id
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <span className="text-[11px] font-medium text-gray-700">
                      {method.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800">
                  🔒 You will be redirected to Paystack's secure payment page to complete your transaction. We never store your card details.
                </p>
              </div>

              {errors.paymentMethod && (
                <p className="text-red-500 text-[10px] mb-3">{errors.paymentMethod}</p>
              )}

              <div className="flex items-start gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-[var(--color-primary)]"
                />
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  By checking this box I agree to make payment for this event
                  through ADSIF. I acknowledge that there will be no refund in
                  cases where I&apos;m not able to attend.
                </p>
              </div>
              {errors.agree && (
                <p className="text-red-500 text-[10px] mt-1">{errors.agree}</p>
              )}

              <button
                onClick={handleConfirm}
                className="mt-5 w-full bg-[var(--color-primary)] text-black font-extrabold py-3 rounded-full hover:bg-[var(--color-primary-dark)] transition"
              >
                Continue to Summary
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <h2 className="text-center text-lg font-extrabold text-gray-900 mb-4">
              Booking Summary
            </h2>

            <div className="flex items-center gap-3 mb-5 bg-gray-50 rounded-xl p-3">
              <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={
                    event.heroImagePath ||
                    event.aboutImagePath ||
                    "/events-festival.png"
                  }
                  alt="Event"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{event.title}</p>
                <p className="text-xs text-[var(--color-pink-accent)] font-semibold">
                  {event.venue}
                </p>
                <p className="text-xs text-[var(--color-pink-accent)]">
                  {event.date}
                </p>
              </div>
            </div>

            {submissionError && (
              <p className="text-red-500 text-sm text-center mb-4">
                {submissionError}
              </p>
            )}
            <div className="flex flex-col gap-2 text-sm text-gray-700 mb-6">
              <p>
                <span className="font-semibold">Name:</span> {form.name}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {form.phone}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {form.email}
              </p>
              <p>
                <span className="font-semibold">1 ticket for</span>{" "}
                {event.title}
              </p>
              <p>
                <span className="font-semibold">Plan:</span> {selectedPlan}
              </p>
              <p>
                <span className="font-semibold">Payment Method:</span>{" "}
                {selectedPaymentMethod === "card" && "💳 Card"}
                {selectedPaymentMethod === "bank" && "🏦 Bank Transfer"}
                {selectedPaymentMethod === "mobile" && "📱 Mobile Money"}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleBooking}
                disabled={loading}
                className="w-full bg-[var(--color-primary)] text-black font-extrabold py-3 rounded-full hover:bg-[var(--color-primary-dark)] transition disabled:opacity-60"
              >
                {loading ? "Processing..." : "Proceed to Paystack"}
              </button>
              <button
                onClick={() => setShowSummary(false)}
                className="text-xs text-gray-400 text-center hover:text-gray-600"
              >
                Go back and edit
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}