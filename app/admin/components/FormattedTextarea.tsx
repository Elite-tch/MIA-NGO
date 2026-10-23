"use client";

import { useEffect, useRef } from "react";

interface QuillEditorProps {
  label: string;
  sublabel?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export default function FormattedTextarea({
  label,
  sublabel,
  value,
  onChange,
  placeholder = "Write your engaging content here...",
  rows = 5,
  required = false,
}: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<unknown>(null);

  useEffect(() => {
    let isCancelled = false;
    const editorNode = editorRef.current;
    if (!editorNode) return;

    const parentNode = editorNode.parentElement;
    // Remove any stale toolbars before re-init
    if (parentNode) {
      parentNode.querySelectorAll(".ql-toolbar").forEach((tb) => tb.remove());
    }
    editorNode.innerHTML = "";

    // Dynamically import Quill on client only
    import("quill").then((QuillModule) => {
      if (isCancelled || !editorRef.current) return;
      const Quill = QuillModule.default;

      // Inject Quill Snow CSS via link tag (only once)
      if (!document.getElementById("quill-snow-css")) {
        const link = document.createElement("link");
        link.id = "quill-snow-css";
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/quill@2/dist/quill.snow.css";
        document.head.appendChild(link);
      }

      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["blockquote", "code-block"],
        ["link"],
        [{ align: [] }],
        ["clean"],
      ];

      const quill = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: toolbarOptions,
        },
      });

      quillRef.current = quill;

      // Set initial HTML content
      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      // Listen for changes
      quill.on("text-change", () => {
        const html = (editorRef.current as HTMLElement)?.querySelector(".ql-editor")?.innerHTML || "";
        // Quill's empty state
        onChange(html === "<p><br></p>" ? "" : html);
      });
    });

    return () => {
      isCancelled = true;
      if (parentNode) {
        parentNode.querySelectorAll(".ql-toolbar").forEach((tb) => tb.remove());
      }
      if (editorNode) {
        editorNode.innerHTML = "";
      }
      quillRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes (e.g. loading an edit)
  useEffect(() => {
    const quill = quillRef.current as { clipboard?: { dangerouslyPasteHTML: (html: string) => void }; root?: HTMLElement } | null;
    if (!quill || !quill.clipboard) return;

    const editorEl = editorRef.current?.querySelector(".ql-editor");
    if (!editorEl) return;

    const currentHtml = editorEl.innerHTML;
    const incomingHtml = value || "";
    if (currentHtml !== incomingHtml && incomingHtml !== "<p><br></p>") {
      quill.clipboard.dangerouslyPasteHTML(incomingHtml);
    }
  }, [value]);

  const minHeight = Math.max(rows * 28, 140);

  return (
    <div className="space-y-1.5">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59]">
          {label} {required && <span className="text-[#D81B60]">*</span>}
        </label>
        {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
      </div>

      <div
        className="rounded-xl border border-slate-300 overflow-hidden bg-white quill-mia-wrapper"
        style={{ minHeight: `${minHeight + 42}px` }}
      >
        <div ref={editorRef} style={{ minHeight: `${minHeight}px` }} />
      </div>

      <style>{`
        .quill-mia-wrapper .ql-toolbar {
          border: none;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 6px 10px;
          border-radius: 0;
          font-family: inherit;
        }
        .quill-mia-wrapper .ql-toolbar .ql-formats {
          margin-right: 8px;
        }
        .quill-mia-wrapper .ql-container {
          border: none;
          font-family: inherit;
          font-size: 14px;
          color: #1e293b;
        }
        .quill-mia-wrapper .ql-editor {
          min-height: ${minHeight}px;
          padding: 12px 16px;
          line-height: 1.7;
        }
        .quill-mia-wrapper .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: italic;
          font-size: 13px;
        }
        .quill-mia-wrapper .ql-editor:focus {
          outline: none;
        }
        .quill-mia-wrapper .ql-container:focus-within {
          outline: none;
        }
        /* Override Quill's default blue selection  */
        .quill-mia-wrapper .ql-toolbar button:hover,
        .quill-mia-wrapper .ql-toolbar button.ql-active,
        .quill-mia-wrapper .ql-toolbar .ql-picker-label:hover,
        .quill-mia-wrapper .ql-toolbar .ql-picker-item:hover {
          color: #0D2B59 !important;
        }
        .quill-mia-wrapper .ql-toolbar button:hover .ql-stroke,
        .quill-mia-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: #0D2B59 !important;
        }
        .quill-mia-wrapper .ql-toolbar button:hover .ql-fill,
        .quill-mia-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: #0D2B59 !important;
        }
      `}</style>
    </div>
  );
}
