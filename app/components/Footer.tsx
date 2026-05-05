import Link from "next/link";
import profileData from "@/data/profile.json";
import { GithubIcon, LinkedInIcon, MailIcon } from "@/lib/icons";

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const socialLinks: SocialLink[] = [
  {
    href: profileData.github,
    icon: <GithubIcon />,
    label: "GitHub",
  },
  {
    href: profileData.linkedin,
    icon: <LinkedInIcon />,
    label: "LinkedIn",
  },
  {
    href: `mailto:${profileData.email}`,
    icon: <MailIcon />,
    label: "Email",
  },
].filter((link) => link.href);

const footerNavLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link href="/" className="footer__logo">
            {profileData.name}
            <span className="header__dot">.</span>
          </Link>
          <p className="footer__description">{profileData.bio}</p>
        </div>

        <div className="footer__section">
          <h4 className="footer__heading">Navigation</h4>
          <ul className="footer__list">
            {footerNavLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__section">
          <h4 className="footer__heading">Connect</h4>
          <div className="social-links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                className="social-link"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>
          &copy; {new Date().getFullYear()} {profileData.name}. Built with
          Next.js & Three.js
        </p>
      </div>
    </footer>
  );
}
