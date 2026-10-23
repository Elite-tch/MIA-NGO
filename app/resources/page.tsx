"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { stripHtml, sortByLatest } from "../lib/utils";

interface ResourceItem {
  id: string;
  slug: string;
  title: string;
  tag: string;
  date: string;
  readTime: string;
  image: string;
  summary: string;
  author: { name: string; role: string };
  status?: "published" | "draft";
}

type CategoryFilter = "All" | "Health Education" | "Clinical Brief" | "Field Research" | "News & Campaigns";

export default function ResourcesPage() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("All");
  const [allResources, setAllResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "ok" | "err">("idle");
  const [subscribeMsg, setSubscribeMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setSubscribing(true);
    setSubscribeStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "Newsletter: MIA Quarterly Field Reports",
          email: newsletterEmail,
          subject: `Newsletter Subscription: ${newsletterEmail}`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribeStatus("ok");
        setSubscribeMsg("Thank you! You are now subscribed to MIA Field Reports.");
        setNewsletterEmail("");
      } else {
        setSubscribeStatus("err");
        setSubscribeMsg(data.error || "Subscription failed. Please try again.");
      }
    } catch {
      setSubscribeStatus("err");
      setSubscribeMsg("Connection error. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  useEffect(() => {
    fetch("/api/resources")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setAllResources(sortByLatest(list));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories: CategoryFilter[] = [
    "All",
    "Health Education",
    "Clinical Brief",
    "Field Research",
    "News & Campaigns",
  ];

  const publicResources = allResources.filter((item) => item.status !== "draft");
  const filteredResources =
    activeFilter === "All"
      ? publicResources
      : publicResources.filter((item) => item.tag === activeFilter);

  return (
    <div className="bg-white">
      {/* ── 1. HERO SECTION ── */}
      <section className="bg-white border-b border-[#E2E8F0] py-14 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-3">
              MIA Knowledge & Updates
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D2B59] tracking-tight leading-tight mb-5">
              Resources, Health Education & Field Insights
            </h1>
            <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
              Explore evidence-based clinical guides for healthcare workers, maternal literacy resources for mothers, epidemiological field reports, and the latest news from Maternal Initiative Africa.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="mt-10 pt-6 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#0D2B59] uppercase tracking-wider">
                Filter by Category:
              </span>
              <span className="text-xs text-[#64748B]">
                Showing {filteredResources.length} of {allResources.length} articles
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = activeFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#0D2B59] text-white shadow-sm"
                        : "bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] hover:border-[#0088D6] hover:text-[#0088D6]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. RESOURCES GRID ── */}
      <section className="py-14 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map((n) => (
                <div key={n} className="bg-white rounded border border-[#E2E8F0] animate-pulse h-72" />
              ))}
            </div>
          )}

          {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((item) => (
              <article
                key={item.id}
                className="group bg-white rounded overflow-hidden border border-[#E2E8F0] hover:shadow-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Tag inside at the bottom */}
                  <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover object-center transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                    
                    {/* Tag badge placed inside image at bottom */}
                    <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between">
                      <span className="bg-[#D81B60] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        {item.tag}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-200">
                        {item.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Content below the image */}
                  <div className="p-6">
                    <p className="text-xs text-[#64748B] mb-2 font-medium">
                      Published {item.date} &bull; By {item.author.name}
                    </p>
                    <h2 className="text-lg font-bold text-[#0D2B59] leading-snug group-hover:text-[#0088D6] transition-colors mb-3">
                      {item.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-3">
                      {stripHtml(item.summary)}
                    </p>
                  </div>
                </div>

                {/* Read More Button with background color */}
                <div className="px-6 pb-6 flex justify-end items-end pt-2 border-t border-[#F1F5F9]">
                  <Link
                    href={`/resources/${item.slug}`}
                    className="text-[#D81B60] w-full pt-3 text-right text-xs font-bold inline-flex items-end justify-end gap-2 transition-all"
                  >
                    <span>Read Full Article</span>
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
          )}

          {!loading && filteredResources.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E8F0]">
              <p className="text-base text-[#64748B]">No articles found in this category.</p>
              <button
                type="button"
                onClick={() => setActiveFilter("All")}
                className="btn-rose text-xs font-bold px-6 py-2.5 rounded-full inline-block mt-4"
              >
                View All Articles
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. NEWSLETTER / PUBLICATION SUBSCRIPTION ── */}
      <section className="py-20 bg-gradient-to-br from-[#0D2B59] to-[#103A75] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="text-[#0088D6] text-xs font-bold uppercase tracking-widest">
              Stay Informed
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Receive MIA Quarterly Field Reports
            </h2>
            <p className="text-base text-slate-200 leading-relaxed">
              Subscribe to get frontline clinical updates, maternal health research publications, and field outreach reports delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    setSubscribeStatus("idle");
                  }}
                  placeholder="Enter your email address"
                  className="w-full px-5 py-3.5 bg-white text-[#0D2B59] rounded-full text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0088D6]"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="btn-rose px-7 py-3.5 rounded-full text-sm font-bold shrink-0 w-full sm:w-auto disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {subscribing ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <span>Subscribe</span>
                  )}
                </button>
              </div>

              {subscribeStatus === "ok" && (
                <p className="text-[#0088D6] bg-white text-xs font-bold px-4 py-1.5 rounded-full inline-block mt-3 shadow-sm">
                  ✓ {subscribeMsg}
                </p>
              )}
              {subscribeStatus === "err" && (
                <p className="text-rose-300 text-xs font-semibold mt-3">
                  {subscribeMsg}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
