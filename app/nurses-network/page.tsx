"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NursesNetworkPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    cadre: "Registered Midwife (RM)",
    workplace: "",
    experience: "1–5 years",
    interest: "Clinical Masterclasses",
  });
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "Africa Nurses Network Membership Application",
          name: formData.name,
          email: formData.email,
          subject: `Nurse Network Application: ${formData.name} (${formData.cadre}, ${formData.country})`,
          country: formData.country,
          cadre: formData.cadre,
          workplace: formData.workplace,
          experience: formData.experience,
          interest: formData.interest,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRegistered(true);
      } else {
        setError(data.error || "Failed to submit registration. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const pillars = [
    {
      number: "01",
      title: "Cross-Border Peer Mentorship",
      desc: "Connecting community nurses in remote settlements with senior midwifery educators and clinical preceptors across Sub-Saharan Africa for guidance and solidarity.",
    },
    {
      number: "02",
      title: "Clinical Masterclasses & Webinars",
      desc: "Regular digital CME sessions focusing on emergency obstetric care, neonatal resuscitation, hypertensive crisis management, and safe delivery protocols.",
    },
    {
      number: "03",
      title: "Digital Clinical Guidelines & Toolkits",
      desc: "Direct access to downloadable, evidence-based triage charts, medication dosage protocols, and WHO-aligned maternal care algorithms designed for mobile devices.",
    },
    {
      number: "04",
      title: "Healthcare Worker Psychosocial Support",
      desc: "Providing dedicated peer wellness circles and mental health check-ins to support nurses coping with high-stress clinical environments and compassion fatigue.",
    },
    {
      number: "05",
      title: "Community Outreach & Field Missions",
      desc: "Opportunities to volunteer on MIA mobile clinic outreaches, distributing delivery kits and conducting village-level antenatal health screenings.",
    },
    {
      number: "06",
      title: "Frontline Nurse Advocacy",
      desc: "Amplifying the collective voice of nurses and midwives in shaping maternal health policies, institutional funding priorities, and workplace safety standards.",
    },
  ];

  return (
    <div className="bg-white">
      {/* ── 1. HERO SECTION ── */}
      <section className="bg-white border-b border-[#E2E8F0] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block">
                Pan-African Professional Movement
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D2B59] tracking-tight leading-tight">
                Africa Nurses Network
              </h1>
              <p className="text-lg text-[#0088D6] font-bold">
                Uniting Frontline Clinicians. Advancing Maternal Survival.
              </p>
              <p className="text-base text-[#475569] leading-relaxed">
                Nurses and midwives deliver more than 80% of primary maternal and child healthcare in Sub-Saharan Africa. The Africa Nurses Network is MIA&apos;s continental platform connecting frontline clinicians to share clinical protocols, peer mentorship, continuing education, and solidarity across borders.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#register"
                  className="btn-rose px-7 py-3 rounded-full text-sm font-bold inline-flex items-center gap-2"
                >
                  <span>Join the Network (Free)</span>
                  <span>↓</span>
                </a>
                <Link
                  href="/programs"
                  className="btn-outline-navy px-6 py-3 rounded-full text-sm font-bold inline-flex items-center gap-2"
                >
                  <span>Explore MIA Programs</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-xl bg-slate-900">
                <Image
                  src="/outreach/outreach-6.jpg"
                  alt="African nurses collaborating in clinical practice"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D2B59]/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="bg-[#D81B60] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-1.5 inline-block">
                    Pan-African Solidarity
                  </span>
                  <p className="text-sm font-bold text-white">
                    Connecting nurses across Sub-Saharan Africa to elevate standards of care.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. NETWORK PILLARS (Clean Numbered Cards — No Emojis) ── */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-2">
              Network Benefits & Programs
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D2B59] tracking-tight">
              What We Build Together
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              A comprehensive support ecosystem engineered specifically for frontline nurses and midwives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.number}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#0088D6]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-sm font-extrabold text-[#0088D6] block mb-3 font-mono">
                    {pillar.number}
                  </span>
                  <h3 className="text-lg font-bold text-[#0D2B59] mb-2">{pillar.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. CLINICAL LEADERSHIP QUOTE ── */}
      <section className="py-16 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-[#0088D6]" />
              <span className="text-xs font-bold text-[#0088D6] uppercase tracking-widest">
                Frontline Voice
              </span>
            </div>
            <blockquote className="text-lg sm:text-xl font-bold text-[#0D2B59] italic leading-relaxed">
              &ldquo;When a midwife in a remote clinic faces an obstructed delivery alone at midnight, she shouldn&apos;t feel isolated. The Africa Nurses Network ensures she has the clinical protocols, senior counsel, and solidarity to make life-saving decisions with confidence.&rdquo;
            </blockquote>
            <div className="mt-6 pt-4 border-t border-[#CBD5E1] flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-bold text-[#0D2B59]">MIA Clinical Advisory Directorate</p>
                <p className="text-xs text-[#64748B]">Pan-African Midwifery & Nursing Initiative</p>
              </div>
              <span className="text-xs font-bold text-[#D81B60] uppercase tracking-wider">
                Sub-Saharan Africa
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. MEMBERSHIP REGISTRATION FORM ── */}
      <section id="register" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-2">
              Join the Network
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D2B59] tracking-tight">
              Register Your Membership
            </h2>
            <p className="text-sm text-[#64748B] mt-2 max-w-lg mx-auto">
              Membership is open and free to all nurses, midwives, nursing students, and clinical educators practicing in or dedicated to maternal healthcare in Africa.
            </p>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-6 sm:p-10 shadow-sm">
            {registered ? (
              <div className="p-8 bg-white border border-[#22C55E]/30 rounded-2xl text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#22C55E]/10 text-[#22C55E] mx-auto flex items-center justify-center text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-[#0D2B59]">Welcome to the Africa Nurses Network</h3>
                <p className="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
                  Thank you for registering, <span className="font-bold text-[#0D2B59]">{formData.name}</span>. Our network coordinator will send your welcome package, calendar of clinical webinars, and portal access instructions to <span className="font-semibold text-[#0088D6]">{formData.email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRegistered(false);
                    setError(null);
                    setFormData({
                      name: "",
                      email: "",
                      country: "",
                      cadre: "Registered Midwife (RM)",
                      workplace: "",
                      experience: "1–5 years",
                      interest: "Clinical Masterclasses",
                    });
                  }}
                  className="btn-rose text-xs font-bold px-6 py-2.5 rounded-full inline-block mt-2 cursor-pointer"
                >
                  Register Another Colleague
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-[#D81B60] text-xs font-semibold rounded-xl">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-[#0D2B59] uppercase tracking-wider mb-2">
                      Full Name <span className="text-[#D81B60]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Nurse Amina Bello"
                      className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0D2B59] placeholder-[#94A3B8] focus:outline-none focus:border-[#0088D6] focus:ring-2 focus:ring-[#0088D6]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-[#0D2B59] uppercase tracking-wider mb-2">
                      Email Address <span className="text-[#D81B60]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@hospital.org"
                      className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0D2B59] placeholder-[#94A3B8] focus:outline-none focus:border-[#0088D6] focus:ring-2 focus:ring-[#0088D6]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="country" className="block text-xs font-bold text-[#0D2B59] uppercase tracking-wider mb-2">
                      Country of Practice <span className="text-[#D81B60]">*</span>
                    </label>
                    <input
                      id="country"
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="e.g. Nigeria, Tanzania, Kenya, Ghana..."
                      className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0D2B59] placeholder-[#94A3B8] focus:outline-none focus:border-[#0088D6] focus:ring-2 focus:ring-[#0088D6]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="workplace" className="block text-xs font-bold text-[#0D2B59] uppercase tracking-wider mb-2">
                      Hospital / Clinic / Health Center
                    </label>
                    <input
                      id="workplace"
                      type="text"
                      value={formData.workplace}
                      onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                      placeholder="e.g. St. Luke Health Post"
                      className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0D2B59] placeholder-[#94A3B8] focus:outline-none focus:border-[#0088D6] focus:ring-2 focus:ring-[#0088D6]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Cadre Selection — Tab Selection Only */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#0D2B59] uppercase tracking-wider">
                      Professional Cadre <span className="text-[#D81B60]">*</span>
                    </label>
                    <span className="text-xs font-semibold text-[#0088D6]">
                      Select your clinical role:
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      "Registered Midwife (RM)",
                      "Registered Nurse (RN)",
                      "Community Health Nurse",
                      "Nursing / Midwifery Student",
                      "Clinical Educator / Tutor",
                      "Nurse Practitioner / Other",
                    ].map((role) => {
                      const isSelected = formData.cadre === role;
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setFormData({ ...formData, cadre: role })}
                          className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border text-left ${
                            isSelected
                              ? "bg-[#0D2B59] text-white border-[#0D2B59] shadow-sm ring-2 ring-[#0D2B59]/20 font-bold"
                              : "bg-white border-[#CBD5E1] text-[#334155] hover:border-[#0088D6] hover:text-[#0088D6]"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSelected ? "bg-[#0088D6]" : "bg-slate-300"
                            }`}
                          />
                          <span>{role}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-rose w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Network Registration</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── 5. CTA SECTION ── */}
      <section className="py-20 bg-gradient-to-br from-[#0D2B59] to-[#103A75] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="text-[#0088D6] text-xs font-bold uppercase tracking-widest">
              Institutional Collaboration
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Partner with the Africa Nurses Network
            </h2>
            <p className="text-base text-slate-200 leading-relaxed">
              Are you a nursing council, medical university, global health NGO, or health ministry? Partner with us to sponsor clinical masterclasses, scale digital guidelines, and equip frontline nurses across Africa.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/partnerships"
                className="btn-rose px-7 py-3.5 rounded-full text-sm font-bold"
              >
                Explore Institutional Partnerships
              </Link>
              <Link
                href="/contact"
                className="bg-white text-[#0D2B59] hover:bg-slate-100 px-7 py-3.5 rounded-full text-sm font-bold transition-colors"
              >
                Contact Network Directorate
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
