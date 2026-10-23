"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import FormattedTextarea from "../components/FormattedTextarea";
import ImageUpload from "../components/ImageUpload";
import { sortByLatest } from "../../lib/utils";

/** Strip HTML tags for plain-text card previews (Quill stores HTML) */
function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")   // replace tags with space
    .replace(/&nbsp;/g, " ")    // decode common entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")       // collapse whitespace
    .trim();
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface ResourceItem {
  id: string;
  slug: string;
  title: string;
  tag: "Health Education" | "Clinical Brief" | "Field Research" | "News & Campaigns";
  date: string;
  readTime: string;
  image: string;
  summary: string;
  status?: "published" | "draft";
  author: { name: string; role: string };
  content: {
    intro: string;
    sections: { heading: string; body: string }[];
    takeaways: string[];
  };
}

interface CareerItem {
  id: string;
  slug: string;
  title: string;
  type: "Paid" | "Volunteer" | "Fellowship";
  department: string;
  location: string;
  commitment: string;
  applyEmail: string;
  deadline: string;
  summary: string;
  status?: "published" | "draft";
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
}

type AdminView =
  | "overview"
  | "create-post"
  | "created-posts"
  | "create-career"
  | "created-careers"
  | "edit-post"
  | "edit-career";

const CATEGORY_TAGS: ResourceItem["tag"][] = [
  "Health Education",
  "Clinical Brief",
  "Field Research",
  "News & Campaigns",
];

const COMMITMENT_OPTIONS = [
  "Full-Time",
  "Part-Time",
  "Contract (6-12 Mos)",
  "Volunteer",
  "Remote / Fellowship",
];

