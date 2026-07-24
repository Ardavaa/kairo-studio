"use client";
import { useState } from "react";
import {
  Search, Plus, LayoutTemplate, FolderPlus, 
  ChevronDown, LayoutGrid, List, BookOpen, 
  MessageSquare, Compass, Cloud, FileText,
  ChevronUp, HelpCircle, Bookmark
} from "lucide-react";
import Link from "next/link";

export default function ProjectWorkspacePage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  const projects = [
    { title: "Multimodal AI for Education", author: "Ardava", updated: "2 days", type: "document" },
    { title: "Graph Neural Networks Review", author: "Ardava", updated: "5 days", type: "document" },
    { title: "LLM Research Survey 2026", author: "Ardava", updated: "1 week", type: "document" },
    { title: "Computer Vision Benchmarks", author: "Ardava", updated: "2 weeks", type: "document" },
    { title: "Time Series Forecasting with Transformers", author: "Ardava", updated: "2 weeks", type: "document" },
    { title: "Reinforcement Learning Setup", author: "Ardava", updated: "3 weeks", type: "document" },
  ];

  const updates = [
    { title: "Secure your account with two-factor authentication", date: "Thursday, May 7" },
    { title: "HTML preview and export now available", date: "Wednesday, January 14" },
    { title: "Join the Meetup in Berlin on February 28", date: "Saturday, January 10" },
    { title: "Folders for projects and review-only shares", date: "Friday, September 26" },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-accent/20">
      <main className="flex-1 sidebar-aware-margin min-w-0 flex flex-col relative animate-page-in">
        
        {/* Topbar */}
        <header className="h-[72px] hidden lg:flex items-center justify-end px-10 shrink-0 relative z-10">
          <div className="flex items-center gap-8 text-[13px] font-medium text-gray-900">
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

        {/* Dashboard Header Container */}
        <div className="px-4 md:px-8 lg:px-12 pt-8 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-b border-gray-100">
          {/* Search Bar */}
          <div className="relative w-full md:w-[320px] lg:w-[400px] group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search in projects" 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200/80 rounded-lg text-[14px] outline-none focus:bg-white focus:border-accent/40 focus:ring-4 focus:ring-accent/10 transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]" 
            />
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-4 self-end md:self-auto">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-lg text-[13px] font-semibold hover:bg-emerald-100 active:scale-[0.97] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]">
              <ChevronUp className="w-3.5 h-3.5" /> Upgrade to Pro
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col xl:flex-row px-4 md:px-8 lg:px-12 py-10 gap-12 lg:gap-16 max-w-[1600px] mx-auto w-full">
          
          {/* Left Column (Projects) */}
          <div className="flex-1 min-w-0 flex flex-col gap-8">
            <h1 className="text-[28px] md:text-[32px] font-bold text-gray-900 tracking-tight">Dashboard</h1>

            {/* Create Cards */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 flex items-center p-4 lg:p-5 bg-white border border-gray-200/80 rounded-xl hover:border-gray-300 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] text-left group">
                <div className="w-12 h-12 flex items-center justify-center mr-5 shrink-0">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-[15px] mb-0.5">Empty document</h3>
                  <p className="text-gray-500 text-[13px]">Start from scratch</p>
                </div>
              </button>
              
              <div className="flex-1 flex bg-white border border-gray-200/80 rounded-xl hover:border-gray-300 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group">
                <button className="flex-1 flex items-center p-4 lg:p-5 text-left active:scale-[0.98] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] origin-left rounded-l-xl">
                  <div className="w-12 h-12 flex items-center justify-center mr-5 shrink-0">
                    <LayoutTemplate className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-[15px] mb-0.5">Start from template</h3>
                    <p className="text-gray-500 text-[13px]">Configure a template to get going</p>
                  </div>
                </button>
                <div className="w-12 border-l border-gray-100 flex items-center justify-center hover:bg-gray-50 cursor-pointer rounded-r-xl transition-colors shrink-0">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-4">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200/80 rounded-lg text-[13px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.97] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-sm">
                <FolderPlus className="w-4 h-4" /> New folder
              </button>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="flex items-center gap-2 text-[13px] text-gray-500">
                  sort by
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200/80 rounded-md text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">
                    last modified <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
                <div className="flex items-center border border-gray-200/80 rounded-lg p-1 bg-white shadow-sm">
                  <button 
                    onClick={() => setView("grid")}
                    className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-accent/10 text-accent" : "text-gray-400 hover:text-gray-700"}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setView("list")}
                    className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-accent/10 text-accent" : "text-gray-400 hover:text-gray-700"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Project Grid */}
            <div className={`grid gap-6 ${view === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5" : "grid-cols-1"}`}>
              {projects.map((project, idx) => (
                view === "grid" ? (
                  <Link href={`/editor/${idx + 1}`} key={idx} className="group cursor-pointer flex flex-col gap-3">
                    {/* Document Preview (Paper) */}
                    <div className="aspect-[1/1.414] bg-white border border-gray-200/80 rounded-lg shadow-sm relative overflow-hidden group-hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] group-hover:-translate-y-1 group-hover:border-gray-300 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] origin-bottom">
                      
                      {/* Fake document content */}
                      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col items-center">
                        <div className="text-[9px] sm:text-[10px] font-serif font-bold text-gray-800 leading-snug mb-3 text-center line-clamp-3">
                          {project.title}
                        </div>
                        <div className="w-full h-[1px] bg-gray-100 my-1" />
                        <div className="text-[4px] text-gray-400 space-y-1.5 w-full mt-3 opacity-60">
                          <div className="w-full h-[3px] bg-gray-100 rounded-full" />
                          <div className="w-full h-[3px] bg-gray-100 rounded-full" />
                          <div className="w-5/6 h-[3px] bg-gray-100 rounded-full" />
                          <div className="w-full h-[3px] bg-gray-100 rounded-full mt-3" />
                          <div className="w-4/5 h-[3px] bg-gray-100 rounded-full" />
                        </div>
                      </div>
                      
                      {/* Folded corner effect */}
                      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-gray-50 to-transparent border-l border-b border-gray-100 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Title & Metadata */}
                    <div className="flex flex-col items-center text-center px-2">
                      <h3 className="text-[14px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-accent transition-colors">{project.title}</h3>
                    </div>
                  </Link>
                ) : (
                  <Link href={`/editor/${idx + 1}`} key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-200/80 rounded-xl hover:border-gray-300 hover:shadow-sm active:scale-[0.99] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-12 bg-gray-50 border border-gray-200 rounded flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-accent transition-colors">{project.title}</h3>
                        <p className="text-[13px] text-gray-500">Updated {project.updated} ago</p>
                      </div>
                    </div>
                  </Link>
                )
              ))}
            </div>

          </div>

          {/* Right Sidebar */}
          <aside className="w-full xl:w-[280px] shrink-0 flex flex-col gap-10">
            
            {/* Action Links */}
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-3 p-3.5 bg-white border border-gray-200/80 rounded-xl text-[14px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] text-left">
                <BookOpen className="w-4 h-4 text-gray-400" /> Learn how to use Kairo
              </button>
              <button className="flex items-center gap-3 p-3.5 bg-white border border-gray-200/80 rounded-xl text-[14px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] text-left">
                <Compass className="w-4 h-4 text-gray-400" /> Explore packages and templates
              </button>
              <button className="flex items-center gap-3 p-3.5 bg-white border border-gray-200/80 rounded-xl text-[14px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] text-left">
                <MessageSquare className="w-4 h-4 text-gray-400" /> Chat with the community
              </button>
            </div>

            {/* Updates */}
            <div>
              <h3 className="font-bold text-[16px] text-gray-900 mb-5">Updates</h3>
              <div className="flex flex-col gap-6">
                {updates.map((update, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <h4 className="text-[14px] font-medium text-gray-900 leading-snug group-hover:text-accent transition-colors mb-1.5">
                      {update.title}
                    </h4>
                    <p className="text-[12.5px] text-gray-500">{update.date}</p>
                  </div>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </main>
    </div>
  );
}
