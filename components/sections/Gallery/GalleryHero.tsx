"use client";
import { useState } from "react";
import Image from "next/image";

const slides = [
  { id: 1, image: "/gallery-1.png", alt: "Event memory 1" },
  { id: 2, image: "/gallery-2.png", alt: "Event memory 2" },
  { id: 3, image: "/gallery-3.png", alt: "Event memory 3" },
  { id: 4, image: "/gallery-4.png", alt: "Event memory 4" },
  { id: 5, image: "/gallery-5.png", alt: "Event memory 5" },
];

export default function GalleryHero() {
  const [current, setCurrent] = useState(1); // start on second so we have left/center/right

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const getSlide = (offset: number) =>
    slides[(current + offset + slides.length) % slides.length];

  return (
    <section className="relative bg-black py-10 px-6 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-lg font-bold mb-8">
          Explore Event Memories
        </h2>

        {/* Carousel */}
        <div className="relative flex items-center justify-center gap-4">
          {/* Prev arrow */}
          <button
            onClick={prev}
            className="absolute left-0 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition"
            aria-label="Previous"
          >
            ←
          </button>

          {/* Left card — smaller */}
          <div className="hidden sm:block relative w-44 h-56 rounded-2xl overflow-hidden flex-shrink-0 opacity-70 scale-95 transition-all duration-500 ease-in-out">
            <Image
              src={getSlide(-1).image}
              alt={getSlide(-1).alt}
              fill
              className="object-cover"
            />
          </div>

          {/* Center card — large, prominent */}
          <div className="relative w-64 sm:w-80 h-80 sm:h-96 rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl z-10 border-2 border-white/20 transition-all duration-500 ease-in-out">
            <Image
              src={getSlide(0).image}
              alt={getSlide(0).alt}
              fill
              className="object-cover"
            />
          </div>

          {/* Right card — smaller */}
          <div className="hidden sm:block relative w-44 h-56 rounded-2xl overflow-hidden flex-shrink-0 opacity-70 scale-95 transition-all duration-500 ease-in-out">
            <Image
              src={getSlide(1).image}
              alt={getSlide(1).alt}
              fill
              className="object-cover"
            />
          </div>

          {/* Next arrow */}
          <button
            onClick={next}
            className="absolute right-0 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition"
            aria-label="Next"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
