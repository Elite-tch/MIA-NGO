import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Maternal Initiative Africa | Connecting Nurses. Reaching Mothers.",
  description:
    "A nurse-led African platform committed to ensuring mothers and children in underserved communities can access health education, telehealth support, and clinical care connections.",
  keywords: [
    "Maternal Initiative Africa",
    "MIA",
    "African maternal health",
    "Africa Nurses Network",
    "Telehealth Africa",
    "Community outreach nurses",
    "Maternal and child health NGO",
    "Nestory Millanzi",
  ],
  authors: [{ name: "Maternal Initiative Africa" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} antialiased min-h-screen flex flex-col bg-white text-[#1E293B]`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
