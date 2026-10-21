import Link from "next/link";

export default function GetInvolved_Page() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F8FAFC] px-4 text-center">
      <span className="text-[#D81B60] text-xs font-bold uppercase tracking-widest mb-4">
        Get Involved
      </span>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0D2B59] leading-tight mb-4">
        Coming Soon
      </h1>
      <p className="text-base text-[#64748B] max-w-md leading-relaxed mb-8">
        This page is currently being developed. We're working hard to bring you something great.
      </p>
      <Link
        href="/"
        className="btn-rose px-7 py-3.5 rounded-full text-sm font-bold inline-flex items-center gap-2"
      >
        <span>Back to Home</span>
        <span>→</span>
      </Link>
    </div>
  );
}
