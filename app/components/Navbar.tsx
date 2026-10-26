"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Programs & Impact", href: "/programs" },
    { label: "Nurses Network", href: "/nurses-network" },
    { label: "Careers", href: "/get-involved" },
    { label: "News & Education", href: "/resources" },
    { label: "Contact", href: "/contact" },
  ];

  // Hide public Navbar on admin routes
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* Top Accreditation & Utility Strip */}
      <div className="bg-[#0D2B59] text-white text-xs py-2 px-4 border-b border-[#0088D6]/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Link
              href="/resources"
              className="hidden md:inline text-white/80 hover:text-white transition-colors text-xs font-normal"
            >
              Latest Field Updates &amp; Health Resources →
            </Link>
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <span className="hidden sm:inline">Official Mail: millanzinestory2@gmail.com</span>
            <Link
              href="/partnerships"
              className="font-semibold text-[#E0F2FE] hover:text-white underline underline-offset-2 transition-colors"
            >
              Grant &amp; Donor Inquiries →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Brand Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.jpg"
                alt="Maternal Initiative Africa"
                width={200}
                height={100}
                className="h-22 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-6">
              <nav className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "text-[#0D2B59] bg-[#F0F7FD] font-bold"
                          : "text-[#475569] hover:text-[#0D2B59] hover:bg-[#F0F7FD]/60"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <Link
                href="/partnerships"
                className="btn-rose px-5 py-2.5 rounded-full text-sm font-bold inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Partner With MIA</span>
                <span className="text-white/80">→</span>
              </Link>
            </div>

            {/* Mobile: Hamburger button */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                href="/partnerships"
                className="btn-rose px-3.5 py-1.5 rounded-full text-xs font-bold"
              >
                Partner
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-xl text-[#0D2B59] hover:bg-[#F0F7FD] transition-colors"
                aria-label="Open navigation menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile: Backdrop + Left-side Drawer (outside header so it covers the full viewport) ── */}

      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`lg:hidden fixed inset-0 z-[60] bg-[#0D2B59]/55 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer panel */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-[70] h-full w-[78vw] max-w-[300px]
          bg-white shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Mobile navigation"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Image
              src="/logo.jpg"
              alt="Maternal Initiative Africa"
              width={140}
              height={70}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-[#0D2B59] hover:bg-[#F0F7FD] transition-colors"
            aria-label="Close navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col flex-1 px-3 py-4 gap-0.5 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[#F0F7FD] text-[#0D2B59]"
                    : "text-[#475569] hover:bg-[#F0F7FD] hover:text-[#0D2B59]"
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D81B60] shrink-0" />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer CTAs */}
        <div className="px-4 py-5 border-t border-[#E2E8F0] flex flex-col gap-2.5">
          <Link
            href="/partnerships"
            onClick={() => setIsOpen(false)}
            className="btn-rose text-center py-3 rounded-xl font-bold text-sm"
          >
            Partner With MIA / Grant Inquiries
          </Link>
          <Link
            href="/nurses-network"
            onClick={() => setIsOpen(false)}
            className="btn-navy text-center py-3 rounded-xl font-bold text-sm"
          >
            Join Africa Nurses Network
          </Link>
        </div>
      </aside>
    </>
  );
}
