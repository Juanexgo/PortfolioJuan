"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const adminNavItems: NavItem[] = [
  { label: "Messages", href: "/admin/messages", icon: "📨" },
  { label: "Projects", href: "/admin/projects", icon: "📁" },
  { label: "Experience", href: "/admin/experience", icon: "💼" },
  { label: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = useCallback(async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin");
  }, [router]);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar__title">Admin Panel</h2>

        <nav className="admin-sidebar__nav">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar__link ${
                pathname === item.href ? "admin-sidebar__link--active" : ""
              }`}
            >
              <span className="admin-sidebar__icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <button
              onClick={() => setShowLogout(!showLogout)}
              className="admin-sidebar__user-btn"
            >
              <span>👤</span>
              Admin
            </button>

            {showLogout && (
              <button
                onClick={handleLogout}
                className="admin-sidebar__logout-btn"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
