"use client";
import { useState } from "react";
import Image from "next/image";

const tabs = [
  "All Memories",
  "Summits",
  "Mixers",
  "Cooperate",
  "WorkShop",
  "Seminars",
];

const allImages = [
  { id: 1, src: "/gallery-1.png", alt: "Memory 1", category: "Summits" },
  { id: 2, src: "/gallery-2.png", alt: "Memory 2", category: "Mixers" },
  { id: 3, src: "/gallery-3.png", alt: "Memory 3", category: "Summits" },
  { id: 4, src: "/gallery-4.png", alt: "Memory 4", category: "Cooperate" },
  { id: 5, src: "/gallery-5.png", alt: "Memory 5", category: "Mixers" },
  { id: 6, src: "/gallery-6.png", alt: "Memory 6", category: "Seminars" },
  { id: 7, src: "/gallery-7.png", alt: "Memory 7", category: "WorkShop" },
  { id: 8, src: "/gallery-8.png", alt: "Memory 8", category: "Summits" },
  { id: 9, src: "/gallery-9.png", alt: "Memory 9", category: "Mixers" },
  { id: 10, src: "/gallery-10.png", alt: "Memory 10", category: "Cooperate" },
  { id: 11, src: "/gallery-1.png", alt: "Memory 11", category: "Seminars" },
  { id: 12, src: "/gallery-2.png", alt: "Memory 12", category: "Summits" },
];

export default function GalleryGrid() {
  const [activeTab, setActiveTab] = useState("All Memories");

  const filtered =
    activeTab === "All Memories"
      ? allImages
      : allImages.filter((img) => img.category === activeTab);

  // Split into 3 columns for masonry effect
  const col1 = filtered.filter((_, i) => i % 3 === 0);
  const col2 = filtered.filter((_, i) => i % 3 === 1);
  const col3 = filtered.filter((_, i) => i % 3 === 2);

  const ImageCard = ({ item }: { item: (typeof allImages)[0] }) => (
    <div className="relative w-full overflow-hidden rounded-lg mb-2 group cursor-pointer">
      <Image
        src={item.src}
        alt={item.alt}
        width={400}
        height={300}
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );

  return (
    <section className="py-10 px-6 sm:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Filter tabs — white pill strip, gold active, no separators */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-all ${
                activeTab === tab
                  ? "bg-[var(--color-primary)] text-black"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Masonry grid — 3 columns, images stack naturally by height */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-16">
            No images in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="flex flex-col">
              {col1.map((item) => (
                <ImageCard key={item.id} item={item} />
              ))}
            </div>
            <div className="flex flex-col">
              {col2.map((item) => (
                <ImageCard key={item.id} item={item} />
              ))}
            </div>
            <div className="hidden sm:flex flex-col">
              {col3.map((item) => (
                <ImageCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
