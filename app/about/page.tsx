import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About Us | Maternal Initiative Africa (MIA)",
  description:
    "Learn about Maternal Initiative Africa (MIA) — our mission, vision, core principles, nurse-led healthcare model, and leadership team dedicated to transforming maternal and child healthcare in Africa.",
};

const principles = [
  {
    number: "01",
    title: "Collaboration",
    desc: "Working hand-in-hand with frontline midwives, local health posts, community leaders, and continental partners.",
  },
  {
    number: "02",
    title: "Compassion",
    desc: "Placing human dignity, respectful maternity care, and cultural empathy at the very heart of clinical practice.",
  },
  {
    number: "03",
    title: "Equity",
    desc: "Ensuring life-saving maternal and newborn healthcare is never dictated by geography or socioeconomic status.",
  },
  {
    number: "04",
    title: "Accountability",
    desc: "Upholding transparent reporting, responsible governance, and verifiable community-level outcomes.",
  },
  {
    number: "05",
    title: "Evidence-Driven",
    desc: "Grounding all outreach, telehealth protocols, and educational curricula in validated clinical research.",
  },
  {
    number: "06",
    title: "Sustainability",
    desc: "Equipping local health workers and community structures with enduring clinical capacity and tools.",
  },
];

const teamMembers = [
  {
    name: "Nestory Millanzi",
    role: "Founder & Executive Director",
    credentials: "RM - senior midwifery",
    image: "/img1.jpg",
    bio: "Senior registered midwife and healthcare advocate dedicated to uniting African nurses and midwives to end preventable maternal and neonatal mortality across underserved communities.",
  },
  {
    name: "Ishmael Paul",
    role: "Director of Data & Research",
    credentials: "RN, Senior Assistant Nursing Officer",
    image: "/img2.jpg",
    bio: "Registered nurse and clinical researcher leading health data surveillance, field analytics, and evidence-based reporting to guide MIA's primary healthcare programs and public health impact.",
  },
  {
    name: "Suzana Gurti",
    role: "Director of Human Resources",
    credentials: "NO, Senior Nursing Officer",
    image: "/img3.jpg",
    bio: "Senior nursing officer managing clinical talent acquisition, nursing workforce welfare, professional development, and staff deployment across all MIA community outreach initiatives.",
  },
  {
    name: "Edson Lupogo",
    role: "Director of Community Outreach",
    credentials: "RN,Senior Assistant Nursing Officer",
    image: "/img4.jpg",
    bio: "Senior assistant nursing officer coordinating frontline mobile health teams, distribution of clean delivery kits, and direct community-level maternal health campaigns in remote rural areas.",
  },
  {
    name: "Joseph Rwehumbiza",
    role: "Director of Grants, Fundraising & Partnership",
    credentials: "Experienced Accountant with CPA",
    image: "/img5.jpg",
    bio: "Certified public accountant spearheading resource mobilization, institutional funder relations, bilateral donor reporting, and financial compliance to support MIA's expanding outreach.",
  },
  {
    name: "Maria Shao",
    role: "Director of Finance",
    credentials: "Bachalor of Accountant",
    image: "/imgg.jpg",
    bio: "Directs fiscal planning, organizational budgeting, financial audit controls, and transparent resource allocation across all Maternal Initiative Africa programs and grant funds.",
  },
  {
    name: "Rabeka Hadson",
    role: "Manager & Strategic Advisor",
    credentials: "Senior Registered Nurse & Anesthesia",
    image: "/img6.jpg",
    bio: "Specialized nurse anesthetist and healthcare manager advising leadership on clinical operating standards, critical obstetric risk protocols, and strategic organizational development.",
  },
  {
    name: "Basilisa Shomvi",
    role: "Director of Africa Nurses Network",
    credentials: "RN, Senior Assistant Nursing Officer",
    image: "/img7.jpg",
    bio: "Experienced nursing officer overseeing peer mentorship, cross-border clinical knowledge exchange, specialized webinars, and professional networking for midwives and nurses across Africa.",
  },
  {
    name: "Happiness Steven",
    role: "Director of Education & Community Consultation",
    credentials: "NO, Nursing Officer &  Senior Pediatric Nurse",
    image: "/img8.jpg",
    bio: "Senior pediatric nursing officer directing participatory community workshops, maternal-newborn health education, and local stakeholder consultations to improve child health outcomes.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* ── 1. HERO SECTION (Clean White & Slate matching Landing Page) ── */}
      <section className="bg-white border-b border-[#E2E8F0] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-3">
              About Maternal Initiative Africa
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D2B59] tracking-tight leading-tight mb-5">
              Connecting Nurses. Reaching Mothers. Transforming Africa.
            </h1>
            <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
              Maternal Initiative Africa (MIA) is a nurse-led non-governmental organisation dedicated to bridging the critical gap between underserved African communities and the clinical expertise needed to safeguard mothers and their newborns.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. TRUST / CREDIBILITY STRIP ── */}
      <div className="border-b border-[#E2E8F0] bg-white">
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

      {/* ── 3. WHO WE ARE & STORY + MISSION & VISION DIRECTLY UNDERNEATH ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Main Story Narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-3">
                Who We Are
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D2B59] leading-tight">
                Maternal Initiative Africa
              </h2>
              <div className="mt-5 h-0.5 w-12 bg-[#0088D6]" />
            </div>

            <div className="lg:col-span-8 space-y-5">
              <p className="text-lg text-[#1E293B] leading-relaxed font-medium">
                Maternal Initiative Africa (MIA) is a nurse-led non-governmental organisation dedicated to reducing preventable maternal and child deaths across Sub-Saharan Africa.
              </p>
              <p className="text-base text-[#475569] leading-relaxed">
                Sub-Saharan Africa bears roughly 70% of global maternal deaths &mdash; with the vast majority stemming from preventable obstetric complications like hemorrhage, hypertensive disorders, sepsis, and obstructed labor. In rural settlements and underserved communities, distance to emergency facilities, lack of timely triage, and fragmented frontline support leave mothers and newborns at acute risk.
              </p>
              <p className="text-base text-[#475569] leading-relaxed">
                Yet in almost every community, nurses and midwives are present. They are the first to arrive, the trusted care providers who understand local culture, and the hands that deliver life. MIA was founded on the conviction that by empowering, uniting, and equipping these frontline professionals through clinical telehealth, community outreach, health education, data research, and the Africa Nurses Network, we address the practical barriers that drive Africa&apos;s maternal health crisis.
              </p>

              {/* Theory of change quote (Editorial style matching landing page) */}
              <blockquote className="border-l-2 border-[#0088D6] pl-4 py-1 text-base text-[#0D2B59] italic mt-6">
                &ldquo;No mother should be left behind because of distance, lack of information, or lack of access to care.&rdquo;
                <span className="block not-italic text-xs font-bold text-[#0088D6] mt-1.5 uppercase tracking-wider">
                  — Nestory Millanzi, Founder & Executive Director
                </span>
              </blockquote>
            </div>
          </div>

          {/* Mission & Vision directly integrated under About text */}
          <div className="mt-16 pt-12 border-t border-[#E2E8F0]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mission Card */}
              <div className="p-8 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full bg-[#0088D6]" />
                  <span className="text-xs font-bold text-[#0088D6] uppercase tracking-widest">
                    Our Mission
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0D2B59] mb-3">
                  Connecting Health Professionals, Reaching Underserved Mothers
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  To connect health professionals, communities, and institutional partners to improve access to maternal, newborn, and child health education, clinical triage, timely referrals, and quality care in underserved communities across Africa.
                </p>
              </div>

              {/* Vision Card */}
              <div className="p-8 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full bg-[#D81B60]" />
                  <span className="text-xs font-bold text-[#D81B60] uppercase tracking-widest">
                    Our Vision
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0D2B59] mb-3">
                  An Africa Where Every Mother & Child Survives and Thrives
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Communities across Sub-Saharan Africa where every mother, newborn, and child can access the information, dignity, and quality clinical care they need to thrive, free from preventable maternal mortality.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. OUR PRINCIPLES (No emojis — Clean numbers & typography) ── */}
      <section className="py-20 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-2">
              Our Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D2B59] tracking-tight">
              Values That Guide Every Intervention
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              Institutional standards that shape every field outreach, clinical protocol, and institutional partnership.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((p) => (
              <div
                key={p.number}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-6 hover:border-[#0088D6]/40 hover:shadow-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-sm font-extrabold text-[#0088D6] block mb-3 font-mono">
                    {p.number}
                  </span>
                  <h3 className="text-lg font-bold text-[#0D2B59] mb-2">{p.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. LEADERSHIP & TEAM ── */}
      <section id="leadership" className="py-20 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
            <div>
              <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-2">
                Leadership & Governance
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D2B59] tracking-tight">
                Our Team & Clinical Leadership
              </h2>
            </div>
            <p className="text-sm text-[#64748B] max-w-md">
              Frontline clinicians, public health specialists, and health informatics leads united by a commitment to maternal survival.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <div
                key={`${member.name}-${member.image || idx}`}
                className="group bg-[#F8FAFC] rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Photo container */}
                <div className="relative aspect-[3/4] w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D2B59]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold text-[#0D2B59] bg-white/95 px-2.5 py-1 rounded-full inline-block shadow-sm">
                      {member.credentials}
                    </span>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-6 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <h3 className="text-lg font-bold text-[#0D2B59] leading-snug">{member.name}</h3>
                    <p className="text-xs font-bold text-[#D81B60] uppercase tracking-wider mt-1 mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-[#64748B] leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Advisory & Governance Strip */}
          <div className="mt-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-base font-bold text-[#0D2B59]">Board of Directors & Clinical Advisory Council</h4>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                MIA is governed by an independent advisory council comprising senior midwives, obstetricians, and public health educators across Africa.
              </p>
            </div>
            <Link
              href="/contact"
              className="btn-outline-navy text-xs font-bold px-5 py-2.5 rounded-full shrink-0"
            >
              Contact Our Governance Team
            </Link>
          </div>

        </div>
      </section>

      {/* ── 6. CALL TO ACTION (Matching Landing Page Navy Gradient) ── */}
      <section className="py-20 bg-gradient-to-br from-[#0D2B59] to-[#103A75] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="text-[#0088D6] text-xs font-bold uppercase tracking-widest">
              Join Our Movement
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Partner with Us to Protect African Mothers
            </h2>
            <p className="text-base text-slate-200 leading-relaxed">
              Whether you are an institutional funder looking for proven community impact, a nurse seeking to join our professional network, or a collaborator ready to dedicate your expertise &mdash; MIA has a place for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/partnerships"
                className="btn-rose px-7 py-3.5 rounded-full text-sm font-bold"
              >
                Grant & Partner Inquiries
              </Link>
              <Link
                href="/nurses-network"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-7 py-3.5 rounded-full text-sm font-bold transition-colors"
              >
                Join Nurses Network
              </Link>
              <Link
                href="/contact"
                className="bg-white text-[#0D2B59] hover:bg-slate-100 px-7 py-3.5 rounded-full text-sm font-bold transition-colors"
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
