import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import profileData from "@/data/profile.json";
import ThreeBackground from "./components/ThreeBackground";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profileData.name} | ${profileData.title}`,
  description: profileData.bio,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThreeBackground />
        <Header />
        <main>{children}</main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
