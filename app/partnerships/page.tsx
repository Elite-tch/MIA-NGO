"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PartnershipsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    orgType: "Philanthropic Foundation / Grantmaker",
    country: "",
    scope: "Program Implementation Grant",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
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
          formType: "Partnership & Grant Proposal",
          name: formData.name,
          email: formData.email,
          subject: `Partnership: ${formData.organization} (${formData.scope})`,
          organization: formData.organization,
          country: formData.country,
          orgType: formData.orgType,
          scope: formData.scope,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to submit proposal. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const partnershipTracks = [
    {
      number: "01",
      title: "Programmatic & Implementation Grants",
      desc: "Direct restricted or unrestricted grant support targeted at expanding our frontline mobile clinics, village-level antenatal screenings, and emergency obstetric triage.",
    },
    {
      number: "02",
      title: "Medical Equipment & In-Kind Supplies",
      desc: "Partnerships providing sterile delivery kits, fetal Dopplers, portable diagnostic ultrasound probes, and maternal nutritional supplements for rural health posts.",
    },
    {
      number: "03",
      title: "Telehealth & Digital Health Sponsorship",
      desc: "Co-financing low-bandwidth mobile telemedicine infrastructure, connecting village midwives with regional hospital specialists to resolve clinical emergencies in real time.",
    },
    {
      number: "04",
      title: "Academic & Epidemiological Research",
      desc: "Collaborating with universities and global health institutes to evaluate maternal health interventions, conduct community surveillance, and publish open-access clinical data.",
    },
    {
      number: "05",
      title: "Ministry of Health & Public Sector Alignment",
      desc: "Formal Memorandums of Understanding (MoUs) integrating MIA's nurse network and mobile outreaches directly into national primary maternal health strategies.",
    },
    {
      number: "06",
      title: "Corporate Social Responsibility (CSR)",
      desc: "Engaging corporate partners committed to sustainable development goals (SDG 3 & SDG 5) through sponsored outreach missions and maternal health kit distributions.",
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
                Collaborate for Impact
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D2B59] tracking-tight leading-tight">
                Partnerships & Grants
              </h1>
              <p className="text-lg text-[#0088D6] font-bold">
                Lasting Progress Requires Continental Collaboration.
              </p>
              <p className="text-base text-[#475569] leading-relaxed">
                Transforming maternal healthcare across Sub-Saharan Africa cannot happen in isolation. MIA collaborates with philanthropic foundations, multilateral agencies, medical innovators, and health ministries to scale proven, nurse-led interventions where needs are greatest.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#inquiry"
                  className="btn-rose px-7 py-3 rounded-full text-sm font-bold inline-flex items-center gap-2"
                >
                  <span>Start a Partnership Conversation</span>
                  <span>↓</span>
                </a>
                <Link
                  href="/programs"
                  className="btn-outline-navy px-6 py-3 rounded-full text-sm font-bold inline-flex items-center gap-2"
                >
                  <span>Review Our Programs</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-xl bg-slate-900">
                <Image
                  src="/outreach/outreach-5.jpg"
                  alt="MIA clinical outreach partnership distributing maternal kits"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D2B59]/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="bg-[#D81B60] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-1.5 inline-block">
                    On-the-Ground Impact
                  </span>
                  <p className="text-sm font-bold text-white">
                    Equipping frontline nurses with verified supplies and clinical triage tools.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. PARTNERSHIP TRACKS (Clean Numbered Cards — No Emojis) ── */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-2">
              Engagement Opportunities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D2B59] tracking-tight">
              Six Pathways to Collaborate
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              Flexible, high-integrity partnership models designed for measurable, grant-ready impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnershipTracks.map((track) => (
              <div
                key={track.number}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#0088D6]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-sm font-extrabold text-[#0088D6] block mb-3 font-mono">
                    {track.number}
                  </span>
                  <h3 className="text-lg font-bold text-[#0D2B59] mb-2">{track.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{track.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. INSTITUTIONAL ACCOUNTABILITY & GOVERNANCE ── */}
      <section className="py-20 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block">
                Fiduciary Excellence
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D2B59] tracking-tight">
                Institutional Transparency & Grant Readiness
              </h2>
              <p className="text-base text-[#475569] leading-relaxed">
                MIA operates under strict governance principles. We understand that institutional grant makers and multilateral funders require rigorous accountability, verifiable data, and transparent financial management.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Milestone-based programmatic and financial reporting",
                  "Verified baseline and end-line maternal outcome data",
                  "Compliance with international non-profit financial oversight",
                  "Independent advisory board oversight and clinical audit trails",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-[#0088D6] shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-[#334155] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-8 sm:p-10 space-y-5">
              <h3 className="text-xl font-bold text-[#0D2B59]">
                Request Governance & Due Diligence Dossier
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Verified institutional funders and grant evaluation committees can request MIA&apos;s legal charter, board governance roster, programmatic monitoring frameworks, and financial disclosures directly.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="btn-outline-navy text-xs font-bold px-6 py-3 rounded-full inline-block"
                >
                  Request Due Diligence Materials
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. PARTNERSHIP INQUIRY FORM (Tab Selection Only) ── */}
      <section id="inquiry" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-2">
              Start a Conversation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D2B59] tracking-tight">
              Institutional Partnership Inquiry
            </h2>
            <p className="text-sm text-[#64748B] mt-2 max-w-lg mx-auto">
              Tell us about your organization, geographic priorities, and the collaborative scope you have in mind.
            </p>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-6 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="p-8 bg-white border border-[#0088D6]/30 rounded-2xl text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-[#0088D6]/10 text-[#0088D6] border border-[#0088D6]/20 mx-auto flex items-center justify-center text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-[#0D2B59]">Partnership Inquiry Received</h3>
                <p className="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-bold text-[#0D2B59]">{formData.name}</span>. Our executive leadership and partnerships director will review your proposal from <span className="font-semibold text-[#0088D6]">{formData.organization}</span> and follow up within 24–48 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setError(null);
                    setFormData({
                      name: "",
                      email: "",
                      organization: "",
                      orgType: "Philanthropic Foundation / Grantmaker",
                      country: "",
                      scope: "Program Implementation Grant",
                      message: "",
                    });
                  }}
                  className="btn-rose text-xs font-bold px-6 py-2.5 rounded-full inline-block mt-2 cursor-pointer"
                >
                  Submit Another Inquiry
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
                      Representative Name <span className="text-[#D81B60]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins / Dr. Kofi Osei"
                      className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0D2B59] placeholder-[#94A3B8] focus:outline-none focus:border-[#0088D6] focus:ring-2 focus:ring-[#0088D6]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-[#0D2B59] uppercase tracking-wider mb-2">
                      Official Email Address <span className="text-[#D81B60]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@foundation.org"
                      className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0D2B59] placeholder-[#94A3B8] focus:outline-none focus:border-[#0088D6] focus:ring-2 focus:ring-[#0088D6]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="organization" className="block text-xs font-bold text-[#0D2B59] uppercase tracking-wider mb-2">
                      Organization / Institution <span className="text-[#D81B60]">*</span>
                    </label>
                    <input
                      id="organization"
                      type="text"
                      required
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Global Health Foundation"
                      className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0D2B59] placeholder-[#94A3B8] focus:outline-none focus:border-[#0088D6] focus:ring-2 focus:ring-[#0088D6]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-xs font-bold text-[#0D2B59] uppercase tracking-wider mb-2">
                      Country / Geographic Focus
                    </label>
                    <input
                      id="country"
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="e.g. East Africa / Pan-African"
                      className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0D2B59] placeholder-[#94A3B8] focus:outline-none focus:border-[#0088D6] focus:ring-2 focus:ring-[#0088D6]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Partnership Scope — Interactive Tab Selection Only */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#0D2B59] uppercase tracking-wider">
                      Proposed Partnership Scope <span className="text-[#D81B60]">*</span>
                    </label>
                    <span className="text-xs font-semibold text-[#0088D6]">
                      Select your primary focus:
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                    {[
                      "Program Implementation Grant",
                      "Medical Supplies & Equipment",
                      "Telehealth & Digital Innovation",
                      "Epidemiological Research & Data",
                      "Ministry / Public Sector MoU",
                      "CSR / Corporate Philanthropy",
                    ].map((scope) => {
                      const isSelected = formData.scope === scope;
                      return (
                        <button
                          key={scope}
                          type="button"
                          onClick={() => setFormData({ ...formData, scope })}
                          className={`px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between border text-left ${
                            isSelected
                              ? "bg-[#0D2B59] text-white border-[#0D2B59] shadow-sm ring-2 ring-[#0D2B59]/20 font-bold"
                              : "bg-white border-[#CBD5E1] text-[#334155] hover:border-[#0088D6] hover:text-[#0088D6] hover:bg-slate-50"
                          }`}
                        >
                          <span className="leading-snug">{scope}</span>
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ml-2 border text-[10px] ${
                              isSelected
                                ? "bg-[#0088D6] border-[#0088D6] text-white font-bold"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected ? "✓" : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-[#0D2B59] uppercase tracking-wider mb-2">
                    Partnership Concept / Objectives <span className="text-[#D81B60]">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your institution's funding cycle, programmatic goals, or the specific maternal healthcare initiatives you would like to support..."
                    className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0D2B59] placeholder-[#94A3B8] focus:outline-none focus:border-[#0088D6] focus:ring-2 focus:ring-[#0088D6]/20 transition-all"
                  />
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
                        <span>Submitting Proposal...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Partnership Proposal</span>
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
              Direct Executive Contact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Schedule an Executive Briefing
            </h2>
            <p className="text-base text-slate-200 leading-relaxed">
              We welcome introductory virtual briefings with grant committees, foundation officers, and technical advisors interested in learning more about MIA&apos;s clinical model and geographical footprint.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="bg-white text-[#0D2B59] hover:bg-slate-100 px-8 py-3.5 rounded-full text-sm font-bold transition-colors inline-block"
              >
                Schedule an Introduction
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
