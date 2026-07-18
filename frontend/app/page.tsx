"use client";
import { useState } from "react";
import {
  Menu, Home, Search, Book, User, Building2,
  FileText, Sparkles, CheckSquare, FolderOpen,
  ChevronDown, HelpCircle, Bookmark, ArrowRight, ChevronRight,
  Monitor, Calculator, Briefcase, GraduationCap, Code,
  Microscope, Zap, Database, HeartPulse, TestTube2, 
  BrainCircuit, Activity, Globe, Leaf, Lightbulb, Users,
  TrendingUp, Share2, HeartHandshake, Palette,
  Settings, Atom, FlaskConical, Hexagon,
  LineChart, Network, Landmark, X
} from "lucide-react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-warm-white text-primary">

      {/* Main Content */}
      <main className="flex-1 ml-[280px] min-w-0 flex flex-col relative animate-page-in">
        {/* Topbar */}
        <header className="h-[72px] bg-warm-white flex items-center justify-between px-10 sticky top-0 z-20">
          <div className="flex items-center gap-8">
            {/* Left side empty for spacing */}
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-primary">
            <a href="#" className="hover:text-accent transition-colors">Journals & Conferences</a>
            <button className="flex items-center gap-1.5 hover:text-accent transition-colors">
              Research Tools <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <a href="#" className="flex items-center gap-2 hover:text-accent transition-colors">
              <HelpCircle className="w-4 h-4" /> Help
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Bookmark className="w-4 h-4" /> My Library
            </a>
            <button className="px-5 py-2 text-accent border border-soft-border rounded hover:bg-accent/5 hover:border-accent transition-all bg-paper-white">
              Sign in
            </button>
          </div>
        </header>
        <div className="h-px bg-soft-border absolute top-[72px] left-0 right-0 z-20"></div>

        <div className="flex-1 overflow-y-auto">
          {/* Hero */}
          <section className="px-10 pt-16 pb-16 relative overflow-hidden">
            {/* Building illustration */}
            <div className="absolute right-0 top-10 bottom-0 pointer-events-none w-[700px] flex items-end justify-end">
              <img src="/building-structure.png" alt="Building Structure" className="w-full h-auto object-contain object-right" />
            </div>

            <div className="max-w-[800px] relative z-10">
              <h1 className="font-serif text-[56px] leading-[1.1] text-primary mb-5">
                Discover and analyze<br/>world-class research
              </h1>
              <p className="text-lg text-muted mb-10 max-w-[500px] leading-relaxed">
                Search across millions of peer-reviewed articles, journals, books, and conference papers.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-[900px] relative z-10">
              <div className="flex bg-paper-white rounded shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-soft-border overflow-hidden mb-6 h-14">
                <button className="flex items-center justify-between gap-3 px-5 text-sm font-medium text-primary border-r border-soft-border hover:bg-black/5 whitespace-nowrap min-w-[140px]">
                  All fields <ChevronDown className="w-4 h-4 text-muted" />
                </button>
                <input 
                  type="text" 
                  placeholder="Search for articles, journals, keywords, authors..."
                  className="flex-1 px-5 text-[15px] outline-none bg-transparent placeholder:text-muted/70"
                />
                <button className="bg-accent text-white px-8 flex items-center justify-center hover:bg-accent/90 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-muted mr-1">Search tips:</span>
                  <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-paper-white rounded-full border border-soft-border hover:border-muted transition-colors text-primary">
                    <span className="font-serif font-black text-base leading-none -mt-0.5">""</span> Exact phrases
                  </button>
                  <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-paper-white rounded-full border border-soft-border hover:border-muted transition-colors text-primary">
                    <User className="w-3.5 h-3.5" /> Author name
                  </button>
                  <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-paper-white rounded-full border border-soft-border hover:border-muted transition-colors text-primary">
                    <Book className="w-3.5 h-3.5" /> Journal title
                  </button>
                </div>
                <a href="#" className="flex items-center gap-1 text-accent font-medium hover:underline">
                  Advanced search <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </section>

          {/* Stats Bar */}
          <section className="border-y border-soft-border bg-paper-white">
            <div className="max-w-[1280px] px-10 py-8 grid grid-cols-5 gap-0 divide-x divide-soft-border">
              <div className="flex items-center gap-4 px-6 first:pl-0">
                <FileText className="w-8 h-8 text-primary/40 stroke-[1.5]" />
                <div>
                  <div className="text-xl font-bold text-primary">100M+</div>
                  <div className="text-[13px] text-muted">Documents</div>
                </div>
              </div>
              <div className="flex items-center gap-4 px-6">
                <Book className="w-8 h-8 text-primary/40 stroke-[1.5]" />
                <div>
                  <div className="text-xl font-bold text-primary">28,000+</div>
                  <div className="text-[13px] text-muted">Journals</div>
                </div>
              </div>
              <div className="flex items-center gap-4 px-6">
                <User className="w-8 h-8 text-primary/40 stroke-[1.5]" />
                <div>
                  <div className="text-xl font-bold text-primary">20M+</div>
                  <div className="text-[13px] text-muted">Author profiles</div>
                </div>
              </div>
              <div className="flex items-center gap-4 px-6">
                <Building2 className="w-8 h-8 text-primary/40 stroke-[1.5]" />
                <div>
                  <div className="text-xl font-bold text-primary">90,000+</div>
                  <div className="text-[13px] text-muted">Institutions</div>
                </div>
              </div>
              <div className="flex items-center gap-4 px-6">
                <Globe className="w-8 h-8 text-primary/40 stroke-[1.5]" />
                <div>
                  <div className="text-xl font-bold text-primary">7,000+</div>
                  <div className="text-[13px] text-muted">Publishers</div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content Grid */}
          <section className="max-w-[1440px] px-10 py-12">
            <div className="grid grid-cols-12 gap-10">
              
              {/* Left Column (8 cols) */}
              <div className="col-span-8 space-y-16">
                
                {/* Explore by Subject Area */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[20px] font-bold text-primary">Explore by subject area</h2>
                    <a href="#" className="text-[13px] font-medium text-accent hover:underline">View all subjects</a>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-y-7 gap-x-6">
                    {/* Column 1 */}
                    <div className="space-y-5">
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <Monitor className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> Computer Science
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <Settings className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> Engineering
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <HeartPulse className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> Medicine & Health
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <Users className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> Social Sciences
                      </a>
                    </div>
                    {/* Column 2 */}
                    <div className="space-y-5">
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <Calculator className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> Mathematics
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <Atom className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> Physics & Astronomy
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <FlaskConical className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> Chemistry
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <Hexagon className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> Materials Science
                      </a>
                    </div>
                    {/* Column 3 */}
                    <div className="space-y-5">
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <Briefcase className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> 
                        <span className="leading-tight">Business, Management<br/>& Accounting</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <Leaf className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> Environmental Science
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <Zap className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> Energy
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <BrainCircuit className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> Psychology
                      </a>
                    </div>
                    {/* Column 4 */}
                    <div className="space-y-5">
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <Landmark className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> Arts & Humanities
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <LineChart className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> 
                        <span className="leading-tight">Economics, Econometrics<br/>& Finance</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <Network className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> Decision Sciences
                      </a>
                      <a href="#" className="flex items-center gap-3 text-[13px] font-medium text-primary hover:text-accent group">
                        <Activity className="w-5 h-5 text-muted group-hover:text-accent transition-colors stroke-[1.5]" /> Nursing
                      </a>
                    </div>
                  </div>
                </div>

                {/* Featured Journals */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[20px] font-bold text-primary">Featured journals</h2>
                    <a href="#" className="text-[13px] font-medium text-accent hover:underline">View all journals</a>
                  </div>

                  <div className="grid grid-cols-3 gap-6 relative">
                    {/* Journal Card 1 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-20 bg-[#004A7F] rounded shadow-sm flex-shrink-0 flex items-start justify-center pt-2 text-[6px] text-white/70 tracking-widest font-serif border-l-4 border-[#002a4a]">THE LANCET</div>
                      <div>
                        <a href="#" className="text-[13px] font-semibold text-accent hover:underline block mb-1">The Lancet</a>
                        <div className="text-[11px] text-muted leading-tight">
                          Volume 406, Issue 10559<br/>
                          4 October 2025
                        </div>
                      </div>
                    </div>

                    {/* Journal Card 2 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-20 bg-slate-900 rounded shadow-sm flex-shrink-0 flex items-start justify-center pt-2 text-[10px] text-white tracking-wider font-sans font-bold border-t-2 border-l-2 border-red-500 overflow-hidden relative">
                        <span className="z-10">Science</span>
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 to-transparent"></div>
                      </div>
                      <div>
                        <a href="#" className="text-[13px] font-semibold text-accent hover:underline block mb-1">Science</a>
                        <div className="text-[11px] text-muted leading-tight">
                          Volume 390, Issue 6769<br/>
                          3 October 2025
                        </div>
                      </div>
                    </div>

                    {/* Journal Card 3 */}
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-20 bg-[#E21F26] rounded shadow-sm flex-shrink-0 flex items-start justify-center pt-2 text-[10px] text-white font-serif font-bold relative overflow-hidden">
                        <span className="z-10">Nature</span>
                        <div className="absolute -bottom-2 right-0 opacity-30 text-4xl text-black">N</div>
                      </div>
                      <div>
                        <a href="#" className="text-[13px] font-semibold text-accent hover:underline block mb-1">Nature</a>
                        <div className="text-[11px] text-muted leading-tight">
                          Volume 645, Issue 7826<br/>
                          2 October 2025
                        </div>
                      </div>
                    </div>

                    {/* Next Button */}
                    <button className="absolute -right-4 top-[40%] -translate-y-1/2 w-8 h-8 bg-paper-white border border-soft-border rounded-full shadow-sm flex items-center justify-center hover:bg-black/5 text-primary">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column (4 cols) */}
              <div className="col-span-4">
                <div className="bg-paper-white rounded-xl border border-soft-border p-6 shadow-sm">
                  <h2 className="text-[16px] font-bold text-primary mb-6">Stay informed</h2>
                  
                  {/* Tabs */}
                  <div className="flex gap-6 border-b border-soft-border mb-6">
                    <button className="pb-3 text-[13px] font-medium text-accent border-b-2 border-accent">Trending</button>
                    <button className="pb-3 text-[13px] font-medium text-muted hover:text-primary">Most Cited</button>
                  </div>

                  {/* List */}
                  <div className="space-y-6">
                    {/* Item 1 */}
                    <div className="relative pl-5">
                      <div className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <a href="#" className="text-[13px] font-medium text-accent hover:underline block mb-1">Artificial Intelligence</a>
                      <p className="text-[13px] text-primary mb-2 line-clamp-2 leading-relaxed">A survey on large language models for autonomous agents</p>
                      <div className="text-[11px] text-muted text-right">7 Oct 2025</div>
                    </div>
                    {/* Item 2 */}
                    <div className="relative pl-5">
                      <div className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <a href="#" className="text-[13px] font-medium text-accent hover:underline block mb-1">Renewable Energy</a>
                      <p className="text-[13px] text-primary mb-2 line-clamp-2 leading-relaxed">Advances in battery technology for sustainable energy storage</p>
                      <div className="text-[11px] text-muted text-right">6 Oct 2025</div>
                    </div>
                    {/* Item 3 */}
                    <div className="relative pl-5">
                      <div className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <a href="#" className="text-[13px] font-medium text-accent hover:underline block mb-1">Neuroscience</a>
                      <p className="text-[13px] text-primary mb-2 line-clamp-2 leading-relaxed">Brain-computer interfaces: Progress and challenges</p>
                      <div className="text-[11px] text-muted text-right">6 Oct 2025</div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <a href="#" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline">
                      View more trending articles <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Footer */}
          <footer className="bg-light-surface border-t border-soft-border py-12 px-10">
            <div className="max-w-[1440px] grid grid-cols-12 gap-12">
              <div className="col-span-5 pr-8">
                <div className="text-accent text-6xl leading-none font-serif mb-2 font-bold">"</div>
                <p className="text-primary text-[15px] font-medium leading-relaxed mb-4 relative -top-4">
                  Scopus is an essential tool for our researchers. The depth and quality of content help us make informed decisions and drive impactful research.
                </p>
                <div className="text-xs text-muted">
                  — Research Director, Global University
                </div>
              </div>

              <div className="col-span-3">
                <h4 className="font-bold text-primary mb-4 text-sm">About Kairo Studio</h4>
                <p className="text-xs text-muted leading-relaxed">
                  Empowering researchers with trusted content and advanced tools to accelerate discovery and innovation.
                </p>
              </div>

              <div className="col-span-2">
                <h4 className="font-bold text-primary mb-4 text-sm">Support</h4>
                <ul className="space-y-3 text-xs font-medium text-muted">
                  <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                </ul>
              </div>

              <div className="col-span-2">
                <h4 className="font-bold text-primary mb-4 text-sm">Connect with us</h4>
                <div className="flex items-center gap-2">
                  <a href="#" className="w-8 h-8 border border-soft-border rounded bg-paper-white flex items-center justify-center text-muted hover:text-primary transition-colors shadow-sm">
                    <span className="font-bold text-[10px]">in</span>
                  </a>
                  <a href="#" className="w-8 h-8 border border-soft-border rounded bg-paper-white flex items-center justify-center text-muted hover:text-primary transition-colors shadow-sm">
                    <span className="font-bold text-[10px]">X</span>
                  </a>
                  <a href="#" className="w-8 h-8 border border-soft-border rounded bg-paper-white flex items-center justify-center text-muted hover:text-primary transition-colors shadow-sm">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
