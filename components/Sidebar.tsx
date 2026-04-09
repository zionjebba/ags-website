"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "▦" },
  { label: "Events", href: "/admin/events", icon: "◈" },
  { label: "Bookings", href: "/admin/bookings", icon: "◉" },
  { label: "Blog", href: "/admin/blogs", icon: "◧" },
  { label: "Partners", href: "/admin/partners", icon: "◎" },
  { label: "Newsletter", href: "/admin/newsletter", icon: "◫" },
  { label: "Subscribers", href: "/admin/subscribers", icon: "◑" },
];

export default function AdminSidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Mobile menu button - only show on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0f172a] px-4 py-3 flex items-center gap-3">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white p-1 rounded-lg cursor-pointer text-xl"
        >
          ☰
        </button>
        <p className="text-white font-bold text-sm tracking-wide">AD-SIF</p>
      </div>
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out w-64 bg-[#0f172a] flex flex-col ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Close button - only show when menu is open on mobile */}
        {isMenuOpen && (
          <button
            onClick={closeMenu}
            className="lg:hidden absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer text-xl z-50"
          >
            ✕
          </button>
        )}

        {/* Logo area */}
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-white font-bold text-sm tracking-wide">AD-SIF</p>
          <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition text-sm font-medium"
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-white/40 text-xs">Logged in as Admin</p>
          <Link
            href="/"
            className="text-white/60 hover:text-white text-xs mt-1 block transition"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
}