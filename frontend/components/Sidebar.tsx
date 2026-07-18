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
  const [showEnhanceCard, setShowEnhanceCard] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5"
    );
    return cn(
      base,
      isActive(path)
        ? "bg-accent/10 text-accent"
        : "text-muted hover:text-primary hover:bg-black/5"
    );
  };

  return (
    <aside 
      className={cn(
        "bg-light-surface border-r border-soft-border flex flex-col fixed inset-y-0 left-0 z-20 transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      {/* Sidebar Header */}
      <div className={cn("flex py-8 items-center h-[96px]", isCollapsed ? "justify-center" : "px-6 justify-between")}>
        {isCollapsed ? (
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
              className="text-muted hover:text-primary shrink-0 transition-colors p-1.5 rounded-lg hover:bg-black/5"
            >
              <Menu className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 py-4 space-y-8 overflow-y-auto no-scrollbar", isCollapsed ? "px-2" : "px-4")}>
        <ul className="space-y-1">
          <li>
            <Link href="/" className={linkClass("/")}>
              <Home className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Home</span>}
            </Link>
          </li>
          <li>
            <Link href="/search" className={linkClass("/search")}>
              <Search className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Search Papers</span>}
            </Link>
          </li>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()} className={linkClass("#")}>
              <Book className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Journals & Books</span>}
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()} className={linkClass("#")}>
              <User className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Authors</span>}
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()} className={linkClass("#")}>
              <Building2 className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Institutions</span>}
            </a>
          </li>
        </ul>

        <div>
          {!isCollapsed && (
            <h3 className="px-3 text-xs font-bold text-muted uppercase tracking-wider mb-3">
              Research Tools
            </h3>
          )}
          {isCollapsed && (
            <div className="flex justify-center mb-3">
              <div className="w-4 h-[1px] bg-soft-border"></div>
            </div>
          )}
          <ul className="space-y-1">
            <li>
              <Link href="/literature-review" className={linkClass("/literature-review")}>
                <FileText className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>Literature Review</span>}
              </Link>
            </li>
            <li>
              <Link href="/ai-assistant" className={linkClass("/ai-assistant")}>
                <Sparkles className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>AI Research Assistant</span>}
              </Link>
            </li>
            <li>
              <Link href="/citation-manager" className={linkClass("/citation-manager")}>
                <CheckSquare className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>Citation Manager</span>}
              </Link>
            </li>
            <li>
              <Link href="/project-workspace" className={linkClass("/project-workspace")}>
                <FolderOpen className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>Project Workspace</span>}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Enhance Your Research Card */}
      {showEnhanceCard && !isCollapsed && (
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
              <button className="w-full bg-accent text-white rounded-lg py-2.5 text-sm font-medium hover:bg-accent/90 transition-colors shadow-sm">
                Create free account
              </button>
              <button className="w-full text-accent rounded-lg py-2.5 text-sm font-medium hover:bg-accent/5 transition-colors">
                Sign in
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer System Actions */}
      <div className={cn("border-t border-soft-border p-4 space-y-1", isCollapsed && "px-2")}>
        <a href="#" onClick={(e) => e.preventDefault()} className={linkClass("#")}>
          <HelpCircle className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Help Center</span>}
        </a>
        <a href="#" onClick={(e) => e.preventDefault()} className={linkClass("#")}>
          <Settings className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </a>
      </div>
    </aside>
  );
}
