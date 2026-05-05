"use client";

import { useState, useCallback } from "react";
import profileData from "@/data/profile.json";
import { GithubIcon, LinkedInIcon, MailIcon } from "@/lib/icons";
import { ContactMethod } from "@/types";

const contactMethods: ContactMethod[] = [
  {
    icon: <MailIcon />,
    label: "Email",
    value: profileData.email,
    href: `mailto:${profileData.email}`,
  },
  {
    icon: <LinkedInIcon />,
    label: "LinkedIn",
    value: "Connect with me",
    href: profileData.linkedin,
  },
  {
    icon: <GithubIcon />,
    label: "GitHub",
    value: "Check out my code",
    href: profileData.github,
  },
].filter((method) => method.href);

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("sending");
      setErrorMessage("");

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setStatus("success");
          setFormData({ name: "", email: "", message: "" });
        } else {
          const data = await response.json();
          setStatus("error");
          setErrorMessage(data.error || "Failed to send message");
        }
      } catch {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    },
    [formData]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    },
    [formData]
  );

  return (
    <section id="contact" className="section section--contact">
      <div className="container">
        <h2 className="section__title">Get in Touch</h2>
        <p className="section__subtitle">
          Have a project in mind or just want to chat? I&apos;d love to hear from you.
        </p>

        <div className="contact-grid">
          <div className="glass contact-grid__info">
            <h2 className="contact-grid__heading">Let&apos;s Connect</h2>
            <p className="contact-grid__description">
              I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            <div className="contact-methods">
              {contactMethods.map((method) => (
                <a
                  key={method.label}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-method"
                >
                  <div className="contact-method__icon">{method.icon}</div>
                  <div className="contact-method__details">
                    <h3 className="contact-method__label">{method.label}</h3>
                    <p className="contact-method__value">{method.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass contact-grid__form"
          >
            <h2 className="contact-grid__heading">Send a Message</h2>

            {status === "success" && (
              <div className="form-alert form-alert--success">
                Message sent! I&apos;ll get back to you soon.
              </div>
            )}

            {status === "error" && (
              <div className="form-alert form-alert--error">
                {errorMessage}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="contact-name">Name</label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email">Email</label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--full"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
