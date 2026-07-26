"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isPublicPage = pathname === "/" || pathname?.startsWith("/auth");
      if (!isPublicPage) {
        const savedUser = localStorage.getItem("kairo_user");
        if (!savedUser) {
          setIsAuthorized(false);
          window.location.href = "/auth";
          return;
        }
      }
      setIsAuthorized(true);
    }
  }, [pathname]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#111110] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#E86A24] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-neutral-400">Redirecting to authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
