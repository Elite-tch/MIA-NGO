import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Our Programs | Maternal Initiative Africa (MIA)",
  description:
    "Explore Maternal Initiative Africa's nurse-led programs: Telehealth & Digital Support, Community Outreach, Health Education, Data Research, and Maternal Mental Health.",
};

const programsList = [
  {
    id: "telehealth",
    number: "01",
    tag: "Digital Health & Telemedicine",
    title: "Telehealth & Digital Clinical Support",
    tagline: "Bridging the Distance Gap with Mobile Consultations",
    desc: "In rural communities where the nearest hospital is hours away, timely clinical triage is the difference between survival and tragedy. MIA leverages low-bandwidth, accessible mobile platforms to connect pregnant mothers and frontline midwives with specialized obstetric nurses and clinical consultants in real time.",
    deliverables: [
      "Real-time remote triage and clinical risk assessment",
      "Direct guidance for rural midwives during complicated deliveries",
      "Automated appointment and vaccination SMS reminders for mothers",
      "Continuous postnatal wellness follow-ups via phone and messaging",
    ],
    image: "/outreach/outreach-3.jpg",
    alt: "Nurse conducting digital telehealth consultation",
  },
  {
    id: "outreach",
    number: "02",
    tag: "Field Healthcare Delivery",
    title: "Community Outreach & Mobile Clinics",
    tagline: "Delivering Healthcare Directly to Hard-to-Reach Villages",
    desc: "MIA mobile outreach teams bring skilled clinical care to the doorstep of remote settlements. Equipped with diagnostic tools, maternal health kits, and emergency transport linkages, our nurses conduct community-wide prenatal screenings, high-risk identification, and health promotion.",
    deliverables: [
      "Mobile antenatal screening clinics in underserved villages",
      "Distribution of clean delivery kits containing sterile supplies",
      "Emergency referral linkages with regional referral hospitals",
      "Household-level health surveillance and postnatal checkups",
    ],
    image: "/outreach/outreach-5.jpg",
    alt: "MIA mobile clinic distributing maternal health supplies",
  },
  {
    id: "education",
    number: "03",
    tag: "Capacity Building & Training",
    title: "Health Education & Nurse Upskilling",
    tagline: "Sharing Clinical Knowledge that Saves Lives",
    desc: "Empowerment begins with education. We provide culturally respectful, interactive maternal literacy workshops for expectant mothers, alongside specialized clinical masterclasses for community nurses, traditional birth attendants, and midwives.",
    deliverables: [
      "Community workshops on danger signs during pregnancy and labor",
      "Nutritional guidance and anemia prevention sessions",
      "Clinical training in neonatal resuscitation and hemorrhage management",
      "Peer mentorship and supportive supervision for frontline midwives",
    ],
    image: "/outreach/outreach-2.jpg",
    alt: "Nurse educating village mothers on maternal health",
  },
  {
    id: "research",
    number: "04",
    tag: "Epidemiology & Policy",
    title: "Community-Level Data & Research",
    tagline: "Turning Grassroots Challenges Into Actionable Evidence",
    desc: "Reliable data is essential for saving lives and attracting institutional resources. MIA gathers frontline maternal and infant health indicators to identify clinical bottlenecks, evaluate intervention outcomes, and advocate for evidence-informed health policies.",
    deliverables: [
      "Systematic tracking of antenatal attendance and maternal outcomes",
      "Community health assessments identifying referral delay factors",
      "Quarterly data reporting for ministries of health and grant makers",
      "Evidence-based policy briefs advocating for nurse-led investments",
    ],
    image: "/outreach/outreach-4.jpg",
    alt: "Postnatal care and clinical documentation",
  },
  {
    id: "mental-health",
    number: "05",
    tag: "Psychosocial Support",
    title: "Maternal Mental Health & Wellbeing",
    tagline: "Caring for the Mother Beyond Physical Childbirth",
    desc: "Maternal distress, antenatal anxiety, and postpartum depression are critically under-diagnosed across Sub-Saharan Africa. MIA integrates mental health screening into routine maternal checkups, providing compassionate counseling, peer support circles, and specialized clinical referrals.",
    deliverables: [
      "Routine screening for postpartum depression and anxiety",
      "Community peer-support circles led by trained nurse counselors",
      "Destigmatization campaigns addressing maternal psychological distress",
      "Psychosocial referral pathways for severe clinical conditions",
    ],
    image: "/outreach/outreach-1.jpg",
    alt: "Nurse providing supportive clinical checkup to mother",
  },
];

