"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Slide {
  id: number;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
}

const outreachSlides: Slide[] = [
  {
    id: 1,
    image: "/outreach/outreach-1.jpg",
    tag: "Antenatal Care",
    title: "Community Antenatal Screenings",
    subtitle: "Nurse-led prenatal checkups for rural expectant mothers",
  },
  {
    id: 2,
    image: "/outreach/outreach-2.jpg",
    tag: "Health Education",
    title: "Maternal Health & Nutrition Workshops",
    subtitle: "Empowering village mothers with vital care education",
  },
  {
    id: 3,
    image: "/outreach/outreach-3.jpg",
    tag: "Telehealth",
    title: "Digital Telehealth Consultations",
    subtitle: "Real-time clinical telemedicine bridging the distance gap",
  },
  {
    id: 4,
    image: "/outreach/outreach-4.jpg",
    tag: "Maternity",
    title: "Safe Delivery & Postnatal Care",
    subtitle: "Skilled bedside nursing support for mothers and newborns",
  },
  {
    id: 5,
    image: "/outreach/outreach-5.jpg",
    tag: "Field Supplies",
    title: "Maternal Health Kit Distribution",
    subtitle: "Providing clean birth supplies, vitamins, and supplements",
  },
  {
    id: 6,
    image: "/outreach/outreach-6.jpg",
    tag: "Pan-African",
    title: "Nurse Network & Community Outreach",
    subtitle: "Mobilising frontline healthcare workers across rural Africa",
  },
];

export default function ImpactGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  // Responsive visible count: 4 on desktop, 2 on tablet, 1 on mobile
  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(4);
      } else if (window.innerWidth >= 640) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const maxIndex = Math.max(0, outreachSlides.length - visibleCount);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goToSlide = (idx: number) => {
    const target = Math.min(idx, maxIndex);
    setActiveIndex(target);
  };

  return (
    <section className="py-16 sm:py-20 bg-[#F8FAFC] border-y border-[#E2E8F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header with Left Label and Right Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-2">
              Field Impact & Community Outreach
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D2B59] tracking-tight">
              Evidence of Our Work Across Communities
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#64748B]">
              Showing {activeIndex + 1}–{Math.min(activeIndex + visibleCount, outreachSlides.length)} of {outreachSlides.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous outreach images"
                className="w-10 h-10 rounded-full border border-[#CBD5E1] bg-white hover:bg-[#0D2B59] hover:text-white text-[#0D2B59] shadow-sm flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next outreach images"
                className="w-10 h-10 rounded-full border border-[#CBD5E1] bg-white hover:bg-[#0D2B59] hover:text-white text-[#0D2B59] shadow-sm flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 4-Item Sliding Grid Track */}
        <div className="relative overflow-hidden -mx-2 sm:-mx-2.5">
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: `translateX(-${activeIndex * (100 / visibleCount)}%)`,
            }}
          >
            {outreachSlides.map((slide) => (
              <div
                key={slide.id}
                className="w-full sm:w-1/2 lg:w-1/4 shrink-0 px-2 sm:px-2.5"
              >
                <div className="group relative bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                  {/* Image container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover object-center  transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#0D2B59] text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                      {slide.tag}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#0D2B59] leading-snug group-hover:text-[#D81B60] transition-colors">
                        {slide.title}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed line-clamp-2">
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Small Thumbnail Pagination (Miniature Images, NOT dots) */}
        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            {outreachSlides.map((slide, idx) => {
              // Highlight the thumbnail if it is within the currently visible window
              const isVisibleInWindow = idx >= activeIndex && idx < activeIndex + visibleCount;
              const isLead = idx === activeIndex;

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to ${slide.title}`}
                  className={`relative w-12 h-8 sm:w-14 sm:h-9 rounded-md overflow-hidden transition-all duration-200 cursor-pointer ${
                    isLead
                      ? "ring-2 ring-[#D81B60] ring-offset-2 scale-105 opacity-100 shadow-md"
                      : isVisibleInWindow
                      ? "ring-1 ring-[#0088D6] opacity-80"
                      : "opacity-40 hover:opacity-85 border border-slate-300"
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover object-center"
                    sizes="56px"
                  />
                </button>
              );
            })}
          </div>
          <span className="text-[11px] text-[#94A3B8] font-medium tracking-wide">
            Click thumbnail or arrows to view more outreaches
          </span>
        </div>

      </div>
    </section>
  );
}
