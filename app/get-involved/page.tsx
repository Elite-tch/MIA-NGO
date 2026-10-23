"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { stripHtml, sortByLatest } from "../lib/utils";

interface CareerItem {
  id: string;
  slug: string;
  title: string;
  type: "Paid" | "Volunteer" | "Fellowship";
  department: string;
  location: string;
  commitment: string;
  deadline: string;
  summary: string;
}

type CareerFilter = "All" | "Paid" | "Volunteer" | "Fellowship";

export default function GetInvolvedPage() {
  const [activeFilter, setActiveFilter] = useState<CareerFilter>("All");
  const [allCareers, setAllCareers] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/careers")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setAllCareers(sortByLatest(list));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filterTabs: { label: string; value: CareerFilter }[] = [
    { label: "All Opportunities", value: "All" },
    { label: "Paid Positions", value: "Paid" },
    { label: "Volunteer Roles", value: "Volunteer" },
    { label: "Clinical Fellowships", value: "Fellowship" },
  ];

  const publicCareers = allCareers.filter((item) => (item as any).status !== "draft");
  const filteredCareers =
    activeFilter === "All"
      ? publicCareers
      : publicCareers.filter((item) => item.type === activeFilter);

  return (
    <div className="bg-white">
      {/* ── 1. HERO SECTION ── */}
      <section className="bg-white border-b border-[#E2E8F0] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-3">
              Join Our Team
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D2B59] tracking-tight leading-tight mb-5">
              Careers, Volunteering &amp; Fellowships
            </h1>
            <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
              Dedicate your clinical expertise, passion, or operational skills to safeguard African mothers and newborns. Explore our open paid career openings, frontline volunteer missions, and research fellowships.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="mt-10 pt-6 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#0D2B59] uppercase tracking-wider">
                Filter by Engagement Type:
              </span>
              <span className="text-xs text-[#64748B]">
                Showing {filteredCareers.length} of {allCareers.length} opportunities
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {filterTabs.map((tab) => {
                const isSelected = activeFilter === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveFilter(tab.value)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#0D2B59] text-white shadow-sm"
                        : "bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] hover:border-[#0088D6] hover:text-[#0088D6]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CAREERS & VOLUNTEERING LISTINGS ── */}
      <section className="py-14 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-3xl p-8 border border-[#E2E8F0] animate-pulse h-56" />
              ))}
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCareers.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                          job.type === "Paid"
                            ? "bg-[#0D2B59] text-white"
                            : job.type === "Volunteer"
                            ? "bg-[#D81B60] text-white"
                            : "bg-[#0088D6] text-white"
                        }`}
                      >
                        {job.type} Opportunity
                      </span>
                      <span className="text-xs font-semibold text-[#64748B]">
                        Deadline: {job.deadline}
                      </span>
                    </div>

                    {/* Title & Department */}
                    <h2 className="text-xl font-bold text-[#0D2B59] leading-snug mb-2">
                      {job.title}
                    </h2>
                    <p className="text-xs font-bold text-[#0088D6] uppercase tracking-wider mb-4">
                      {job.department}
                    </p>

                    {/* Location & Commitment Pills */}
                    <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-[#475569]">
                      <span className="bg-[#F8FAFC] border border-slate-200 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
                        <svg className="w-3.5 h-3.5 text-[#0088D6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className="bg-[#F8FAFC] border border-slate-200 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
                        <svg className="w-3.5 h-3.5 text-[#D81B60]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.commitment}
                      </span>
                    </div>

                    {/* Summary */}
                    <p className="text-sm text-[#475569] leading-relaxed mb-6">
                      {stripHtml(job.summary)}
                    </p>
                  </div>

                  {/* View Details Button */}
                  <div className="pt-4 border-t border-[#F1F5F9]">
                    <Link
                      href={`/get-involved/${job.slug}`}
                      className="text-[#D81B60] w-full pt-3 text-right text-xs font-bold inline-flex items-end justify-end gap-2 transition-all"
                    >
                      <span>View Role Details &amp; Apply</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredCareers.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E8F0]">
              <p className="text-base text-[#64748B]">No roles currently listed in this category.</p>
              <button
                type="button"
                onClick={() => setActiveFilter("All")}
                className="btn-rose text-xs font-bold px-6 py-2.5 rounded-full inline-block mt-4"
              >
                View All Opportunities
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. GENERAL TALENT & VOLUNTEER REGISTRATION ── */}
      <section className="py-20 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-2">
            Spontaneous Applications
          </span>
          <h2 className="text-3xl font-extrabold text-[#0D2B59] tracking-tight mb-4">
            Don&apos;t See Your Exact Role?
          </h2>
          <p className="text-base text-[#475569] leading-relaxed max-w-2xl mx-auto mb-8">
            We are always eager to connect with clinicians, health informatics engineers, monitoring and evaluation experts, and storytellers passionate about African maternal health. Send your CV and a brief introduction to our talent team.
          </p>

          <a
            href="mailto:careers@maternalinitiativeafrica.org?subject=General%20Talent%20Inquiry%20-%20MIA"
            className="btn-navy px-8 py-3.5 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <span>Send Spontaneous Application via Email</span>
            <span>✉</span>
          </a>
        </div>
      </section>
    </div>
  );
}
