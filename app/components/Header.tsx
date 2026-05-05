"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import profileData from "@/data/profile.json";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="header">
      <div className="container header__inner">
        <Link href="/" className="header__logo">
          {profileData.name}
          <span className="header__dot">.</span>
        </Link>

        <nav className="header__nav desktop">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`header__link ${isActive(link.href) ? "header__link--active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="menu-toggle"
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <nav className="header__nav mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="header__link"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
