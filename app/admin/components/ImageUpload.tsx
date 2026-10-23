"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  label: string;
  sublabel?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

export default function ImageUpload({
  label,
  sublabel,
  value,
  onChange,
  required = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, or WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image file is too large. Max allowed size is 10MB.");
      return;
    }

    setUploading(true);
    try {
      // 1. Attempt direct Cloudinary upload with unsigned preset
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dibwnfwk9";
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "blog_upload";

      try {
        const cFormData = new FormData();
        cFormData.append("file", file);
        cFormData.append("upload_preset", uploadPreset);

        const cRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: cFormData,
        });

        if (cRes.ok) {
          const cData = await cRes.json();
          if (cData.secure_url) {
            onChange(cData.secure_url);
            return;
          }
        }
      } catch (cErr) {
        console.warn("Direct Cloudinary upload failed, trying backend upload route:", cErr);
      }

      // 2. Fallback to /api/upload route (which also targets Cloudinary/local)
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        // Fallback to Base64 Data URL if network upload fails
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            onChange(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      // Fallback to client-side Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  return (
    <div className="space-y-2">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59]">
          {label} {required && <span className="text-[#D81B60]">*</span>}
        </label>
        {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {value ? (
        // Preview state
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm group">
          <div className="relative aspect-[16/9] w-full max-h-72">
            <Image
              src={value}
              alt="Uploaded Cover"
              fill
              className="object-cover object-center"
              unoptimized={value.startsWith("data:")}
            />
          </div>

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 rounded-xl bg-white text-[#0D2B59] text-xs font-bold shadow-lg hover:bg-slate-100 transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-[#0088D6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Change Image</span>
            </button>

            <button
              type="button"
              onClick={() => onChange("")}
              className="px-4 py-2 rounded-xl bg-[#D81B60] text-white text-xs font-bold shadow-lg hover:bg-[#b5144f] transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Remove</span>
            </button>
          </div>

          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="truncate max-w-[280px] font-mono text-[11px]">{value}</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Cover Uploaded
            </span>
          </div>
        </div>
      ) : (
        // Dropzone state
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-[#0088D6] bg-[#0088D6]/10"
              : "border-slate-300 hover:border-[#0088D6] bg-slate-50/70 hover:bg-slate-50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <svg className="w-8 h-8 animate-spin text-[#0088D6] mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-xs font-bold text-[#0D2B59]">Uploading cover image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-[#0088D6]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-[#0D2B59]">
                  <span className="text-[#0088D6] hover:underline">Click to browse</span> or drag and drop image here
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supports JPG, PNG, WebP up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs font-semibold text-[#D81B60] mt-1">{error}</p>}
    </div>
  );
}
