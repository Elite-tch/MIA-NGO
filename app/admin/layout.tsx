"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only guard the dashboard and sub-routes, not the login page itself
    if (pathname !== "/admin") {
      const auth = sessionStorage.getItem("mia_admin_auth");
      if (auth !== "true") {
        router.replace("/admin");
      }
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {children}
    </div>
  );
}
