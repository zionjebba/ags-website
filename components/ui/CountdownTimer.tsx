"use client";
import { useEffect, useState } from "react";

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Don't run on server
    if (typeof window === 'undefined') return;

    const updateTime = () => {
      setTime(getTimeLeft(new Date(targetDate)));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="rounded-2xl px-8 pt-3 pb-4 mx-auto w-fit">
      <p className="text-center text-md font-semibold text-white mb-1 tracking-wide">
        Cleva Summit Coming Soon:
      </p>

      <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
        {units.map(({ label, value }) => (
          <div
            key={label}
            className="text-black text-center min-w-[56px] sm:min-w-[68px] px-1 sm:px-3 py-1"
          >
            <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              {String(value).padStart(2, "0")}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider mt-0.5">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}