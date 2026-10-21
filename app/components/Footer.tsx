import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#081B38] text-white pt-16 pb-12 border-t border-[#0088D6]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D2B59] to-[#0088D6] p-0.5 flex items-center justify-center shadow-inner">
                <div className="w-full h-full bg-[#0D2B59] rounded-[10px] flex items-center justify-center">
                  <span className="text-[#0088D6] font-bold text-lg">M</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-base tracking-tight">
                    MATERNAL INITIATIVE
                  </span>
                  <span className="bg-[#D81B60] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                    AFRICA
                  </span>
                </div>
                <p className="text-xs text-[#0088D6] font-medium">Connecting Nurses. Reaching Mothers.</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              A nurse-led African platform committed to ensuring that mothers and children, especially those in underserved and hard-to-reach communities, can access vital health education, digital support, and clinical care connections.
            </p>

            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300">
              <span className="font-semibold text-white block mb-1">Our Core Commitment:</span>
              “No mother should be left behind because of distance, lack of information, or lack of access to care.”
            </div>
          </div>

          {/* Quick Links 1: Platform & Work */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 text-[#0088D6]">
              Our Work
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About MIA & Vision
                </Link>
              </li>
              <li>
                <Link href="/about#leadership" className="hover:text-white transition-colors">
                  Founding & Leadership
                </Link>
              </li>
              <li>
                <Link href="/about#approach" className="hover:text-white transition-colors">
                  5-Pillar Theory of Change
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-white transition-colors">
                  5 Core Services
                </Link>
              </li>
              <li>
                <Link href="/programs#impact" className="hover:text-white transition-colors">
                  Impact & Outcomes
                </Link>
              </li>
              <li>
                <Link href="/nurses-network" className="hover:text-white transition-colors">
                  Africa Nurses Network
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links 2: Grants & Get Involved */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 text-[#0088D6]">
              Partners & Community
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/partnerships" className="hover:text-white transition-colors">
                  Grant & Funder Pathways
                </Link>
              </li>
              <li>
                <Link href="/partnerships#transparency" className="hover:text-white transition-colors">
                  Reports & Transparency
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Health Education Hub
                </Link>
              </li>
              <li>
                <Link href="/get-involved#volunteer" className="hover:text-white transition-colors">
                  Volunteer Opportunities
                </Link>
              </li>
              <li>
                <Link href="/get-involved#membership" className="hover:text-white transition-colors">
                  Clinical Membership
                </Link>
              </li>
              <li>
                <Link href="/get-involved#careers" className="hover:text-white transition-colors">
                  Careers & Fellowships
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Official Inquiries */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 text-[#0088D6]">
              Official Inquiries
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <p>
                <strong className="text-white block text-xs uppercase tracking-wider text-slate-400">Headquarters:</strong>
                Serving communities across Sub-Saharan Africa
              </p>
              <p>
                <strong className="text-white block text-xs uppercase tracking-wider text-slate-400">General & Grant Mail:</strong>
                <a
                  href="mailto:contact@maternalinitiativeafrica.org"
                  className="text-[#0088D6] hover:underline"
                >
                  contact@maternalinitiativeafrica.org
                </a>
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="btn-rose inline-block text-xs font-bold px-4 py-2 rounded-full"
                >
                  Contact The Team →
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Maternal Initiative Africa (MIA). All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors">
              Governance & Ethics
            </Link>
            <Link href="/partnerships#transparency" className="hover:text-white transition-colors">
              Accountability Standards
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Privacy & Safeguarding
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
