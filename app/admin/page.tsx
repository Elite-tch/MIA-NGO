"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Check if already authenticated on mount
  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.replace("/admin/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password || !pin) {
      setErrorMsg("Please enter both your Admin Passphrase and Security PIN.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, pin }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem("mia_admin_auth", "true");
        router.push("/admin/dashboard");
      } else {
        setErrorMsg(data.error || "Authentication failed.");
        setShaking(true);
        setTimeout(() => setShaking(false), 600);
      }
    } catch {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D2B59] via-[#103A75] to-[#0D2B59] flex items-center justify-center px-4 py-12">
      <div className={`w-full max-w-md ${shaking ? "animate-shake" : ""}`}>
        {/* Header */}
        <div className="text-center mb-8">
         
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">Maternal Initiative Africa &bull; Authorised Personnel Only</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white backdrop-blur-md border border-white/20 rounded-3xl p-7 sm:p-9 space-y-5 shadow-2xl"
        >
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-[#D81B60] text-xs font-semibold rounded-xl flex items-start gap-2.5">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Field 1: Admin Passphrase */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59] mb-1.5">
              1. Admin Passphrase <span className="text-[#D81B60]">*</span>
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="Enter admin passphrase"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl placeholder-slate-400 text-sm text-[#0D2B59] font-medium focus:outline-none focus:border-[#0088D6] focus:ring-2 focus:ring-[#0088D6]/20 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Field 2: Security PIN (2-Step Protection) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2B59]">
                2. Security PIN <span className="text-[#D81B60]">*</span>
              </label>
              <span className="text-[11px] text-[#0088D6] font-semibold">6-Digit 2FA Key</span>
            </div>
            <input
              id="admin-pin"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ""));
                setErrorMsg(null);
              }}
              placeholder="••••••"
              autoComplete="one-time-code"
              required
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl placeholder-slate-400 text-sm tracking-[0.3em] font-mono text-[#0D2B59] text-center focus:outline-none focus:border-[#0088D6] focus:ring-2 focus:ring-[#0088D6]/20 transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Protected by server brute-force lockout after 5 incorrect attempts.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#D81B60] hover:bg-[#b5144f] disabled:bg-slate-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <span>Unlock Admin Dashboard</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-300 mt-6 leading-relaxed">
          Credentials are authenticated via secure server-side verification and encrypted sessions.
        </p>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-8px); }
          30%, 60%, 90% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
