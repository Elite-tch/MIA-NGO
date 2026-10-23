import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoredCareers } from "../../lib/db";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const careers = await getStoredCareers();
  return careers.map((job) => ({
    slug: job.slug,
  }));
}

function parseMarkdown(str: string): string {
  return str
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#0088D6] underline font-semibold">$1</a>');
}

function renderFormatted(text: string) {
  if (!text) return null;
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return (
      <div
        className="space-y-3 [&_b]:font-bold [&_strong]:font-bold [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-[#0D2B59] [&_h3]:text-lg [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#0088D6] [&_blockquote]:pl-3 [&_blockquote]:italic [&_a]:text-[#0088D6] [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <span key={idx} className="block h-2" />;
        return (
          <span key={idx} className="block mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: parseMarkdown(line) }} />
        );
      })}
    </>
  );
}

export default async function CareerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const allCareers = await getStoredCareers();
  const role = allCareers.find((j) => j.slug === slug);

  if (!role) {
    notFound();
  }

  const mailtoSubject = encodeURIComponent(`Application for ${role.title} — MIA`);
  const mailtoBody = encodeURIComponent(
    `Dear Maternal Initiative Africa Recruitment Team,\n\nI am writing to apply for the position of "${role.title}" (${role.type} Opportunity).\n\nPlease find attached my CV/resume and summary of clinical/operational qualifications.\n\nFull Name:\nPhone Number:\nCountry of Residence:\n\nThank you for considering my application.`
  );
  const applicationMailto = `mailto:${role.applyEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <div className="bg-white">
      {/* ── 1. ROLE HEADER / BREADCRUMB ── */}
      <section className="bg-white border-b border-[#E2E8F0] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] mb-6">
            <Link href="/" className="hover:text-[#0D2B59] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/get-involved" className="hover:text-[#0D2B59] transition-colors">
              Careers & Volunteering
            </Link>
            <span>/</span>
            <span className="text-[#0D2B59] truncate max-w-[200px] sm:max-w-none">
              {role.title}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full text-white ${
                role.type === "Paid"
                  ? "bg-[#0D2B59]"
                  : role.type === "Volunteer"
                  ? "bg-[#D81B60]"
                  : "bg-[#0088D6]"
              }`}
            >
              {role.type} Position
            </span>
            <span className="text-xs font-semibold text-[#64748B]">
              Application Deadline: {role.deadline}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0D2B59] tracking-tight leading-tight mb-4">
            {role.title}
          </h1>

          <p className="text-sm font-bold text-[#0088D6] uppercase tracking-wider mb-6">
            Department: {role.department}
          </p>

          {/* Key Metadata Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[#E2E8F0] text-xs font-semibold text-[#475569]">
            <span className="bg-[#F8FAFC] border border-slate-200 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4 text-[#0088D6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{role.location}</span>
            </span>
            <span className="bg-[#F8FAFC] border border-slate-200 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4 text-[#D81B60]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{role.commitment}</span>
            </span>
            <span className="bg-[#F8FAFC] border border-slate-200 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4 text-[#0D2B59]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{role.applyEmail}</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. ROLE DETAILS & DESCRIPTION ── */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded p-8 sm:p-12 border border-[#E2E8F0] shadow space-y-10">
            
            {/* Overview */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D2B59] mb-4">
                About the Role
              </h2>
              <div className="text-base text-[#475569] leading-relaxed">
                {renderFormatted(role.aboutRole)}
              </div>
            </div>

            {/* Responsibilities */}
            <div className="pt-8 border-t border-[#E2E8F0]">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D2B59] mb-4">
                Key Responsibilities & Duties
              </h2>
              <div className="space-y-3">
                {role.responsibilities.map((resp) => (
                  <div key={resp} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-[#0088D6] shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-[#334155] leading-relaxed">
                      {resp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="pt-8 border-t border-[#E2E8F0]">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D2B59] mb-4">
                Required Qualifications & Experience
              </h2>
              <div className="space-y-3">
                {role.requirements.map((req) => (
                  <div key={req} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-[#D81B60] shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-[#334155] leading-relaxed">
                      {req}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Action Card with Solid Background Button linking to Email */}
            <div className="pt-8 border-t border-[#E2E8F0]">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0D2B59] to-[#103A75] text-white space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-extrabold text-white">
                    Ready to Apply for this Position?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-md leading-relaxed">
                    Click the button to prepare your application email directly to our talent team at <span className="text-[#0088D6] font-semibold">{role.applyEmail}</span>. Attach your updated CV and professional credentials.
                  </p>
                </div>

                <a
                  href={applicationMailto}
                  className="btn-rose px-8 py-3.5 rounded-full text-sm font-bold shrink-0 shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
                >
                  <span>Apply via Email</span>
                  <span>✉</span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Navigation */}
          <div className="mt-10 flex items-center justify-between">
            <Link
              href="/get-involved"
              className="btn-outline-navy px-6 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-2"
            >
              <span>← Back to All Roles</span>
            </Link>
            <Link
              href="/contact"
              className="text-xs font-bold text-[#0088D6] hover:underline"
            >
              Have Questions? Contact Recruitment →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
