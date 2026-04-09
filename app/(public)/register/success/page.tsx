"use client";
import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

type Booking = {
  email: string;
  plan: string;
  amount: number;
  paymentRef: string;
  paymentStatus: string;
  status: string;
  event: { title: string };
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const pollCountRef = useRef(0);
  const MAX_POLLS = 10;
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (!reference) {
      setError("No booking reference found");
      setLoading(false);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const poll = async () => {
      if (!isMountedRef.current) return;
      
      try {
        const data = await api.bookings.verify(reference);
        
        if (!isMountedRef.current) return;
        
        if (data.paymentStatus === "completed" || data.status === "confirmed") {
          setBooking(data);
          setLoading(false);
          return;
        }
        
        pollCountRef.current++;
        if (pollCountRef.current < MAX_POLLS) {
          timeoutId = setTimeout(poll, 2000);
        } else {
          setError("Payment still processing. Please check your email for confirmation.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Polling error:", err);
        pollCountRef.current++;
        
        if (pollCountRef.current < MAX_POLLS) {
          timeoutId = setTimeout(poll, 2000);
        } else {
          setError("Could not confirm payment. Please contact support.");
          setLoading(false);
        }
      }
    };

    poll();

    return () => {
      isMountedRef.current = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [reference]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Confirming your booking...</p>
        <p className="text-gray-400 text-sm mt-1">This may take a few seconds</p>
      </div>
    );
  }

  if (error || !booking || (booking.paymentStatus !== "completed" && booking.status !== "confirmed")) {
    return (
      <div className="text-center py-20 max-w-md mx-auto px-6">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-2xl mx-auto mb-6">
          ✕
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment unconfirmed</h1>
        <p className="text-gray-500 mb-2">
          {error || "We could not confirm your payment status."}
        </p>
        {reference && (
          <p className="text-gray-400 text-sm mb-6">Reference: {reference}</p>
        )}
        <p className="text-gray-500 text-sm mb-6">
          If you were charged, please contact us with your reference number and we will resolve it.
        </p>
        <Link href="/events" className="text-[var(--color-primary)] font-semibold hover:underline">
          ← Browse events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl mx-auto mb-6">
        ✓
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking confirmed!</h1>
      <p className="text-gray-500 mb-8">
        A confirmation email has been sent to{" "}
        <span className="font-semibold text-gray-700">{booking.email}</span>
      </p>

      <div className="bg-gray-50 rounded-2xl p-6 text-left text-sm mb-8 flex flex-col gap-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Event</span>
          <span className="font-semibold text-gray-800">{booking.event?.title}</span>
        </div>
        <div className="w-full h-px bg-gray-200" />
        <div className="flex justify-between">
          <span className="text-gray-400">Plan</span>
          <span className="font-semibold text-gray-800">{booking.plan}</span>
        </div>
        <div className="w-full h-px bg-gray-200" />
        <div className="flex justify-between">
          <span className="text-gray-400">Amount</span>
          <span className="font-semibold text-gray-800">
            ₵{Number(booking.amount).toLocaleString()}
          </span>
        </div>
        <div className="w-full h-px bg-gray-200" />
        <div className="flex justify-between">
          <span className="text-gray-400">Reference</span>
          <span className="font-mono text-xs text-gray-600">{booking.paymentRef}</span>
        </div>
      </div>

      <Link href="/events">
        <button className="bg-[var(--color-primary)] text-black font-extrabold px-10 py-3 rounded-full hover:bg-[var(--color-primary-dark)] transition">
          Browse more events
        </button>
      </Link>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}