export default function ProgramsPage() {
  return (
    <div className="bg-white">
      {/* ── 1. HERO SECTION ── */}
      <section className="bg-white border-b border-[#E2E8F0] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest block mb-3">
              MIA Programs & Projects
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D2B59] tracking-tight leading-tight mb-5">
              A Comprehensive Approach to Maternal & Child Survival
            </h1>
            <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
              Every program we run is nurse-led, evidence-based, and built in partnership with local communities. We respond directly to the systemic, logistical, and clinical barriers that jeopardize mothers and newborns across Sub-Saharan Africa.
            </p>
          </div>

          {/* Quick Jump Navigator */}
          <div className="mt-10 flex flex-wrap gap-2 pt-6 border-t border-[#E2E8F0]">
            {programsList.map((prog) => (
              <a
                key={prog.id}
                href={`#${prog.id}`}
                className="px-4 py-2 bg-[#F8FAFC] hover:bg-[#0D2B59] hover:text-white border border-[#CBD5E1] text-[#0D2B59] rounded-full text-xs font-bold transition-all"
              >
                {prog.number}. {prog.title.split("&")[0]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. DETAILED PROGRAM SECTIONS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {programsList.map((prog, index) => {
            const isEven = index % 2 === 1;
            return (
              <article
                key={prog.id}
                id={prog.id}
                className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-6 border-t border-[#E2E8F0] first:border-t-0 first:pt-0"
              >
                {/* Text Content */}
                <div className={`lg:col-span-7 space-y-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-[#0088D6] font-mono">
                      {prog.number}
                    </span>
                    <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest">
                      {prog.tag}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D2B59] tracking-tight">
                    {prog.title}
                  </h2>
                  <p className="text-base text-[#D81B60] font-semibold">
                    {prog.tagline}
                  </p>
                  <p className="text-base text-[#475569] leading-relaxed">
                    {prog.desc}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold text-[#0D2B59] uppercase tracking-wider">
                      Key Interventions & Deliverables:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {prog.deliverables.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                        >
                          <svg className="w-4 h-4 text-[#0088D6] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-xs text-[#334155] leading-snug font-medium">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/partnerships"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#0D2B59] hover:text-[#0088D6] border-b-2 border-[#0088D6] pb-0.5 transition-colors"
                    >
                      <span>Support or Fund this Program</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>

                {/* Visual Image */}
                <div className={`lg:col-span-5 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-md bg-slate-900 group">
                    <Image
                      src={prog.image}
                      alt={prog.alt}
                      fill
                      className="object-cover object-center transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 500px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D2B59]/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] font-bold text-[#0D2B59] bg-white/95 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                        {prog.tag}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── 3. PAN-AFRICAN INTEGRATION STRIP ── */}
      <section className="py-20 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest">
              Integrated Model
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D2B59] tracking-tight">
              Powered by the Africa Nurses Network
            </h2>
            <p className="text-base text-[#475569] leading-relaxed">
              Our 5 core programs do not operate in isolation. They are driven on the ground by nurses and midwives connected through our continental peer network &mdash; sharing clinical protocols, case studies, and maternal emergency triage across national borders.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/nurses-network"
                className="btn-rose px-7 py-3.5 rounded-full text-sm font-bold"
              >
                Explore Africa Nurses Network
              </Link>
              <Link
                href="/partnerships"
                className="btn-outline-navy px-7 py-3.5 rounded-full text-sm font-bold"
              >
                Partner with MIA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. CTA BANNER (Landing Page Navy Gradient) ── */}
      <section className="py-20 bg-gradient-to-br from-[#0D2B59] to-[#103A75] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="text-[#0088D6] text-xs font-bold uppercase tracking-widest">
              Grant & Funding Inquiries
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Direct Your Support to High-Impact Clinical Programs
            </h2>
            <p className="text-base text-slate-200 leading-relaxed">
              MIA provides institutional grant makers and philanthropic partners with verified programmatic tracking, transparent governance, and measurable health outcomes.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="bg-white text-[#0D2B59] hover:bg-slate-100 px-8 py-3.5 rounded-full text-sm font-bold transition-colors inline-block"
              >
                Discuss Programmatic Funding
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
