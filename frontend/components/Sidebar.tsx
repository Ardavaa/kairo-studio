"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, Home, Search, Book, User, Building2,
  FileText, Sparkles, CheckSquare, FolderOpen,
  HelpCircle, Settings, X
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [showEnhanceCard, setShowEnhanceCard] = useState(true);

  // Load the dismissed state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDismissed = localStorage.getItem("kairo_hide_enhance_card") === "true";
      if (isDismissed) {
        setShowEnhanceCard(false);
      }
    }
  }, []);

  const handleDismiss = () => {
    setShowEnhanceCard(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("kairo_hide_enhance_card", "true");
    }
  };

  // Helper to determine if a link is active
  const isActive = (path: string) => pathname === path;

  const linkClass = (path: string) => {
    const base = "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors";
    return isActive(path)
      ? `${base} bg-accent/10 text-accent`
      : `${base} text-muted hover:text-primary hover:bg-black/5`;
  };

  return (
    <aside className="w-[280px] bg-light-surface border-r border-soft-border flex flex-col fixed inset-y-0 left-0 z-20">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-6 py-8">
        <div className="flex flex-col">
          <span className="font-serif text-3xl font-bold tracking-tight text-primary">KAIRO</span>
          <span className="text-accent text-[11px] font-semibold tracking-[0.2em] mt-0.5">STUDIO</span>
        </div>
        <button className="text-muted hover:text-primary">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto no-scrollbar">
        <ul className="space-y-1">
          <li>
            <Link href="/" className={linkClass("/")}>
              <Home className="w-4 h-4" />
              Home
            </Link>
          </li>
          <li>
            <Link href="/search" className={linkClass("/search")}>
              <Search className="w-4 h-4" />
              Search Papers
            </Link>
          </li>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-3 py-2.5 text-muted hover:text-primary hover:bg-black/5 rounded-lg font-medium text-sm transition-colors">
              <Book className="w-4 h-4" />
              Journals & Books
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-3 py-2.5 text-muted hover:text-primary hover:bg-black/5 rounded-lg font-medium text-sm transition-colors">
              <User className="w-4 h-4" />
              Authors
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-3 py-2.5 text-muted hover:text-primary hover:bg-black/5 rounded-lg font-medium text-sm transition-colors">
              <Building2 className="w-4 h-4" />
              Institutions
            </a>
          </li>
        </ul>

        <div>
          <h3 className="px-3 text-xs font-bold text-muted uppercase tracking-wider mb-3">Research Tools</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/literature-review" className={linkClass("/literature-review")}>
                <FileText className="w-4 h-4" />
                Literature Review
              </Link>
            </li>
            <li>
              <Link href="/ai-assistant" className={linkClass("/ai-assistant")}>
                <Sparkles className="w-4 h-4" />
                AI Research Assistant
              </Link>
            </li>
            <li>
              <Link href="/citation-manager" className={linkClass("/citation-manager")}>
                <CheckSquare className="w-4 h-4" />
                Citation Manager
              </Link>
            </li>
            <li>
              <Link href="/project-workspace" className={linkClass("/project-workspace")}>
                <FolderOpen className="w-4 h-4" />
                Project Workspace
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Enhance Your Research Card */}
      {showEnhanceCard && (
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
      <div className="border-t border-soft-border p-4 space-y-1">
        <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-3 py-2.5 text-muted hover:text-primary hover:bg-black/5 rounded-lg font-medium text-sm transition-colors">
          <HelpCircle className="w-4 h-4" />
          Help Center
        </a>
        <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-3 py-2.5 text-muted hover:text-primary hover:bg-black/5 rounded-lg font-medium text-sm transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </a>
      </div>
    </aside>
  );
}
