"use client";
import { useState } from "react";
import { api } from "@/lib/api";

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  goal: string;
};

type Errors = Partial<FormState>;

export default function PartnerForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    company: "",
    email: "",
    phone: "",
    goal: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.company.trim()) e.company = "Company is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";

    // ADD PHONE VALIDATION
    if (!form.phone.trim()) e.phone = "Phone number is required";

    // ADD GOAL MINIMUM LENGTH VALIDATION
    if (!form.goal.trim()) e.goal = "Please describe your partnership goal";
    else if (form.goal.trim().length < 10)
      e.goal = "Please provide at least 10 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.partners.apply(form);
      setSubmitted(true);
      setForm({ name: "", company: "", email: "", phone: "", goal: "" });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-6 sm:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Pill heading — matches home page WelcomeCard style */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-full px-8 py-2 shadow-inner">
            <span className="text-sm font-bold text-gray-700 tracking-wide">
              Want to partner?
            </span>
          </div>
        </div>

        {submitted ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <p className="text-2xl font-bold text-[var(--color-primary)] mb-2">
              Thank you!
            </p>
            <p className="text-gray-600">We&apos;ll be in touch soon.</p>
          </div>
        ) : (
          <div className="bg-[var(--color-primary)] rounded-2xl px-8 py-10 max-w-2xl mx-auto shadow-lg">
            <p className="text-center text-sm font-semibold text-black mb-6">
              Kindly fill the form below if you want to partner for an event
            </p>

            <div className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name :"
                  className="w-full rounded-lg px-4 py-3 text-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20"
                />
                {errors.name && (
                  <p className="text-red-700 text-xs mt-1 font-semibold">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Company */}
              <div>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company/Organization :"
                  className="w-full rounded-lg px-4 py-3 text-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20"
                />
                {errors.company && (
                  <p className="text-red-700 text-xs mt-1 font-semibold">
                    {errors.company}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email :"
                  className="w-full rounded-lg px-4 py-3 text-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20"
                />
                {errors.email && (
                  <p className="text-red-700 text-xs mt-1 font-semibold">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PHONE FIELD - ADD THIS */}
              <div>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number :"
                  className="w-full rounded-lg px-4 py-3 text-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20"
                />
                {errors.phone && (
                  <p className="text-red-700 text-xs mt-1 font-semibold">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Goal */}
              <div>
                <textarea
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  placeholder="Describe Your Intended Partnership Goal (minimum 10 characters) :"
                  rows={4}
                  className="w-full rounded-lg px-4 py-3 text-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
                />
                {errors.goal && (
                  <p className="text-red-700 text-xs mt-1 font-semibold">
                    {errors.goal}
                  </p>
                )}
                {/* Optional: Show character count */}
                <p className="text-gray-500 text-xs mt-1">
                  {form.goal.length}/10 characters minimum
                </p>
              </div>

              <div className="flex justify-center mt-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-white text-black font-bold text-sm px-10 py-3 rounded-lg hover:bg-gray-100 transition shadow disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
