"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = ["Home", "About", "Events", "Gallery", "Impac..."];
const legalLinks = ["Privacy Policy", "Terms and Conditions"];
const socials = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "X", href: "#" },
];

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[var(--color-dark)] text-white pt-10 pb-6">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo + description */}
        <div>
          <Image
            src="/logo.png"
            alt="AGS Logo"
            width={182}
            height={182}
            style={{ width: "auto", height: "auto" }}
            className="max-w-[120px] sm:max-w-[182px]"
          />
        </div>

        {/* Nav Links */}
        <div className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link}
              href="#"
              className="text-sm text-gray-300 hover:text-[var(--color-primary)] transition"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Legal + Socials */}
        <div className="flex flex-col gap-2">
          {legalLinks.map((link) => (
            <Link
              key={link}
              href="#"
              className="text-sm text-gray-300 hover:text-[var(--color-primary)] transition"
            >
              {link}
            </Link>
          ))}
          <div className="flex gap-4 mt-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-sm text-gray-400 hover:text-[var(--color-primary)] transition"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 border-t border-gray-700 pt-4 text-xs text-gray-500 text-center">
        © Africa Diaspora Startup Development Forum 2024
      </div>
    </footer>
  );
}