function splitLines(val: string): string[] {
  return val
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export default function AdminDashboard() {
  const router = useRouter();

  // Navigation state
  const [view, setView] = useState<AdminView>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data state
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [careers, setCareers] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Search & Filter state for listings
  const [postSearch, setPostSearch] = useState("");
  const [postStatusFilter, setPostStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [careerSearch, setCareerSearch] = useState("");
  const [careerTypeFilter, setCareerTypeFilter] = useState<"all" | "Paid" | "Volunteer" | "Fellowship">("all");
  const [careerStatusFilter, setCareerStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "post" | "career";
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: "post",
    id: "",
    title: "",
  });
  const [deleting, setDeleting] = useState(false);

  // ── Resource Form State (Create & Edit) ────────────────────────────────────
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [rTitle, setRTitle] = useState("");
  const [rTag, setRTag] = useState<ResourceItem["tag"]>("Health Education");
  const [rSummary, setRSummary] = useState("");
  const [rImage, setRImage] = useState("");
  const [rAuthorName, setRAuthorName] = useState("");
  const [rAuthorRole, setRAuthorRole] = useState("");
  const [rReadTime, setRReadTime] = useState("5 min read");
  const [rIntro, setRIntro] = useState("");
  const [rSections, setRSections] = useState([{ heading: "", body: "" }]);
  const [rTakeaways, setRTakeaways] = useState("");
  const [rStatus, setRStatus] = useState<"published" | "draft">("published");

  // ── Career Form State (Create & Edit) ──────────────────────────────────────
  const [editingCareerId, setEditingCareerId] = useState<string | null>(null);
  const [cTitle, setCTitle] = useState("");
  const [cType, setCType] = useState<CareerItem["type"]>("Paid");
  const [cDept, setCDept] = useState("");
  const [cLocation, setCLocation] = useState("");
  const [cCommit, setCCommit] = useState("Full-Time");
  const [cEmail, setCEmail] = useState("");
  const [cDeadline, setCDeadline] = useState("");
  const [cSummary, setCSummary] = useState("");
  const [cAbout, setCAbout] = useState("");
  const [cResponsibilities, setCResponsibilities] = useState("");
  const [cRequirements, setCRequirements] = useState("");
  const [cStatus, setCStatus] = useState<"published" | "draft">("published");

  // ── Auth Guard (Server-verified HTTP-only session) ───────────────────────
  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          sessionStorage.removeItem("mia_admin_auth");
          router.replace("/admin");
        }
      })
      .catch(() => {
        if (sessionStorage.getItem("mia_admin_auth") !== "true") {
          router.replace("/admin");
        }
      });
  }, [router]);

  // ── Load Initial Data ─────────────────────────────────────────────────────
  async function fetchData() {
    setLoading(true);
    try {
      const [rRes, cRes] = await Promise.all([
        fetch("/api/resources"),
        fetch("/api/careers"),
      ]);
      const [rData, cData] = await Promise.all([rRes.json(), cRes.json()]);
      setResources(sortByLatest(Array.isArray(rData) ? rData : []));
      setCareers(sortByLatest(Array.isArray(cData) ? cData : []));
    } catch {
      showToast("Failed to fetch records from storage", "err");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // ── Toast Helper ──────────────────────────────────────────────────────────
  function showToast(msg: string, type: "ok" | "err") {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    sessionStorage.removeItem("mia_admin_auth");
    router.replace("/admin");
  }

  // ── Delete Modal Handlers ─────────────────────────────────────────────────
  function openDeleteModal(type: "post" | "career", id: string, title: string) {
    setDeleteModal({ isOpen: true, type, id, title });
  }

  function closeDeleteModal() {
    setDeleteModal({ isOpen: false, type: "post", id: "", title: "" });
    setDeleting(false);
  }

  async function confirmDelete() {
    if (!deleteModal.id) return;
    setDeleting(true);
    try {
      if (deleteModal.type === "post") {
        const res = await fetch(`/api/resources?id=${deleteModal.id}`, { method: "DELETE" });
        if (res.ok) {
          setResources((prev) => prev.filter((r) => r.id !== deleteModal.id));
          showToast(`Article "${deleteModal.title}" deleted.`, "ok");
        } else {
          showToast("Failed to delete article.", "err");
        }
      } else {
        const res = await fetch(`/api/careers?id=${deleteModal.id}`, { method: "DELETE" });
        if (res.ok) {
          setCareers((prev) => prev.filter((c) => c.id !== deleteModal.id));
          showToast(`Opportunity "${deleteModal.title}" deleted.`, "ok");
        } else {
          showToast("Failed to delete career opportunity.", "err");
        }
      }
    } catch {
      showToast("Network error while deleting.", "err");
    } finally {
      closeDeleteModal();
    }
  }

  // ── Edit Post Initialization ──────────────────────────────────────────────
  function startEditPost(post: ResourceItem) {
    setEditingPostId(post.id);
    setRTitle(post.title || "");
    setRTag(post.tag || "Health Education");
    setRSummary(post.summary || "");
    setRImage(post.image || "");
    setRAuthorName(post.author?.name || "");
    setRAuthorRole(post.author?.role || "");
    setRReadTime(post.readTime || "5 min read");
    setRIntro(post.content?.intro || "");
    setRSections(
      post.content?.sections && post.content.sections.length > 0
        ? post.content.sections
        : [{ heading: "", body: "" }]
    );
    setRTakeaways((post.content?.takeaways || []).join("\n"));
    setRStatus(post.status === "draft" ? "draft" : "published");
    setView("edit-post");
  }

  // ── Edit Career Initialization ────────────────────────────────────────────
  function startEditCareer(career: CareerItem) {
    setEditingCareerId(career.id);
    setCTitle(career.title || "");
    setCType(career.type || "Paid");
    setCDept(career.department || "");
    setCLocation(career.location || "");
    setCCommit(career.commitment || "Full-Time");
    setCEmail(career.applyEmail || "");
    setCDeadline(career.deadline || "");
    setCSummary(career.summary || "");
    setCAbout(career.aboutRole || "");
    setCResponsibilities((career.responsibilities || []).join("\n"));
    setCRequirements((career.requirements || []).join("\n"));
    setCStatus(career.status === "draft" ? "draft" : "published");
    setView("edit-career");
  }

  // ── Reset Form States ─────────────────────────────────────────────────────
  function resetResourceForm() {
    setEditingPostId(null);
    setRTitle("");
    setRTag("Health Education");
    setRSummary("");
    setRImage("");
    setRAuthorName("");
    setRAuthorRole("");
    setRReadTime("5 min read");
    setRIntro("");
    setRSections([{ heading: "", body: "" }]);
    setRTakeaways("");
    setRStatus("published");
  }

  function resetCareerForm() {
    setEditingCareerId(null);
    setCTitle("");
    setCType("Paid");
    setCDept("");
    setCLocation("");
    setCCommit("Full-Time");
    setCEmail("");
    setCDeadline("");
    setCSummary("");
    setCAbout("");
    setCResponsibilities("");
    setCRequirements("");
    setCStatus("published");
  }

  // ── Save or Update Resource ───────────────────────────────────────────────
  async function handleSaveResource(targetStatus?: "published" | "draft") {
    if (!rTitle.trim() || !rSummary.trim()) {
      showToast("Title and summary are required.", "err");
      return;
    }

    setSaving(true);
    const finalStatus = targetStatus || rStatus;
    const cleanSections = rSections.filter((s) => s.heading.trim() && s.body.trim());

    const payload = {
      id: editingPostId || undefined,
      title: rTitle.trim(),
      tag: rTag,
      summary: rSummary.trim(),
      image: rImage || "/outreach/outreach-1.jpg",
      authorName: rAuthorName.trim() || "MIA Clinical Communications",
      authorRole: rAuthorRole.trim() || "Editorial & Medical Team",
      readTime: rReadTime.trim() || "5 min read",
      intro: rIntro.trim() || rSummary.trim(),
      sections: cleanSections.length > 0 ? cleanSections : undefined,
      takeaways: splitLines(rTakeaways),
      status: finalStatus,
    };

    try {
      const isEdit = Boolean(editingPostId);
      const url = "/api/resources";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.resource) {
        if (isEdit) {
          setResources((prev) =>
            prev.map((item) => (item.id === editingPostId ? data.resource : item))
          );
          showToast(`Article "${data.resource.title}" updated successfully!`, "ok");
        } else {
          setResources((prev) => [data.resource, ...prev]);
          showToast(
            `Article "${data.resource.title}" ${
              finalStatus === "draft" ? "saved as draft" : "published"
            }!`,
            "ok"
          );
        }
        resetResourceForm();
        setView("created-posts");
      } else {
        showToast(data.error || "Failed to save article.", "err");
      }
    } catch {
      showToast("Network error. Please try again.", "err");
    } finally {
      setSaving(false);
    }
  }

  // ── Save or Update Career ─────────────────────────────────────────────────
  async function handleSaveCareer(targetStatus?: "published" | "draft") {
    if (!cTitle.trim() || !cSummary.trim()) {
      showToast("Job title and brief summary are required.", "err");
      return;
    }

    setSaving(true);
    const finalStatus = targetStatus || cStatus;

    const payload = {
      id: editingCareerId || undefined,
      title: cTitle.trim(),
      type: cType,
      department: cDept.trim() || "Clinical & Field Operations",
      location: cLocation.trim() || "Regional Outreach Centers",
      commitment: cCommit.trim() || "Full-Time",
      deadline: cDeadline.trim() || "Rolling Admissions",
      applyEmail:
        cEmail.trim() ||
        (cType === "Volunteer"
          ? "volunteer@maternalinitiativeafrica.org"
          : "careers@maternalinitiativeafrica.org"),
      summary: cSummary.trim(),
      aboutRole: cAbout.trim() || cSummary.trim(),
      responsibilities: splitLines(cResponsibilities),
      requirements: splitLines(cRequirements),
      status: finalStatus,
    };

    try {
      const isEdit = Boolean(editingCareerId);
      const url = "/api/careers";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.career) {
        if (isEdit) {
          setCareers((prev) =>
            prev.map((item) => (item.id === editingCareerId ? data.career : item))
          );
          showToast(`Opportunity "${data.career.title}" updated!`, "ok");
        } else {
          setCareers((prev) => [data.career, ...prev]);
          showToast(
            `Opportunity "${data.career.title}" ${
              finalStatus === "draft" ? "saved as draft" : "posted"
            }!`,
            "ok"
          );
        }
        resetCareerForm();
        setView("created-careers");
      } else {
        showToast(data.error || "Failed to save career opportunity.", "err");
      }
    } catch {
      showToast("Network error. Please try again.", "err");
    } finally {
      setSaving(false);
    }
  }

  // ── Counts for 4 Stat Cards ───────────────────────────────────────────────
  const createdPostsCount = resources.filter((r) => r.status !== "draft").length;
  const createdCareersCount = careers.filter((c) => c.status !== "draft").length;
  const draftPostsCount = resources.filter((r) => r.status === "draft").length;
  const draftCareersCount = careers.filter((c) => c.status === "draft").length;

  // ── Unified History: 5 Latest items across posts & careers ────────────────
  const rawHistory = [
    ...resources.map((r) => ({
      id: r.id,
      kind: "post" as const,
      title: r.title,
      category: r.tag,
      status: r.status === "draft" ? ("draft" as const) : ("published" as const),
      date: r.date || "Recent",
      authorOrDept: r.author?.name || "MIA Clinical Team",
      rawPost: r,
    })),
    ...careers.map((c) => ({
      id: c.id,
      kind: "career" as const,
      title: c.title,
      category: `${c.type} Position`,
      status: c.status === "draft" ? ("draft" as const) : ("published" as const),
      date: c.deadline || "Active",
      authorOrDept: c.department || "Field Ops",
      rawCareer: c,
    })),
  ];
  const historyList = sortByLatest(rawHistory).slice(0, 5);

  // ── Filtered Listings ─────────────────────────────────────────────────────
  const filteredPosts = resources.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      r.summary.toLowerCase().includes(postSearch.toLowerCase()) ||
      r.tag.toLowerCase().includes(postSearch.toLowerCase());
    const isDraft = r.status === "draft";
    if (postStatusFilter === "published" && isDraft) return false;
    if (postStatusFilter === "draft" && !isDraft) return false;
    return matchSearch;
  });

  const filteredCareers = careers.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(careerSearch.toLowerCase()) ||
      c.department.toLowerCase().includes(careerSearch.toLowerCase()) ||
      c.location.toLowerCase().includes(careerSearch.toLowerCase());
    const matchType = careerTypeFilter === "all" || c.type === careerTypeFilter;
    const isDraft = c.status === "draft";
    const matchStatus =
      careerStatusFilter === "all" ||
      (careerStatusFilter === "published" && !isDraft) ||
      (careerStatusFilter === "draft" && isDraft);
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-[#0D2B59]">
      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-3 animate-fade-in transition-all ${
            toast.type === "ok"
              ? "bg-[#0D2B59] text-white border border-[#0088D6]/40"
              : "bg-[#D81B60] text-white border border-rose-300"
          }`}
        >
          {toast.type === "ok" ? (
            <svg className="w-5 h-5 text-[#0088D6] shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#D81B60] flex items-center justify-center shrink-0 border border-rose-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#0D2B59]">Confirm Deletion</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to delete this {deleteModal.type === "post" ? "article" : "opportunity"}?
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Item to be removed
              </p>
              <p className="text-sm font-extrabold text-[#0D2B59] line-clamp-2">
                &ldquo;{deleteModal.title}&rdquo;
              </p>
              <p className="text-[11px] text-[#D81B60] font-semibold mt-2">
                This action is irreversible and will permanently delete the record.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-[#D81B60] hover:bg-[#b5144f] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                {deleting && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                <span>{deleting ? "Deleting..." : "Yes, Delete Permanently"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE BACKDROP OVERLAY ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* ── MOBILE TOP BAR ── */}
      <header className="md:hidden bg-[#0D2B59] text-white px-4 py-3 flex items-center justify-between border-b border-[#103A75] sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-1 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0088D6]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                {view === "overview" && "Platform Overview"}
                {view === "create-post" && "Create News/Education"}
                {view === "created-posts" && "Created Articles"}
                {view === "create-career" && "Add New Career"}
                {view === "created-careers" && "Created Careers"}
                {view === "edit-post" && "Edit Article"}
                {view === "edit-career" && "Edit Career"}
              </span>
            </div>
            <h1 className="text-sm font-extrabold text-white leading-tight">MIA Admin</h1>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="px-2.5 py-1.5 rounded-lg bg-white/10 text-[11px] font-bold text-slate-200 hover:text-white transition-colors"
        >
          Live Site ↗
        </Link>
      </header>

      {/* ── SIDEBAR (DESKTOP + MOBILE DRAWER) ── */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-[#0D2B59] text-white flex flex-col justify-between z-50 md:z-30 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } shadow-2xl md:shadow-none border-r border-[#103A75] overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0088D6]">
                MIA Portal
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                Admin Dashboard
              </h2>
            </div>
          </div>

          {/* Close button for Mobile drawer */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close sidebar menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Nav Items with hidden scrollbar */}
        <nav
          className="flex-1 p-4 space-y-1.5 overflow-y-auto no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Management
          </p>

          {/* 1. Overview */}
          <button
            onClick={() => {
              setView("overview");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
              view === "overview"
                ? "bg-[#0088D6] text-white shadow-lg"
                : "text-slate-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Overview</span>
          </button>

          <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            News & Education
          </p>

          {/* 2. Create News or Education */}
          <button
            onClick={() => {
              resetResourceForm();
              setView("create-post");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
              view === "create-post"
                ? "bg-[#0088D6] text-white shadow-lg"
                : "text-slate-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <svg className="w-4 h-4 text-[#0088D6]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create News or Education</span>
          </button>

          {/* 3. Created News & Education */}
          <button
            onClick={() => {
              setView("created-posts");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
              view === "created-posts" || view === "edit-post"
                ? "bg-[#0088D6] text-white shadow-lg"
                : "text-slate-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span>Created News & Education</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-extrabold">
              {resources.length}
            </span>
          </button>

          <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Careers & Opportunities
          </p>

          {/* 4. Add Careers */}
          <button
            onClick={() => {
              resetCareerForm();
              setView("create-career");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
              view === "create-career"
                ? "bg-[#0088D6] text-white shadow-lg"
                : "text-slate-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Careers</span>
          </button>

          {/* 5. Created Careers */}
          <button
            onClick={() => {
              setView("created-careers");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
              view === "created-careers" || view === "edit-career"
                ? "bg-[#0088D6] text-white shadow-lg"
                : "text-slate-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Created Careers</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-extrabold">
              {careers.length}
            </span>
          </button>
        </nav>

        {/* Sidebar Footer / Utilities */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-start gap-3 px-3.5 py-3 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-left"
          >
            <svg className="w-4 h-4 text-[#0088D6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>View Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-3 px-3.5 py-3 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 transition-colors text-left"
          >
            <svg className="w-4 h-4 text-[#D81B60]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-slate-400">
            <svg className="w-10 h-10 animate-spin text-[#0088D6] mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-sm font-semibold">Loading dashboard records...</p>
          </div>
        ) : (
          <>
            {/* ══════════════════════════════════════════════════════════════════
                VIEW 1: OVERVIEW (4 Cards + 5 Latest History)
            ══════════════════════════════════════════════════════════════════ */}
            {view === "overview" && (
              <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2B59] tracking-tight">
                      Platform Overview
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Monitor published content, drafts, and recent administrative activity.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        resetResourceForm();
                        setView("create-post");
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#0088D6] hover:bg-[#0070b3] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>New Post</span>
                    </button>
                    <button
                      onClick={() => {
                        resetCareerForm();
                        setView("create-career");
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#D81B60] hover:bg-[#b5144f] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>New Career</span>
                    </button>
                  </div>
                </div>

                {/* 4 Stat Cards with Brand Colors (#0D2B59, #0088D6, #D81B60) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Card 1: Created Posts (Navy Brand #0D2B59) */}
                  <div
                    onClick={() => setView("created-posts")}
                    className="relative bg-white p-6 rounded border border-slate-200 shadow transition-all cursor-pointer group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 " />
                    <div className="flex items-center justify-between mb-4 mt-1">
                      <div className="w-10 h-10 rounded bg-[#0D2B59] text-white flex items-center justify-center shadow transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <span className="text-[11px] font-bold text-[#0D2B59] bg-[#0D2B59]/10 px-2.5 py-1 rounded-full border border-[#0D2B59]/20">
                        Live on Site
                      </span>
                    </div>
                    <h3 className="text-3xl font-extrabold text-[#0D2B59] tracking-tight">
                      {createdPostsCount}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                      Created Posts
                    </p>
                    
                  </div>

                  {/* Card 2: Created Careers (Sky Blue Brand #0088D6) */}
                  <div
                    onClick={() => setView("created-careers")}
                    className="relative bg-white p-6 rounded border border-slate-200 shadow transition-all cursor-pointer group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0" />
                    <div className="flex items-center justify-between mb-4 mt-1">
                      <div className="w-10 h-10 rounded bg-[#0088D6] text-white flex items-center justify-center shadow transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-[11px] font-bold text-[#0088D6] bg-[#0088D6]/10 px-2.5 py-1 rounded-full border border-[#0088D6]/20">
                        Live on Site
                      </span>
                    </div>
                    <h3 className="text-3xl font-extrabold text-[#0088D6] tracking-tight">
                      {createdCareersCount}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                      Created Careers
                    </p>
                    
                  </div>

                  {/* Card 3: Draft Posts (Rose Brand #D81B60) */}
                  <div
                    onClick={() => {
                      setPostStatusFilter("draft");
                      setView("created-posts");
                    }}
                    className="relative bg-white p-6 rounded border border-slate-200 shadow transition-all cursor-pointer group  overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 " />
                    <div className="flex items-center justify-between mb-4 mt-1">
                      <div className="w-10 h-10 rounded bg-[#D81B60] text-white flex items-center justify-center shadow- transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <span className="text-[11px] font-bold text-[#D81B60] bg-[#D81B60]/10 px-2.5 py-1 rounded-full border border-[#D81B60]/20">
                        Unpublished
                      </span>
                    </div>
                    <h3 className="text-3xl font-extrabold text-[#D81B60] tracking-tight">
                      {draftPostsCount}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                      Draft Posts
                    </p>
                    
                  </div>

                  {/* Card 4: Draft Careers (Brand Gradient #0D2B59 to #D81B60) */}
                  <div
                    onClick={() => {
                      setCareerStatusFilter("draft");
                      setView("created-careers");
                    }}
                    className="relative bg-white p-6 rounded border border-slate-200 shadow transition-all cursor-pointer group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 " />
                    <div className="flex items-center justify-between mb-4 mt-1">
                      <div className="w-10 h-10 rounded bg-[#0088D6] text-white flex items-center justify-center shadow transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-[11px] font-bold text-[#0D2B59] bg-[#0D2B59]/10 px-2.5 py-1 rounded-full border border-[#0D2B59]/20">
                        Unpublished
                      </span>
                    </div>
                    <h3 className="text-3xl font-extrabold text-[#0D2B59] tracking-tight">
                      {draftCareersCount}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                      Draft Careers
                    </p>
                    
                  </div>
                </div>

                {/* History Section: 5 Latest Records */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-extrabold text-[#0D2B59]">
                        Recent Activity & Content History
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        The 5 most recent posts and opportunities created or managed.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                      Showing 5 Latest
                    </span>
                  </div>

                  {historyList.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      No records found in storage yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {historyList.map((item) => (
                        <div
                          key={item.id}
                          className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 rounded-xl px-3 transition-colors"
                        >
                          <div className="flex items-start sm:items-center gap-3.5">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                item.kind === "post"
                                  ? "bg-[#0088D6]/10 text-[#0088D6]"
                                  : "bg-[#0D2B59]/10 text-[#0D2B59]"
                              }`}
                            >
                              {item.kind === "post" ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span
                                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    item.kind === "post"
                                      ? "bg-[#0088D6]/15 text-[#0088D6]"
                                      : "bg-[#0D2B59]/15 text-[#0D2B59]"
                                  }`}
                                >
                                  {item.kind === "post" ? "News & Education" : "Career Opportunity"}
                                </span>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  {item.category}
                                </span>
                              </div>
                              <h4 className="text-sm font-extrabold text-[#0D2B59] leading-snug">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {item.authorOrDept} &bull; {item.date}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            <span
                              className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                item.status === "draft"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-[#0088D6]/10 text-[#0088D6] border border-[#0088D6]/20"
                              }`}
                            >
                              {item.status === "draft" ? "Draft" : "Published"}
                            </span>

                            <button
                              onClick={() => {
                                if (item.kind === "post" && item.rawPost) {
                                  startEditPost(item.rawPost);
                                } else if (item.kind === "career" && item.rawCareer) {
                                  startEditCareer(item.rawCareer);
                                }
                              }}
                              className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                VIEW 2: CREATED NEWS & EDUCATION (Posts Listing with Edit & Delete)
            ══════════════════════════════════════════════════════════════════ */}
            {view === "created-posts" && (
              <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2B59] tracking-tight">
                      Created News & Education
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Manage all published articles, clinical briefs, and draft posts.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      resetResourceForm();
                      setView("create-post");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#0088D6] hover:bg-[#0070b3] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create New Post</span>
                  </button>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="relative w-full md:w-80">
                    <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={postSearch}
                      onChange={(e) => setPostSearch(e.target.value)}
                      placeholder="Search title, summary, tag..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button
                      onClick={() => setPostStatusFilter("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                        postStatusFilter === "all"
                          ? "bg-[#0D2B59] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      All ({resources.length})
                    </button>
                    <button
                      onClick={() => setPostStatusFilter("published")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                        postStatusFilter === "published"
                          ? "bg-[#0088D6] text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Published ({createdPostsCount})
                    </button>
                    <button
                      onClick={() => setPostStatusFilter("draft")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                        postStatusFilter === "draft"
                          ? "bg-amber-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Drafts ({draftPostsCount})
                    </button>
                  </div>
                </div>

                {/* Posts Cards / Table */}
                {filteredPosts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 space-y-3">
                    <p className="text-sm font-semibold">No news or education articles found.</p>
                    <button
                      onClick={() => {
                        resetResourceForm();
                        setView("create-post");
                      }}
                      className="text-xs font-bold text-[#0088D6] hover:underline"
                    >
                      Create your first article →
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                      >
                        <div>
                          {/* Image Thumbnail & Tag */}
                          <div className="relative aspect-[16/9] w-full bg-slate-900">
                            {post.image ? (
                              <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 400px"
                                unoptimized={post.image.startsWith("data:")}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                                No cover image
                              </div>
                            )}
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                              <span className="bg-[#D81B60] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                                {post.tag}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md ${
                                  post.status === "draft"
                                    ? "bg-amber-500 text-white"
                                    : "bg-[#0088D6] text-white"
                                }`}
                              >
                                {post.status === "draft" ? "Draft" : "Published"}
                              </span>
                            </div>
                          </div>

                          <div className="p-5 sm:p-6 space-y-3">
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <span>{post.date}</span>
                              <span>&bull;</span>
                              <span className="text-[#0088D6] font-semibold">{post.readTime}</span>
                            </div>

                            <h3 className="text-base font-extrabold text-[#0D2B59] leading-snug line-clamp-2">
                              {post.title}
                            </h3>

                            <p className="text-xs text-[#475569] leading-relaxed line-clamp-3">
                              {stripHtml(post.summary)}
                            </p>

                            <div className="pt-2 text-[11px] text-slate-500 font-medium border-t border-slate-100 flex items-center justify-between">
                              <span>Author: {post.author?.name || "MIA Clinical"}</span>
                              <Link
                                href={`/resources/${post.slug}`}
                                target="_blank"
                                className="text-[#0088D6] font-bold hover:underline"
                              >
                                View Live ↗
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons: Edit by ID & Delete with Modal */}
                        <div className="px-5 pb-5 pt-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => startEditPost(post)}
                            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0D2B59] hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                          >
                            <svg className="w-3.5 h-3.5 text-[#0088D6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit Post</span>
                          </button>

                          <button
                            onClick={() => openDeleteModal("post", post.id, post.title)}
                            className="px-4 py-2 rounded-xl bg-white border border-rose-200 text-xs font-bold text-[#D81B60] hover:bg-rose-50 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                VIEW 3: CREATED CAREERS (Opportunities Listing with Edit & Delete)
            ══════════════════════════════════════════════════════════════════ */}
            {view === "created-careers" && (
              <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2B59] tracking-tight">
                      Created Careers & Opportunities
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Manage paid job positions, volunteer calls, and clinical fellowships.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      resetCareerForm();
                      setView("create-career");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#D81B60] hover:bg-[#b5144f] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add New Career</span>
                  </button>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="relative w-full md:w-80">
                    <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={careerSearch}
                      onChange={(e) => setCareerSearch(e.target.value)}
                      placeholder="Search title, department, location..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button
                      onClick={() => setCareerTypeFilter("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                        careerTypeFilter === "all"
                          ? "bg-[#0D2B59] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      All Types ({careers.length})
                    </button>
                    <button
                      onClick={() => setCareerTypeFilter("Paid")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                        careerTypeFilter === "Paid"
                          ? "bg-[#0088D6] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Paid
                    </button>
                    <button
                      onClick={() => setCareerTypeFilter("Volunteer")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                        careerTypeFilter === "Volunteer"
                          ? "bg-[#D81B60] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Volunteer
                    </button>
                    <button
                      onClick={() => setCareerTypeFilter("Fellowship")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                        careerTypeFilter === "Fellowship"
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Fellowship
                    </button>
                  </div>
                </div>

                {/* Careers List */}
                {filteredCareers.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 space-y-3">
                    <p className="text-sm font-semibold">No career opportunities found.</p>
                    <button
                      onClick={() => {
                        resetCareerForm();
                        setView("create-career");
                      }}
                      className="text-xs font-bold text-[#D81B60] hover:underline"
                    >
                      Add your first opportunity →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCareers.map((career) => (
                      <div
                        key={career.id}
                        className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full text-white ${
                                career.type === "Paid"
                                  ? "bg-[#0D2B59]"
                                  : career.type === "Volunteer"
                                  ? "bg-[#D81B60]"
                                  : "bg-[#0088D6]"
                              }`}
                            >
                              {career.type}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                career.status === "draft"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-[#0088D6]/10 text-[#0088D6] border border-[#0088D6]/20"
                              }`}
                            >
                              {career.status === "draft" ? "Draft" : "Published"}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">
                              Deadline: {career.deadline}
                            </span>
                          </div>

                          <h3 className="text-lg font-extrabold text-[#0D2B59]">
                            {career.title}
                          </h3>

                          <p className="text-xs text-[#0088D6] font-bold uppercase tracking-wider">
                            {career.department} &bull; {career.location} &bull; {career.commitment}
                          </p>

                          <p className="text-xs text-[#475569] leading-relaxed line-clamp-2 max-w-3xl">
                            {stripHtml(career.summary)}
                          </p>

                          <div className="text-[11px] text-slate-400 font-medium pt-1">
                            Applications to: <span className="text-slate-600 font-semibold">{career.applyEmail}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                          <Link
                            href={`/get-involved/${career.slug}`}
                            target="_blank"
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                          >
                            Live ↗
                          </Link>

                          <button
                            onClick={() => startEditCareer(career)}
                            className="px-4 py-2 rounded-xl bg-[#0D2B59] hover:bg-[#103A75] text-white text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5 text-[#0088D6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => openDeleteModal("career", career.id, career.title)}
                            className="px-4 py-2 rounded-xl border border-rose-200 text-xs font-bold text-[#D81B60] hover:bg-rose-50 transition-colors inline-flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                VIEW 4: CREATE / EDIT NEWS OR EDUCATION FORM
                (Upload Cover, Tab Tag Selector, Formatted Textareas)
            ══════════════════════════════════════════════════════════════════ */}
            {(view === "create-post" || view === "edit-post") && (
              <div className="space-y-6 animate-fade-in max-w-4xl">
                {/* Header / Breadcrumb */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
                      <button
                        onClick={() => setView("created-posts")}
                        className="hover:text-[#0D2B59] transition-colors"
                      >
                        Created News & Education
                      </button>
                      <span>/</span>
                      <span className="text-[#0D2B59]">
                        {editingPostId ? `Edit: ${rTitle || "Article"}` : "Create New Post"}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2B59] tracking-tight">
                      {editingPostId ? "Edit News or Education Post" : "Create News or Education Post"}
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Author with rich text formatting and custom cover photo upload.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      resetResourceForm();
                      setView("created-posts");
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    ← Back to List
                  </button>
                </div>

                {/* Form Card */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveResource();
                  }}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8"
                >
                  {/* Article Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59] mb-2">
                      Article Title <span className="text-[#D81B60]">*</span>
                    </label>
                    <input
                      type="text"
                      value={rTitle}
                      onChange={(e) => setRTitle(e.target.value)}
                      placeholder="Enter A Compelling Title"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:border-slate-400 font-medium"
                      required
                    />
                  </div>

                  {/* Category Tag (Tab Selector instead of basic select) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59] mb-2">
                      Category Tag <span className="text-[#D81B60]">*</span>
                    </label>
                    <p className="text-xs text-slate-500 mb-2">
                      Select which section of the knowledge base this article belongs to:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {CATEGORY_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setRTag(tag)}
                          className={`py-3 px-3 rounded-xl text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 ${
                            rTag === tag
                              ? "bg-[#0D2B59] text-white border-[#0D2B59] shadow-md"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {rTag === tag && (
                            <svg className="w-3.5 h-3.5 text-[#0088D6]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <span>{tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Read Time & Author Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59] mb-2">
                        Estimated Read Time
                      </label>
                      <input
                        type="text"
                        value={rReadTime}
                        onChange={(e) => setRReadTime(e.target.value)}
                        placeholder="e.g. 5 min read"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59] mb-2">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={rAuthorName}
                        onChange={(e) => setRAuthorName(e.target.value)}
                        placeholder="e.g., Dr. Amina Juma"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59] mb-2">
                        Author Title / Role
                      </label>
                      <input
                        type="text"
                        value={rAuthorRole}
                        onChange={(e) => setRAuthorRole(e.target.value)}
                        placeholder="e.g., Clinical Director, MIA"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  {/* Cover Picture (Custom User Upload) */}
                  <div className="pt-2">
                    <ImageUpload
                      label="Cover Picture"
                      sublabel="Upload an image from your device for this article's header and card thumbnail (JPG, PNG, WebP up to 10MB)."
                      value={rImage}
                      onChange={setRImage}
                      required
                    />
                  </div>

                  {/* Brief Summary (Formatted Textarea) */}
                  <div className="pt-2">
                    <FormattedTextarea
                      label="Brief Card Summary"
                      sublabel="Displayed on the main Resources index card and social snippets (1-2 sentences)."
                      value={rSummary}
                      onChange={setRSummary}
                      rows={3}
                      placeholder="e.g. A practical overview of what expectant mothers should expect during prenatal visits..."
                      required
                    />
                  </div>

                  {/* Lead Introduction Paragraph (Formatted Textarea) */}
                  <div className="pt-2">
                    <FormattedTextarea
                      label="Lead Introduction Paragraph"
                      sublabel="Prominent introductory text displayed right below the header on the article detail page."
                      value={rIntro}
                      onChange={setRIntro}
                      rows={3}
                      placeholder="e.g. Antenatal care is more than healthcare visits; it is an essential lifeline bridging expectant mothers with clinical expertise..."
                    />
                  </div>

                  {/* Dynamic Content Sections with Formatted Textareas */}
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D2B59]">
                          Article Content Sections (Headings &amp; Rich Text)
                        </h4>
                        <p className="text-xs text-slate-500">
                          Structured body sections rendered on the detail page.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setRSections((prev) => [...prev, { heading: "", body: "" }])
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-[#0088D6]/10 text-[#0088D6] hover:bg-[#0088D6]/20 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>+ Add Section</span>
                      </button>
                    </div>

                    <div className="space-y-5">
                      {rSections.map((sec, idx) => (
                        <div
                          key={idx}
                          className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Section #{idx + 1}
                            </span>
                            {rSections.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setRSections((prev) => prev.filter((_, i) => i !== idx))
                                }
                                className="text-xs text-[#D81B60] font-bold hover:underline"
                              >
                                Remove Section
                              </button>
                            )}
                          </div>

                          <input
                            type="text"
                            value={sec.heading}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRSections((prev) =>
                                prev.map((s, i) => (i === idx ? { ...s, heading: val } : s))
                              );
                            }}
                            placeholder="Section Heading (e.g. The Critical Importance of the First Trimester)"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-slate-400"
                          />

                          <FormattedTextarea
                            label="Section Content"
                            value={sec.body}
                            onChange={(val) => {
                              setRSections((prev) =>
                                prev.map((s, i) => (i === idx ? { ...s, body: val } : s))
                              );
                            }}
                            rows={4}
                            placeholder="Full formatted text for this section (use toolbar for bold, italic, lists, quotes)..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Takeaways Callout Box (Formatted Textarea) */}
                  <div className="pt-2">
                    <FormattedTextarea
                      label="Key Takeaways Callout Box"
                      sublabel="Renders inside the clinical blue highlight box. Format with bullet points or newlines."
                      value={rTakeaways}
                      onChange={setRTakeaways}
                      rows={4}
                      placeholder={"- Attend at least 8 antenatal checkups throughout pregnancy.\n- Early blood pressure and hemoglobin screenings prevent complications.\n- Recognize warning signs early: persistent headaches or vision changes."}
                    />
                  </div>

                  {/* Status Selection & Action Buttons */}
                  <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Publish Status:
                      </span>
                      <button
                        type="button"
                        onClick={() => setRStatus("published")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          rStatus === "published"
                            ? "bg-[#0088D6] text-white shadow"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Published
                      </button>
                      <button
                        type="button"
                        onClick={() => setRStatus("draft")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          rStatus === "draft"
                            ? "bg-amber-600 text-white shadow"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Draft
                      </button>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          resetResourceForm();
                          setView("created-posts");
                        }}
                        className="px-5 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleSaveResource("draft")}
                        className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-md"
                      >
                        {saving ? "Saving..." : "Save Draft"}
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleSaveResource("published")}
                        className="px-6 py-3 rounded-xl bg-[#0088D6] hover:bg-[#0070b3] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                      >
                        {saving && (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                        )}
                        <span>{editingPostId ? "Save Changes" : "Publish Now"}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                VIEW 5: CREATE / EDIT CAREERS FORM
                (Tab Type Selector, Formatted Textareas)
            ══════════════════════════════════════════════════════════════════ */}
            {(view === "create-career" || view === "edit-career") && (
              <div className="space-y-6 animate-fade-in max-w-4xl">
                {/* Header / Breadcrumb */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
                      <button
                        onClick={() => setView("created-careers")}
                        className="hover:text-[#0D2B59] transition-colors"
                      >
                        Created Careers
                      </button>
                      <span>/</span>
                      <span className="text-[#0D2B59]">
                        {editingCareerId ? `Edit: ${cTitle || "Opportunity"}` : "Add New Career"}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2B59] tracking-tight">
                      {editingCareerId ? "Edit Career Opportunity" : "Add Career Opportunity"}
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ensure all fields match the public Careers &amp; Volunteering detail &amp; listing templates.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      resetCareerForm();
                      setView("created-careers");
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    ← Back to List
                  </button>
                </div>

                {/* Form Card */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveCareer();
                  }}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8"
                >
                  {/* Job Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59] mb-2">
                      Position Title <span className="text-[#D81B60]">*</span>
                    </label>
                    <input
                      type="text"
                      value={cTitle}
                      onChange={(e) => setCTitle(e.target.value)}
                      placeholder="Enter Position Title (e.g., Lead Clinical Midwife Coordinator)"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:border-slate-400 font-medium"
                      required
                    />
                  </div>

                  {/* Opportunity Type (Pills selector) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59] mb-2">
                      Opportunity Type <span className="text-[#D81B60]">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["Paid", "Volunteer", "Fellowship"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setCType(t)}
                          className={`py-3 px-4 rounded-xl text-xs font-extrabold transition-all border text-center ${
                            cType === t
                              ? t === "Paid"
                                ? "bg-[#0D2B59] text-white border-[#0D2B59] shadow-md"
                                : t === "Volunteer"
                                ? "bg-[#D81B60] text-white border-[#D81B60] shadow-md"
                                : "bg-[#0088D6] text-white border-[#0088D6] shadow-md"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {t} Opportunity
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Department & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59] mb-2">
                        Department / Function
                      </label>
                      <input
                        type="text"
                        value={cDept}
                        onChange={(e) => setCDept(e.target.value)}
                        placeholder="e.g., Clinical Operations & Field Outreach"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59] mb-2">
                        Location / Work Mode
                      </label>
                      <input
                        type="text"
                        value={cLocation}
                        onChange={(e) => setCLocation(e.target.value)}
                        placeholder="e.g., Field-Based / Sub-Saharan Africa or Remote"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  {/* Commitment (Tab Selector or Custom input), Deadline, Apply Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59] mb-2">
                      Commitment
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {COMMITMENT_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setCCommit(opt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            cCommit === opt
                              ? "bg-[#0D2B59] text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={cCommit}
                      onChange={(e) => setCCommit(e.target.value)}
                      placeholder="Or specify custom commitment..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59] mb-2">
                        Application Deadline
                      </label>
                      <input
                        type="text"
                        value={cDeadline}
                        onChange={(e) => setCDeadline(e.target.value)}
                        placeholder="e.g., November 30, 2026 or Rolling"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59] mb-2">
                        Apply Email
                      </label>
                      <input
                        type="email"
                        value={cEmail}
                        onChange={(e) => setCEmail(e.target.value)}
                        placeholder="e.g., careers@maternalinitiativeafrica.org"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  {/* Brief Summary (Formatted Textarea) */}
                  <div className="pt-2">
                    <FormattedTextarea
                      label="Brief Card Summary"
                      sublabel="Shown on the Careers overview listing tab."
                      value={cSummary}
                      onChange={setCSummary}
                      rows={3}
                      placeholder="e.g., Oversee community mobile clinical teams, supervise rural antenatal screenings..."
                      required
                    />
                  </div>

                  {/* About the Role (Formatted Textarea) */}
                  <div className="pt-2">
                    <FormattedTextarea
                      label="About the Role (Full Overview)"
                      sublabel="In-depth overview displayed under 'About the Role' on the career detail page."
                      value={cAbout}
                      onChange={setCAbout}
                      rows={4}
                      placeholder="Detailed context and impact of this role..."
                    />
                  </div>

                  {/* Responsibilities (Formatted Textarea) */}
                  <div className="pt-2">
                    <FormattedTextarea
                      label="Key Responsibilities & Duties"
                      sublabel="Enter each responsibility on a new line or with bullet points (renders with teal checkmarks on detail page)."
                      value={cResponsibilities}
                      onChange={setCResponsibilities}
                      rows={5}
                      placeholder={"- Lead multidisciplinary field teams during mobile clinic outreaches.\n- Conduct antenatal clinical triage and manage complex obstetric screenings.\n- Prepare monthly clinical performance reports."}
                    />
                  </div>

                  {/* Requirements (Formatted Textarea) */}
                  <div className="pt-2">
                    <FormattedTextarea
                      label="Required Qualifications & Experience"
                      sublabel="Enter each qualification on a new line or with bullet points (renders with rose checkmarks on detail page)."
                      value={cRequirements}
                      onChange={setCRequirements}
                      rows={5}
                      placeholder={"- Registered Midwife (RM) with valid clinical practicing license.\n- Minimum 5 years of active clinical experience in obstetric care.\n- Demonstrated experience in rural healthcare delivery."}
                    />
                  </div>

                  {/* Status Selection & Action Buttons */}
                  <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Publish Status:
                      </span>
                      <button
                        type="button"
                        onClick={() => setCStatus("published")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          cStatus === "published"
                            ? "bg-[#0088D6] text-white shadow"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Published
                      </button>
                      <button
                        type="button"
                        onClick={() => setCStatus("draft")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          cStatus === "draft"
                            ? "bg-amber-600 text-white shadow"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Draft
                      </button>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          resetCareerForm();
                          setView("created-careers");
                        }}
                        className="px-5 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleSaveCareer("draft")}
                        className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-md"
                      >
                        {saving ? "Saving..." : "Save Draft"}
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleSaveCareer("published")}
                        className="px-6 py-3 rounded-xl bg-[#D81B60] hover:bg-[#b5144f] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                      >
                        {saving && (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                        )}
                        <span>{editingCareerId ? "Save Changes" : "Post Opportunity"}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </main>

      <style>{`
        /* Completely hide scrollbars in sidebar across all browsers */
        .no-scrollbar::-webkit-scrollbar,
        aside nav::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .no-scrollbar,
        aside nav {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
    </div>
  );
}
