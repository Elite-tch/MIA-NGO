"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Partnership & Grant Inquiries",
    organization: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inquiryCategories = [
    "Partnership & Grant Inquiries",
    "Africa Nurses Network Membership",
    "Community Outreach Collaboration",
    "Supplies & In-Kind Donations",
    "Media, Research & Data Access",
    "General Support & Volunteering",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: `Contact: ${formData.category}`,
          name: formData.name,
          email: formData.email,
          subject: `${formData.category} - ${formData.name}`,
          category: formData.category,
          organization: formData.organization,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to deliver message. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* ── 1. HERO SECTION ── */}
      <section className="bg-white border-b border-[#E2E8F0] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-3">
              Contact & Inquiries
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D2B59] tracking-tight leading-tight mb-5">
              Connect with Maternal Initiative Africa
            </h1>
            <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
              Whether you are an institutional funder exploring high-impact partnerships, a healthcare worker interested in our Pan-African network, or an advocate seeking collaboration &mdash; we look forward to hearing from you.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. CONTACT DETAILS + FORM ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Direct Channels & Organization Details */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-2">
                  Direct Channels
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D2B59] tracking-tight">
                  Reach Our Executive & Clinical Teams
                </h2>
                <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
                  Our team reviews inquiries on a rolling basis and strives to respond within 24 to 48 business hours.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-white border border-[#CBD5E1] text-[#0088D6] flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <h3 className="text-sm font-bold text-[#0D2B59]">Official Email</h3>
                  </div>
                  <a
                    href="mailto:info@maternalinitiativeafrica.org"
                    className="text-base font-semibold text-[#0088D6] hover:underline break-all"
                  >
                    info@maternalinitiativeafrica.org
                  </a>
                  <p className="text-xs text-[#64748B] mt-1">
                    For grant documentation, partnership proposals, and general queries.
                  </p>
                </div>

                <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-white border border-[#CBD5E1] text-[#D81B60] flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                      </svg>
                    </span>
                    <h3 className="text-sm font-bold text-[#0D2B59]">Regional Scope</h3>
                  </div>
                  <p className="text-sm font-semibold text-[#1E293B]">
                    Pan-African Operations & Grassroots Hubs
                  </p>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Connecting frontline nurses and reaching underserved rural and peri-urban communities across Sub-Saharan Africa.
                  </p>
                </div>

                <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-white border border-[#CBD5E1] text-[#0D2B59] flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <h3 className="text-sm font-bold text-[#0D2B59]">Africa Nurses Network</h3>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Practicing nurses and midwives wishing to register for clinical webinars and peer collaboration can also reach us via the{" "}
                    <Link href="/nurses-network" className="text-[#0088D6] font-bold hover:underline">
                      Nurses Network page
                    </Link>.
                  </p>
                </div>
              </div>

              {/* Transparency Notice */}
              <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
                <p className="text-xs text-[#334155] leading-relaxed">
                  <strong className="text-[#0D2B59]">Institutional Transparency:</strong> MIA conducts audited programmatic reviews. Formal financial disclosures, board governance frameworks, and impact evaluations are made available upon request to verified grant-making bodies.
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-6 sm:p-10 shadow-sm">
              <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-2">
                Send a Message
              </span>
              <h2 className="text-2xl font-extrabold text-[#0D2B59] mb-6">
                How Can We Collaborate?
              </h2>

              {submitted ? (
                <div className="p-8 bg-white border border-[#0088D6]/30 rounded-2xl text-center space-y-4 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-[#0088D6]/10 text-[#0088D6] border border-[#0088D6]/20 mx-auto flex items-center justify-center text-2xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-[#0D2B59]">Thank You for Reaching Out</h3>
                  <p className="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
                    Your inquiry has been received. Our leadership and communications coordinator will review your message and follow up shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setError(null);
                      setFormData({
                        name: "",
                        email: "",
                        category: "Partnership & Grant Inquiries",
                        organization: "",
                        message: "",
                      });
                    }}
                    className="btn-rose text-xs font-bold px-6 py-2.5 rounded-full inline-block mt-2 cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
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
                        placeholder="e.g. Dr. Jane Doe / John Smith"
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
                        placeholder="you@organization.org"
                        className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0D2B59] placeholder-[#94A3B8] focus:outline-none focus:border-[#0088D6] focus:ring-2 focus:ring-[#0088D6]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Nature of Inquiry — Interactive Tab Selection Only */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <label className="block text-xs font-bold text-[#0D2B59] uppercase tracking-wider">
                        Nature of Inquiry <span className="text-[#D81B60]">*</span>
                      </label>
                      <span className="text-xs font-semibold text-[#0088D6]">
                        Please select an inquiry type below:
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                      {inquiryCategories.map((cat) => {
                        const isSelected = formData.category === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: cat })}
                            className={`px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between border text-left ${
                              isSelected
                                ? "bg-[#0D2B59] text-white border-[#0D2B59] shadow-sm font-bold"
                                : "bg-white border-[#CBD5E1] text-[#334155] hover:border-[#0088D6] hover:text-[#0088D6] hover:bg-slate-50"
                            }`}
                          >
                            <span className="leading-snug">{cat}</span>
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

                  {/* Organization / Hospital */}
                  <div>
                    <label htmlFor="organization" className="block text-xs font-bold text-[#0D2B59] uppercase tracking-wider mb-2">
                      Organization / Hospital (Optional)
                    </label>
                    <input
                      id="organization"
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Ministry of Health / Hospital / NGO"
                      className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0D2B59] placeholder-[#94A3B8] focus:outline-none focus:border-[#0088D6] focus:ring-2 focus:ring-[#0088D6]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-[#0D2B59] uppercase tracking-wider mb-2">
                      Message <span className="text-[#D81B60]">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share details about your proposal, questions, or how you would like to collaborate with MIA..."
                      className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0D2B59] placeholder-[#94A3B8] focus:outline-none focus:border-[#0088D6] focus:ring-2 focus:ring-[#0088D6]/20 transition-all"
                    />
                  </div>

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
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. FREQUENTLY ASKED QUESTIONS ── */}
      <section className="py-16 sm:py-20 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-2">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D2B59]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0]">
              <h3 className="text-base font-bold text-[#0D2B59] mb-2">
                How do frontline health workers join the network?
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Nurses and midwives across Sub-Saharan Africa can join free of charge by submitting an interest application on our Africa Nurses Network page.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0]">
              <h3 className="text-base font-bold text-[#0D2B59] mb-2">
                How does MIA coordinate with local ministries of health?
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                All field outreaches, training workshops, and clinical triage initiatives are conducted in alignment with established national primary healthcare frameworks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0]">
              <h3 className="text-base font-bold text-[#0D2B59] mb-2">
                Can institutional donors fund specific programs?
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Yes. Grants can be restricted to specific programmatic pillars such as clean delivery kit distribution, clinical telehealth connectivity, or maternal nutrition.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0]">
              <h3 className="text-base font-bold text-[#0D2B59] mb-2">
                Where is MIA headquartered?
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                MIA operates with regional field coordinators and decentralized clinical leadership across Sub-Saharan Africa, serving communities where needs are greatest.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
