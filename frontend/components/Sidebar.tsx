"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Menu, Home, Search, Book, User, Building2,
  FileText, Sparkles, CheckSquare, FolderOpen,
  HelpCircle, Settings, X
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/auth")) {
    return null;
  }

  const [showEnhanceCard, setShowEnhanceCard] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string; provider: string } | null>(null);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("kairo_user");
      if (savedUser) {
        try { setUser(JSON.parse(savedUser)); } catch (e) {}
      } else {
        setUser(null);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setIsMobileViewport(window.innerWidth < 1024);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const effectiveIsCollapsed = isCollapsed && !isMobileViewport;

  // Load the dismissed state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDismissed = localStorage.getItem("kairo_hide_enhance_card") === "true";
      if (isDismissed) {
        setShowEnhanceCard(false);
      }
      const savedCollapsed = localStorage.getItem("kairo_sidebar_collapsed") === "true";
      if (savedCollapsed) {
        setIsCollapsed(true);
        document.body.classList.add("sidebar-collapsed");
      }
    }
  }, []);

  const handleDismiss = () => {
    setShowEnhanceCard(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("kairo_hide_enhance_card", "true");
    }
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("kairo_sidebar_collapsed", String(newState));
      if (newState) {
        document.body.classList.add("sidebar-collapsed");
      } else {
        document.body.classList.remove("sidebar-collapsed");
      }
    }
  };

  // Helper to determine if a link is active
  const isActive = (path: string) => pathname === path;

  const linkClass = (path: string) => {
    const base = cn(
      "flex items-center rounded-lg font-medium text-sm transition-colors overflow-hidden whitespace-nowrap",
      effectiveIsCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5"
    );
    return cn(
      base,
      isActive(path)
        ? "bg-accent/10 text-accent"
        : "text-muted hover:text-primary hover:bg-black/5"
    );
  };

  if (pathname.startsWith("/editor")) {
    return null;
  }

  return (
    <>
      {/* Mobile Header (Only visible on mobile) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-[60px] bg-warm-white border-b border-soft-border z-40 flex items-center justify-between px-4">
        <div className="flex items-center">
          <Image src="/kairo-logo.svg" alt="Logo" width={140} height={36} className="h-8 w-auto object-contain" />
        </div>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-muted hover:text-primary transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside 
        className={cn(
          "bg-light-surface border-r border-soft-border flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300",
          effectiveIsCollapsed ? "lg:w-[80px]" : "lg:w-[280px]",
          isMobileOpen ? "w-[280px] translate-x-0" : "w-[280px] -translate-x-full lg:translate-x-0"
        )}
      >
      {/* Sidebar Header */}
      <div className={cn("flex py-8 items-center h-[96px]", effectiveIsCollapsed ? "justify-center" : "px-6 justify-between")}>
        {effectiveIsCollapsed ? (
          <button 
            onClick={toggleSidebar} 
            className="relative flex items-center justify-center group cursor-pointer w-12 h-12 rounded-lg hover:bg-black/5 transition-colors"
          >
            {/* Hamburger Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
               <Menu className="w-5 h-5 text-primary" />
            </div>
            {/* Logo */}
            <div className="flex items-center justify-center transition-opacity group-hover:opacity-0 w-full shrink-0">
              <Image src="/kairo-logo-compact.svg" alt="Logo" width={32} height={32} className="w-8 h-8" />
            </div>
          </button>
        ) : (
          <>
            <div className="flex items-center shrink-0">
              <Image src="/kairo-logo.svg" alt="Logo" width={180} height={48} className="h-12 w-auto object-contain" />
            </div>
            <button 
              onClick={toggleSidebar} 
              className="text-muted hover:text-primary shrink-0 transition-colors p-1.5 rounded-lg hover:bg-black/5 hidden lg:block"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsMobileOpen(false)} 
              className="text-muted hover:text-primary shrink-0 transition-colors p-1.5 rounded-lg hover:bg-black/5 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 py-4 space-y-8 overflow-y-auto no-scrollbar", effectiveIsCollapsed ? "px-2" : "px-4")}>
        <ul className="space-y-1" onClick={() => setIsMobileOpen(false)}>
          <li>
            <Link href="/" className={linkClass("/")}>
              <Home className="w-5 h-5 shrink-0" />
              {!effectiveIsCollapsed && <span>Home</span>}
            </Link>
          </li>
          <li>
            <Link href="/search" className={linkClass("/search")}>
              <Search className="w-5 h-5 shrink-0" />
              {!effectiveIsCollapsed && <span>Search Papers</span>}
            </Link>
          </li>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()} className={linkClass("#")}>
              <Book className="w-5 h-5 shrink-0" />
              {!effectiveIsCollapsed && <span>Journals & Books</span>}
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()} className={linkClass("#")}>
              <User className="w-5 h-5 shrink-0" />
              {!effectiveIsCollapsed && <span>Authors</span>}
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()} className={linkClass("#")}>
              <Building2 className="w-5 h-5 shrink-0" />
              {!effectiveIsCollapsed && <span>Institutions</span>}
            </a>
          </li>
        </ul>

        <div>
          {!effectiveIsCollapsed && (
            <h3 className="px-3 text-xs font-bold text-muted uppercase tracking-wider mb-3">
              Research Tools
            </h3>
          )}
          {effectiveIsCollapsed && (
            <div className="flex justify-center mb-3">
              <div className="w-4 h-[1px] bg-soft-border"></div>
            </div>
          )}
          <ul className="space-y-1" onClick={() => setIsMobileOpen(false)}>
            <li>
              <Link href="/literature-review" className={linkClass("/literature-review")}>
                <FileText className="w-5 h-5 shrink-0" />
                {!effectiveIsCollapsed && <span>Literature Review</span>}
              </Link>
            </li>
            <li>
              <Link href="/ai-assistant" className={linkClass("/ai-assistant")}>
                <Sparkles className="w-5 h-5 shrink-0" />
                {!effectiveIsCollapsed && <span>AI Research Assistant</span>}
              </Link>
            </li>
            <li>
              <Link href="/citation-manager" className={linkClass("/citation-manager")}>
                <CheckSquare className="w-5 h-5 shrink-0" />
                {!effectiveIsCollapsed && <span>Citation Manager</span>}
              </Link>
            </li>
            <li>
              <Link href="/project-workspace" className={linkClass("/project-workspace")}>
                <FolderOpen className="w-5 h-5 shrink-0" />
                {!effectiveIsCollapsed && <span>Project Workspace</span>}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* User Profile Card or Enhance Your Research Card */}
      {user ? (
        !effectiveIsCollapsed && (
          <div className="p-4">
            <div className="bg-paper-white rounded-xl p-4 border border-soft-border shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-neutral-200 shadow-xs shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#E86A24] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-primary truncate">{user.name}</div>
                  <div className="text-[10px] text-muted truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("kairo_user");
                  setUser(null);
                }}
                className="text-[11px] text-neutral-400 hover:text-red-500 font-medium px-2 py-1 rounded transition-colors shrink-0"
                title="Sign out"
              >
                Exit
              </button>
            </div>
          </div>
        )
      ) : showEnhanceCard && !effectiveIsCollapsed ? (
        <div className="p-4">
          <div className="bg-paper-white rounded-xl p-5 border border-soft-border shadow-sm relative">
            <button 
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-5 h-5 rounded-full border border-soft-border flex items-center justify-center text-muted hover:text-primary hover:bg-black/5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <h4 className="font-semibold text-primary mb-2 text-sm">Enhance your research</h4>
            <p className="text-muted text-xs mb-4 leading-relaxed">
              Create an account to save papers, organize projects, and get personalized recommendations.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/auth?mode=signup" className="w-full bg-accent text-white rounded-lg py-2.5 text-sm font-medium hover:bg-accent/90 transition-colors shadow-sm block text-center">
                Create free account
              </Link>
              <Link href="/auth?mode=signin" className="w-full text-accent rounded-lg py-2.5 text-sm font-medium hover:bg-accent/5 transition-colors block text-center">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* Footer System Actions */}
      <div className={cn("border-t border-soft-border p-4 space-y-1", effectiveIsCollapsed && "px-2")}>
        <a href="#" onClick={(e) => { e.preventDefault(); setIsMobileOpen(false); }} className={linkClass("#")}>
          <HelpCircle className="w-5 h-5 shrink-0" />
          {!effectiveIsCollapsed && <span>Help Center</span>}
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); setIsMobileOpen(false); }} className={linkClass("#")}>
          <Settings className="w-5 h-5 shrink-0" />
          {!effectiveIsCollapsed && <span>Settings</span>}
        </a>
      </div>
    </aside>
    </>
  );
}
