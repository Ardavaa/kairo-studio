"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Menu, Home, Search, Book, User, Building2, 
  FileText, Sparkles, CheckSquare, FolderOpen, 
  HelpCircle, Settings, X, Bookmark, ChevronDown,
  Plus, Send, Scale, Target, Lightbulb, BarChart2,
  Shield, MessageSquare, RefreshCw
} from "lucide-react";


export default function AIAssistantPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex min-h-screen bg-warm-white text-primary font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[900px] bg-[radial-gradient(ellipse_at_50%_40%,rgba(234,88,12,0.12)_0%,transparent_70%)] pointer-events-none" />


      {/* Main Content */}
      <main className="flex-1 ml-[280px] min-w-0 flex flex-col relative z-10 animate-page-in">
        {/* Topbar */}
        <header className="h-[72px] flex items-center justify-end px-10 shrink-0">
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
              Journals & Conferences
            </a>
            <button className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors">
              Research Tools
              <ChevronDown className="w-4 h-4 text-muted" />
            </button>
            <a href="#" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors">
              <HelpCircle className="w-4 h-4 text-muted" />
              Help
            </a>
            <div className="w-px h-5 bg-soft-border mx-2" />
            <a href="#" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors">
              <Bookmark className="w-4 h-4 text-muted" />
              My Library
            </a>
            <button className="w-9 h-9 rounded-full bg-[#f4ece1] flex items-center justify-center text-sm font-bold text-primary ml-2 border border-soft-border hover:border-muted transition-colors">
              D
            </button>
          </div>
        </header>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-12 pt-8">
          <h1 className="font-serif text-[42px] font-normal text-primary mb-3">
            Ask away, Ardava!
          </h1>
          <p className="text-muted text-[15px] mb-10">
            Your AI partner for research. Ask anything or get help with your research tasks.
          </p>

          {/* Search/Chat Input Box */}
          <div className="w-full max-w-[800px] bg-paper-white rounded-[20px] shadow-sm border border-soft-border p-3 flex items-center gap-3 mb-10">
            <button className="w-11 h-11 rounded-full border border-soft-border flex items-center justify-center text-muted hover:text-primary hover:bg-black/5 transition-colors shrink-0">
              <Plus className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about your research..."
              className="flex-1 bg-transparent border-none outline-none text-primary placeholder:text-muted/70 text-[15px]"
            />
            <div className="flex items-center gap-3 shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors text-sm font-medium text-primary">
                Pro
                <ChevronDown className="w-4 h-4 text-muted" />
              </button>
              <button className="w-11 h-11 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent/90 transition-colors shadow-sm">
                <Send className="w-4 h-4 ml-[-2px]" />
              </button>
            </div>
          </div>

          <span className="text-[13px] text-muted mb-6">Try asking about</span>

          {/* Grid 1: 3x2 Action Cards */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-[800px] mb-8">
            <div className="bg-paper-white border border-soft-border rounded-xl p-5 hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[14px] font-semibold text-primary mb-1">Summarize a paper</h4>
                <p className="text-[12px] text-muted leading-relaxed">Get a concise summary of key findings and insights.</p>
              </div>
            </div>

            <div className="bg-paper-white border border-soft-border rounded-xl p-5 hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[14px] font-semibold text-primary mb-1">Compare methods</h4>
                <p className="text-[12px] text-muted leading-relaxed">Compare approaches, models, or techniques.</p>
              </div>
            </div>

            <div className="bg-paper-white border border-soft-border rounded-xl p-5 hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[14px] font-semibold text-primary mb-1">Find recent papers</h4>
                <p className="text-[12px] text-muted leading-relaxed">Discover the latest and most relevant papers.</p>
              </div>
            </div>

            <div className="bg-paper-white border border-soft-border rounded-xl p-5 hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[14px] font-semibold text-primary mb-1">Identify research gaps</h4>
                <p className="text-[12px] text-muted leading-relaxed">Find open problems and future research directions.</p>
              </div>
            </div>

            <div className="bg-paper-white border border-soft-border rounded-xl p-5 hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[14px] font-semibold text-primary mb-1">Explain a concept</h4>
                <p className="text-[12px] text-muted leading-relaxed">Get clear explanations for complex concepts.</p>
              </div>
            </div>

            <div className="bg-paper-white border border-soft-border rounded-xl p-5 hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[14px] font-semibold text-primary mb-1">Analyze a dataset</h4>
                <p className="text-[12px] text-muted leading-relaxed">Understand and explore your research data.</p>
              </div>
            </div>
          </div>


          {/* Privacy Badge */}
          <div className="bg-black/5 rounded-full py-2.5 px-5 flex items-center gap-2 text-[13px] text-primary/80 font-medium border border-black/5">
            <Shield className="w-4 h-4" />
            Your conversations are private and used only to help you with research.
          </div>

        </div>
      </main>
    </div>
  );
}
