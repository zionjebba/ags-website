"use client";
import Link from "next/link";
import Button from "../ui/Button";
import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const links = ["Home", "About", "Events", "Gallery", "Blogs"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Hide navbar on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Pages for the minimal navbar
  const minimalPages = ["/register", "/login", "/event-registration"];
  const isMinimal = minimalPages.includes(pathname);

  if (isMinimal) {
    // Minimal Navbar: just back button + logo
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-sm px-6 py-3 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="text-black font-bold px-3 py-2 rounded-full hover:bg-gray-100 transition"
        >
          ← Back
        </button>
        <Image
          src="/logo.png"
          alt="AGS Logo"
          width={182}
          height={182}
          loading="eager"
          style={{ width: "auto", height: "auto" }}
          className="rounded-full max-h-12 sm:max-h-16 w-auto"
        />
      </nav>
    );
  }

  // Full Navbar for all other pages
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="AGS Logo"
            width={182}
            height={182}
            loading="eager"
            style={{ width: "auto", height: "auto" }}
            className="rounded-full"
          />
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-6 text-xl font-bold text-black">
          {links.map((link) => {
            const href = link === "Home" ? "/" : `/${link.toLowerCase()}`;
            const isActive = pathname === href;
            return (
              <li key={link}>
                <Link
                  href={href}
                  className={`transition ${isActive ? "text-[var(--color-primary)]" : "hover:text-[var(--color-primary)]"}`}
                >
                  {link}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="hidden md:block">
          <Button variant="primary">
            <Link href="/events">Register</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          <span className="text-2xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-white">
          {links.map((link) => {
            const href = link === "Home" ? "/" : `/${link.toLowerCase()}`;
            const isActive = pathname === href;
            return (
              <Link
                key={link}
                href={href}
                className={`text-sm transition ${isActive ? "text-[var(--color-primary)]" : "text-gray-700 hover:text-[var(--color-primary)]"}`}
              >
                {link}
              </Link>
            );
          })}
          <Link href="/events" className="w-full">
          <Button variant="pink" className="w-full">
            Register Now
          </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
