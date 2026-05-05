"use client";

import Link from "next/link";
import profileData from "@/data/profile.json";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero__content">
        <p className="hero__greeting">Hello, I&apos;m</p>
        <h1 className="hero__name">{profileData.name}</h1>
        <p className="hero__tagline">{profileData.bio}</p>
        <div className="hero__actions">
          <Link href="/#projects" className="btn btn--primary">
            View Projects
          </Link>
          <Link href="/#contact" className="btn btn--secondary">
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
