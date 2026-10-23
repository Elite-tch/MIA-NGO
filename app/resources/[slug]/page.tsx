import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getStoredResources } from "../../lib/db";
import { stripHtml } from "../../lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const resources = await getStoredResources();
  return resources.map((res) => ({
    slug: res.slug,
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
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
          const content = trimmed.replace(/^[-*•]\s+/, "");
          return (
            <span key={idx} className="flex items-start gap-2 my-1">
              <span className="text-[#0088D6] font-bold mt-0.5">&bull;</span>
              <span dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} />
            </span>
          );
        }
        return (
          <span key={idx} className="block mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: parseMarkdown(line) }} />
        );
      })}
    </>
  );
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const allResources = await getStoredResources();
  const post = allResources.find((r) => r.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = allResources
    .filter((r) => r.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="bg-white">
      {/* ── 1. ARTICLE HEADER / BREADCRUMB ── */}
      <section className="bg-white border-b border-[#E2E8F0] py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] mb-6">
            <Link href="/" className="hover:text-[#0D2B59] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/resources" className="hover:text-[#0D2B59] transition-colors">
              Resources & Insights
            </Link>
            <span>/</span>
            <span className="text-[#0D2B59] truncate max-w-[200px] sm:max-w-none">
              {post.title}
            </span>
          </div>

          <span className="inline-block bg-[#D81B60] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-4">
            {post.tag}
          </span>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0D2B59] tracking-tight leading-[1.2] mb-6">
            {post.title}
          </h1>

          {/* Author and Publishing Meta */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#E2E8F0] text-xs sm:text-sm text-[#475569]">
            <div>
              <span className="font-bold text-[#0D2B59]">{post.author.name}</span>
              <span className="text-[#64748B] block text-xs">{post.author.role}</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <span className="text-[#64748B]">{post.date}</span>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <span className="text-[#0088D6] font-semibold">{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* ── 2. FEATURED IMAGE ── */}
      <div className="max-w-4xl mx-auto md:mx-14 px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-12">
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-xl bg-slate-900">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 900px"
            unoptimized={post.image.startsWith("data:")}
          />
        </div>
      </div>

      {/* ── 3. ARTICLE CONTENT ── */}
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Lead Introduction */}
        <div className="text-lg sm:text-xl text-[#1E293B] font-medium leading-relaxed mb-10 pb-8 border-b border-[#E2E8F0]">
          {renderFormatted(post.content.intro)}
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-base text-[#334155] leading-relaxed">
          {post.content.sections.map((sec) => (
            <section key={sec.heading} className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D2B59] tracking-tight">
                {sec.heading}
              </h2>
              <div className="text-base text-[#475569] leading-relaxed">
                {renderFormatted(sec.body)}
              </div>
            </section>
          ))}
        </div>

        {/* Key Takeaways Callout Box */}
        {post.content.takeaways && post.content.takeaways.length > 0 && (
          <div className="mt-14 p-6 sm:p-8 bg-[#F8FAFC] border-l-4 border-[#0088D6] rounded-r-2xl border-y border-r border-[#E2E8F0]">
            <h3 className="text-base font-extrabold text-[#0D2B59] uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0088D6]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Key Clinical & Community Takeaways</span>
            </h3>
            <ul className="space-y-2.5">
              {post.content.takeaways.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#334155] font-medium">
                  <span className="text-[#0088D6] font-bold mt-0.5">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation & Action Buttons */}
        <div className="mt-14 pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/resources"
            className="btn-outline-navy px-6 py-3 rounded-full text-xs font-bold inline-flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <span>← Back to All Resources</span>
          </Link>
          <Link
            href="/contact"
            className="btn-rose px-6 py-3 rounded-full text-xs font-bold inline-flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <span>Inquire About Clinical Resources</span>
            <span>→</span>
          </Link>
        </div>
      </article>

      {/* ── 4. RELATED ARTICLES ── */}
      <section className="py-16 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0D2B59]">
              More From Our Knowledge Hub
            </h3>
            <Link href="/resources" className="text-xs font-bold text-[#0088D6] hover:underline">
              View All Resources →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((item) => (
              <article
                key={item.id}
                className="group bg-white rounded overflow-hidden border border-[#E2E8F0]  hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover object-center transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute bottom-2.5 left-3">
                      <span className="bg-[#D81B60] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-sm font-bold text-[#0D2B59] leading-snug group-hover:text-[#0088D6] transition-colors mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#64748B] line-clamp-2">
                      {stripHtml(item.summary)}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-1">
                  <Link
                    href={`/resources/${item.slug}`}
                    className="btn-rose w-full text-center py-2.5 rounded-xl text-xs font-bold inline-block"
                  >
                    Read Article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
