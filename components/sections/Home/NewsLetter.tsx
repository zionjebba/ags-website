"use client";
import { useState } from "react";
import Image from "next/image";
import Button from "../../ui/Button";
import { api } from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("all");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const validate = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubscribe = async () => {
    if (!validate(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      await api.subscribers.subscribe(email, userType);
      setStatus("success");
      setEmail("");
      setUserType("all");
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : "Something went wrong.",
      );
      setStatus("error");
    }
  };

  return (
<section className="bg-[var(--color-dark)] py-16 px-6 sm:px-4 text-white text-center">
      <h2 className="text-3xl font-bold mb-2">Contact Us</h2>
      <p className="text-base text-gray-400 mb-8">Sign up for our Newsletter</p>

      {status === "success" ? (
        <p className="text-green-400 font-semibold text-base">
          You&apos;re subscribed! Check your inbox.
        </p>
      ) : (
        <>
          <div className="max-w-md mx-auto flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg("");
                setStatus("idle");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded bg-[var(--color-dark-card)] border border-gray-700 text-white text-base placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)]"
            />
            
            {/* User Type Selector - matches the design */}
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-4 py-3 rounded bg-[var(--color-dark-card)] border border-gray-700 text-white text-base focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="all">I am interested in (All updates)</option>
              <option value="startup">I am a Startup Founder</option>
              <option value="investor">I am an Investor</option>
              <option value="partner">I am a Partner/Sponsor</option>
            </select>
            
            <Button
              variant="primary"
              onClick={handleSubscribe}
              disabled={status === "loading"}
              className="w-full"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>

          {errorMsg && <p className="mt-2 text-red-400 text-sm">{errorMsg}</p>}
        </>
      )}

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
        <Image alt="phone icon" src="/phone-icon.png" width={20} height={20} />
        <span>+49 000 000 0000</span>
      </div>
    </section>
  );
}