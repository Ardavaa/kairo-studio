"use client";
import { useState } from "react";
import {
  ChevronDown, HelpCircle, Bookmark, Folder, FolderPlus,
  Plus, Search, ArrowUpDown, List, LayoutGrid, MoreVertical,
  FileText, BookOpen, File
} from "lucide-react";

export default function ProjectWorkspacePage() {
  return (
    <div className="flex min-h-screen bg-warm-white text-primary font-sans">
      <main className="flex-1 sidebar-aware-margin min-w-0 flex flex-col relative bg-warm-white animate-page-in pt-[60px] lg:pt-0">
        
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(234,88,12,0.1)_0%,transparent_70%)] pointer-events-none z-0 hidden md:block" />

        {/* Topbar */}
        <header className="h-[72px] hidden lg:flex items-center justify-end px-10 shrink-0 relative z-10">
          <div className="flex items-center gap-8 text-[13px] font-medium text-primary">
            <a href="#" className="hover:text-accent transition-colors font-semibold">Journals & Conferences</a>
            <button className="flex items-center gap-1.5 hover:text-accent transition-colors font-semibold">
              Research Tools <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <a href="#" className="flex items-center gap-2 hover:text-accent transition-colors font-semibold">
              <HelpCircle className="w-4 h-4" /> Help
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-accent transition-colors font-semibold">
              <Bookmark className="w-4 h-4" /> My Library
            </a>
            <button className="w-8 h-8 rounded-full bg-[#f4e6df] text-[#a54c30] flex items-center justify-center font-bold text-sm">
              D
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col px-4 md:px-8 lg:px-10 pb-16 max-w-[1200px] mx-auto w-full relative z-10">
          
          {/* Header section */}
          <div className="pt-4 pb-6 md:pb-10 flex flex-col md:flex-row items-start justify-between gap-6">
            <div>
              <h1 className="font-serif text-[32px] md:text-[42px] leading-tight text-primary mb-2 md:mb-3">
                Project Workspace
              </h1>
              <p className="text-[14px] md:text-[15px] text-muted">
                Organize your research projects and access all related papers, notes, and references in one place.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <button className="flex justify-center items-center gap-2 px-5 h-11 bg-white border border-soft-border rounded-lg text-[14px] font-semibold text-primary hover:bg-black/5 shadow-sm transition-colors w-full sm:w-auto">
                <FolderPlus className="w-4 h-4 text-muted" /> New Folder
              </button>
              <button className="flex justify-center items-center gap-2 px-5 h-11 bg-accent border border-accent rounded-lg text-[14px] font-bold text-white hover:bg-accent/90 shadow-sm transition-colors w-full sm:w-auto">
                <Plus className="w-4 h-4" /> New Project
              </button>
            </div>
          </div>

          {/* Main Content Box */}
          <div className="bg-white border border-soft-border rounded-xl shadow-sm overflow-hidden flex flex-col mb-12">
            
            {/* Toolbar */}
            <div className="px-4 md:px-6 py-4 border-b border-soft-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              {/* Tabs */}
              <div className="flex items-center gap-6 md:gap-8 overflow-x-auto no-scrollbar w-full md:w-auto border-b md:border-b-0 border-soft-border md:pb-0 pb-1 -mb-[17px] md:mb-0">
                <button className="text-[14px] font-bold text-primary pb-3 md:pb-4 border-b-2 border-accent whitespace-nowrap">
                  All Projects
                </button>
                <button className="text-[14px] font-medium text-muted hover:text-primary pb-3 md:pb-4 border-b-2 border-transparent whitespace-nowrap">
                  My Projects
                </button>
                <button className="text-[14px] font-medium text-muted hover:text-primary pb-3 md:pb-4 border-b-2 border-transparent whitespace-nowrap">
                  Shared with me
                </button>
              </div>

              {/* View/Sort/Search Controls */}
              <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pt-2 md:pt-0">
                {/* View Toggle */}
                <div className="flex items-center bg-paper-white border border-soft-border rounded-md p-0.5">
                  <button className="p-1.5 bg-accent/10 text-accent rounded hover:bg-accent/15 transition-colors">
                    <List className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-muted hover:text-primary transition-colors">
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Sort Dropdown */}
                <button className="flex items-center gap-2 px-3 py-1.5 bg-paper-white border border-soft-border rounded-md text-[13px] font-medium text-muted hover:text-primary transition-colors h-[34px]">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Last updated <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </button>

                {/* Search Button */}
                <button className="flex items-center justify-center w-[34px] h-[34px] bg-paper-white border border-soft-border rounded-md text-muted hover:text-primary transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Project List */}
            <div className="flex flex-col divide-y divide-soft-border">
              
              {[
                { title: "Multimodal AI for Education", updated: "2 days", papers: 128, refs: 24, notes: 12 },
                { title: "Graph Neural Networks", updated: "5 days", papers: 86, refs: 18, notes: 7 },
                { title: "LLM Research Survey", updated: "1 week", papers: 142, refs: 31, notes: 15 },
                { title: "Computer Vision Benchmarking", updated: "2 weeks", papers: 76, refs: 14, notes: 9 },
                { title: "Time Series Forecasting", updated: "2 weeks", papers: 55, refs: 11, notes: 6 },
                { title: "Reinforcement Learning", updated: "3 weeks", papers: 64, refs: 10, notes: 8 },
              ].map((project, idx) => (
                <div key={idx} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 md:p-5 hover:bg-black/5 transition-colors group cursor-pointer gap-4 lg:gap-0">
                  
                  {/* Left: Icon & Title */}
                  <div className="flex items-center gap-4 md:gap-5 w-full lg:w-auto">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0">
                      <Folder className="w-5 h-5 md:w-6 md:h-6 text-accent fill-accent/20" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] md:text-[15px] font-bold text-primary mb-0.5 md:mb-1 group-hover:text-accent transition-colors truncate">
                        {project.title}
                      </h3>
                      <p className="text-[11px] md:text-[12px] font-medium text-muted">
                        Updated {project.updated} ago
                      </p>
                    </div>
                    {/* Mobile Options Button - Visible only on mobile */}
                    <button className="text-muted hover:text-primary transition-colors p-2 lg:hidden shrink-0">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Right: Stats & Options */}
                  <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto pl-14 md:pl-16 lg:pl-0">
                    {/* Stats */}
                    <div className="flex items-center gap-6 sm:gap-10 md:gap-12 w-full lg:w-auto justify-between sm:justify-start">
                      
                      <div className="flex items-start gap-2.5">
                        <FileText className="w-4 h-4 text-muted mt-0.5" />
                        <div>
                          <div className="text-[14px] font-medium text-primary leading-tight">{project.papers}</div>
                          <div className="text-[11px] font-medium text-muted">Papers</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2.5">
                        <Bookmark className="w-4 h-4 text-muted mt-0.5" />
                        <div>
                          <div className="text-[14px] font-medium text-primary leading-tight">{project.refs}</div>
                          <div className="text-[11px] font-medium text-muted">References</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2.5">
                        <File className="w-4 h-4 text-muted mt-0.5" />
                        <div>
                          <div className="text-[14px] font-medium text-primary leading-tight">{project.notes}</div>
                          <div className="text-[11px] font-medium text-muted">Notes</div>
                        </div>
                      </div>

                    </div>

                    {/* Options Button - Visible only on desktop */}
                    <button className="text-muted hover:text-primary transition-colors p-2 hidden lg:block ml-4 xl:ml-12 shrink-0">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                </div>
              ))}

            </div>
          </div>

          {/* Footer Hint */}
          <div className="flex items-center justify-center gap-4 py-8">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0">
              <Folder className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-primary mb-0.5">Need help organizing your research?</h4>
              <p className="text-[12px] font-medium text-muted">Create folders and projects to keep everything structured.</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
