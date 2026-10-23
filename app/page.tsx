import Link from "next/link";
import Image from "next/image";
import ImpactGallery from "./components/ImpactGallery";
import { getStoredResources } from "./lib/db";
import { stripHtml, sortByLatest } from "./lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allResources = await getStoredResources();
  const publishedPosts = sortByLatest(
    allResources.filter((r) => r.status !== "draft")
  );
  const latestPosts = publishedPosts.slice(0, 4);
  const coreServices = [
    {
      number: "01",
      title: "Telehealth & Digital Support",
      tagline: "Connecting Mothers With Clinical Care",
      desc: "Leveraging accessible mobile platforms to connect expectant and new mothers directly with nurses and midwives for timely guidance, triage, and referral.",
      badge: "Digital Health",
      link: "/programs#telehealth",
    },
    {
      number: "02",
      title: "Community Outreach",
      tagline: "Reaching Mothers Where They Are",
      desc: "Deploying frontline midwives and community nurses to hard-to-reach rural settlements, providing on-the-ground health education and care linkages.",
      badge: "Field Delivery",
      link: "/programs#outreach",
    },
    {
      number: "03",
      title: "Data & Research",
      tagline: "Turning Challenges Into Evidence",
      desc: "Gathering community-level maternal indicators to identify care bottlenecks, formulate evidence-based solutions, and guide institutional grants.",
      badge: "Evidence-Based",
      link: "/programs#research",
    },
    {
      number: "04",
      title: "Education & Capacity Building",
      tagline: "Sharing Knowledge That Saves Lives",
      desc: "Delivering practical antenatal literacy for mothers alongside specialized clinical training workshops for frontline community health workers.",
      badge: "Clinical Upskilling",
      link: "/programs#education",
    },
    {
      number: "05",
      title: "Africa Nurses Network",
      tagline: "Building Strength Across Borders",
      desc: "A collaborative pan-African movement uniting nurses, midwives, and researchers to share knowledge, clinical protocols, and peer mentorship.",
      badge: "Continental Network",
      link: "/nurses-network",
    },
  ];

  return (
    <div>
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto lg:pl-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left Column: Mission Content */}
            <div className="lg:col-span-6 space-y-4 lg:space-y-5 px-4 sm:px-6 lg:px-0 py-8 lg:py-12 lg:pr-10 flex flex-col justify-center">
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0D2B59] tracking-tight leading-[1.14]">
                Every mother deserves a{" "}
                <span className="relative inline-block text-[#0088D6]">
                  safe beginning.
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-2.5 text-[#0088D6]"
                    viewBox="0 0 100 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 8 Q 50 0, 100 8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Mission Statement */}
              <p className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-xl font-normal">
                Connecting nurses, reaching mothers, and transforming maternal, newborn, and child health across underserved and hard-to-reach communities in Africa.
              </p>

              {/* Theory of change quote (Editorial style) */}
              <blockquote className="border-l-2 border-[#0088D6]/40 pl-4 py-0.5 text-sm sm:text-base text-[#475569] italic">
                “No mother should be left behind because of distance, lack of information, or lack of access to care.”
                <span className="block not-italic text-xs text-[#0088D6] font-semibold mt-1">
                  — MIA Founding Principle
                </span>
              </blockquote>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/programs"
                  className="btn-rose px-6 py-3 rounded-full text-sm font-bold inline-flex items-center gap-2"
                >
                  <span>Our Programs</span>
                  <span>→</span>
                </Link>

                <Link
                  href="/partnerships"
                  className="btn-outline-navy px-6 py-3 rounded-full text-sm font-bold inline-flex items-center gap-2"
                >
                  <span>Partner with MIA</span>
                  <span>→</span>
                </Link>
              </div>

            </div>

            {/* Right Column: Hero Visual Showcase (Top to bottom, no space) */}
            <div className="lg:col-span-6 relative w-full h-[420px] lg:h-auto min-h-full">
              <Image
                src="/img.jpg"
                alt="Maternal Initiative Africa"
                fill
                priority
                className="object-cover object-center"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── 1b. TRUST / CREDIBILITY STRIP ── */}
      <div className="border-y border-[#E2E8F0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#E2E8F0]">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
                label: "Nurse-Led",
                sub: "Clinical expertise at every level",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0120 9.414V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                label: "Evidence-Based",
                sub: "Data-driven programme design",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                ),
                label: "Community-Rooted",
                sub: "Built with the communities we serve",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                ),
                label: "Pan-African",
                sub: "Operating across Sub-Saharan Africa",
              },
            ].map((pillar) => (
              <div key={pillar.label} className="flex items-start gap-3 px-6 py-5">
                <span className="mt-0.5 text-[#0088D6] shrink-0">{pillar.icon}</span>
                <div>
                  <p className="text-sm font-bold text-[#0D2B59]">{pillar.label}</p>
                  <p className="text-xs text-[#64748B] mt-0.5 leading-snug">{pillar.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 1c. FIELD IMPACT & OUTREACH GALLERY ── */}
      <ImpactGallery />

      {/* ── 1d. NGO BRIEF ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

            {/* Left: Section label + headline */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-4">Who We Are</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D2B59] leading-tight">
                Maternal Initiative Africa
              </h2>
              <div className="mt-5 h-px w-12 bg-[#0088D6]" />
            </div>

            {/* Right: Body text + CTA */}
            <div className="lg:col-span-8 space-y-5">
              <p className="text-lg text-[#1E293B] leading-relaxed font-medium">
                Maternal Initiative Africa (MIA) is a nurse-led non-governmental organisation dedicated to reducing preventable maternal and child deaths across Sub-Saharan Africa.
              </p>
              <p className="text-base text-[#475569] leading-relaxed">
                Founded on the conviction that every mother deserves access to skilled, compassionate care regardless of geography or income, MIA bridges the gap between underserved communities and the clinical expertise they need. Through telehealth, community outreach, health education, data research, and the Africa Nurses Network, we address the systemic, practical, and human barriers that drive Africa&apos;s maternal health crisis.
              </p>
              <p className="text-base text-[#475569] leading-relaxed">
                Our work is rooted in local communities, validated by evidence, and amplified through continental collaboration — because lasting change in maternal health cannot happen in isolation.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0D2B59] border-b-2 border-[#0088D6] pb-0.5 hover:text-[#0088D6] transition-colors"
                >
                  <span>Learn More About MIA</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. WHAT WE DO — Featured + Cards ── */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── TOP: Two-column feature block ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">

            {/* Left: Eyebrow + Headline + Body + CTA */}
            <div className="space-y-6">
              <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest">
                Our Core Services
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D2B59] leading-tight">
                A comprehensive approach to maternal and child survival.
              </h2>
              <p className="text-base text-[#475569] leading-relaxed">
                MIA responds directly to the practical barriers faced by mothers, children, and frontline health workers across Sub-Saharan Africa. From digital telehealth to community-level outreach, every program we run is nurse-led, evidence-based, and designed for lasting impact.
              </p>
              <Link
                href="/programs"
                className="btn-rose inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold"
              >
                <span>Explore All Programs</span>
                <span>→</span>
              </Link>
            </div>

            {/* Right: Stats visual panel (no image) */}
            <div className="bg-gradient-to-br from-[#0D2B59] to-[#103A75] rounded-3xl p-8 shadow-xl text-white flex flex-col gap-6">
              <p className="text-xs font-bold text-[#0088D6] uppercase tracking-widest">MIA At A Glance</p>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { value: "5", label: "Core Programs" },
                  { value: "Pan-African", label: "Nurse Network" },
                  { value: "Rural", label: "Community Focus" },
                  { value: "Evidence", label: "Based Approach" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 rounded-2xl p-4">
                    <p className="text-2xl font-extrabold text-white leading-none">{stat.value}</p>
                    <p className="text-xs text-slate-300 mt-1 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &ldquo;No mother should be left behind because of distance, lack of information, or lack of access to care.&rdquo;
                </p>
                <span className="text-[10px] text-[#0088D6] font-bold mt-1 block">— MIA Founding Principle</span>
              </div>
            </div>

          </div>

          {/* ── BOTTOM: 3-column service cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreServices.slice(0, 3).map((service) => (
              <div
                key={service.number}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#E2E8F0] flex flex-col group card-hover"
              >
                {/* Card top color band */}
                <div className="h-2 bg-gradient-to-r from-[#0088D6] to-[#0D2B59]" />

                {/* Card text */}
                <div className="flex flex-col flex-1 p-6 space-y-3">
                  <span className="text-3xl font-extrabold text-[#0D2B59]/20 group-hover:text-[#0088D6]/40 transition-colors leading-none">
                    {service.number}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0D2B59] leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed flex-1">
                    {service.desc}
                  </p>
                  <Link
                    href={service.link}
                    className="text-xs font-bold text-[#D81B60] uppercase tracking-wider inline-flex items-center gap-1.5 hover:gap-3 transition-all"
                  >
                    <span>Learn More</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* ── See all link ── */}
          <div className="mt-10 text-center">
            <Link
              href="/programs"
              className="text-sm font-bold text-[#0088D6] hover:text-[#0D2B59] inline-flex items-center gap-1.5 transition-colors"
            >
              See all 5 programs →
            </Link>
          </div>

        </div>
      </section>

      {/* ── 3. AFRICA NURSES NETWORK SPOTLIGHT ── */}
      <section className="py-20 bg-gradient-to-r from-[#0D2B59] to-[#103A75] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="bg-[#0088D6] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Continental Health Workforce
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                The Africa Nurses Network: Building Strength Together
              </h2>
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
                Nurses and midwives are the backbone of African healthcare. MIA provides a dedicated collaborative ecosystem for peer learning, clinical guidance, research exchange, and tele-support across borders.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">Peer Learning</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">Telehealth Triage Training</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">Evidence-Based Protocols</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">Cross-Border Research</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                href="/nurses-network"
                className="btn-rose text-center py-4 px-6 rounded-full font-bold text-sm shadow-xl"
              >
                Join Africa Nurses Network →
              </Link>
              <Link
                href="/about#leadership"
                className="bg-white/10 hover:bg-white/20 text-white text-center py-3.5 px-6 rounded-full font-bold text-sm transition-colors"
              >
                Meet Our Leadership
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. NEWS & RESOURCES ── */}
      <section className="py-20 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-2">Resources & Insights</span>
              <h2 className="text-3xl font-extrabold text-[#0D2B59] leading-tight">
                Knowledge for Better Maternal Health
              </h2>
            </div>
            <Link
              href="/resources"
              className="text-sm font-bold text-[#0088D6] hover:text-[#0D2B59] inline-flex items-center gap-1.5 transition-colors shrink-0"
            >
              View All Resources →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestPosts.map((item) => (
              <article
                key={item.id || item.slug}
                className="group flex flex-col border border-[#E2E8F0] rounded-2xl overflow-hidden hover:border-[#0088D6]/40 hover:shadow-md transition-all duration-300 bg-white"
              >
                {/* Cover thumbnail or gradient bar */}
                {item.image ? (
                  <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 300px"
                      unoptimized={item.image.startsWith("data:")}
                    />
                    <div className="absolute top-2.5 left-3">
                      <span className="bg-[#D81B60] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-1 bg-gradient-to-r from-[#D81B60] to-[#0088D6]" />
                )}

                <div className="flex flex-col flex-1 p-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>{item.date}</span>
                    <span className="text-[#0088D6] font-semibold">{item.readTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0D2B59] leading-snug group-hover:text-[#0088D6] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3 flex-1">
                    {stripHtml(item.summary)}
                  </p>
                  <Link
                    href={`/resources/${item.slug}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D81B60] uppercase tracking-wider pt-2 hover:gap-2.5 transition-all"
                  >
                    <span>Read Details</span>
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ── 5. QUICK GET INVOLVED CALLOUT ── */}
      <section className="py-20 bg-[#F0F7FD] border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest">
              Join Our Movement
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D2B59] tracking-tight">
              Ready to help us transform maternal care in Africa?
            </h2>
            <p className="text-base text-[#475569] leading-relaxed">
              Whether you are an institutional funder looking for proven community impact, a nurse seeking to join the professional network, or a volunteer ready to dedicate your skills — MIA has a place for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/partnerships"
                className="btn-rose px-7 py-3.5 rounded-full text-sm font-bold"
              >
                Grant & Partner Inquiries
              </Link>
              <Link
                href="/get-involved"
                className="btn-navy px-7 py-3.5 rounded-full text-sm font-bold"
              >
                Volunteer, Careers & Membership
              </Link>
              <Link
                href="/contact"
                className="btn-outline-navy px-7 py-3.5 rounded-full text-sm font-bold"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
