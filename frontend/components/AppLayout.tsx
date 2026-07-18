"use client";

import { useState } from "react";
import { AppShell } from '@astryxdesign/core/AppShell';
import {
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import { usePathname } from 'next/navigation';
import {
  Home, Search, Book, User, Building2,
  FileText, Sparkles, CheckSquare, FolderOpen,
  HelpCircle, Settings, X
} from "lucide-react";
import Link from "next/link";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showEnhanceCard, setShowEnhanceCard] = useState(true);

  return (
    <AppShell
      contentPadding={0}
      height="fill"
      sideNav={
        <SideNav
          header={
            <div className="flex items-center justify-between px-6 py-6 border-b border-soft-border/50">
              <div className="flex flex-col">
                <span className="font-serif text-3xl font-bold tracking-tight text-primary leading-none">KAIRO</span>
                <span className="text-accent text-[11px] font-semibold tracking-[0.2em] mt-1">STUDIO</span>
              </div>
            </div>
          }
          footer={
            showEnhanceCard ? (
              <div className="p-4 w-full">
                <div className="bg-paper-white rounded-xl p-5 border border-soft-border shadow-sm relative">
                  <button 
                    onClick={() => setShowEnhanceCard(false)}
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
            ) : null
          }
        >
          <SideNavSection title="Main" isHeaderHidden>
            <SideNavItem
              label="Home"
              icon={Home}
              isSelected={pathname === "/"}
              href="/"
            />
            <SideNavItem
              label="Search Papers"
              icon={Search}
              isSelected={pathname === "/search"}
              href="/search"
            />
            <SideNavItem label="Journals & Books" icon={Book} href="#" />
            <SideNavItem label="Authors" icon={User} href="#" />
            <SideNavItem label="Institutions" icon={Building2} href="#" />
          </SideNavSection>
          
          <SideNavSection title="Research Tools">
            <SideNavItem
              label="Literature Review"
              icon={FileText}
              isSelected={pathname === "/literature-review"}
              href="/literature-review"
            />
            <SideNavItem label="AI Research Assistant" icon={Sparkles} href="#" />
            <SideNavItem label="Citation Manager" icon={CheckSquare} href="#" />
            <SideNavItem label="Project Workspace" icon={FolderOpen} href="#" />
          </SideNavSection>
          
          <SideNavSection title="System">
            <SideNavItem label="Help Center" icon={HelpCircle} href="#" />
            <SideNavItem label="Settings" icon={Settings} href="#" />
          </SideNavSection>
        </SideNav>
      }
    >
      <div className="h-full overflow-y-auto">
        {children}
      </div>
    </AppShell>
  );
}
