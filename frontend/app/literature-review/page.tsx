"use client";
import Link from "next/link";
import {
  Menu, Home, Search, Book, User, Building2,
  FileText, Sparkles, CheckSquare, FolderOpen,
  ChevronDown, HelpCircle, Bookmark, PlayCircle,
  Folder, Info, SearchCode, ListFilter, Focus, Network,
  PenTool, Quote, GripVertical, Save, File, Plus,
  CheckCircle2, Circle, Settings, Check, X
} from "lucide-react";

export default function LiteratureReviewPage() {
  return (
    <div className="flex min-h-screen bg-warm-white text-primary font-sans">
      

      {/* Main Area */}
      <main className="flex-1 ml-0 md:ml-[280px] pt-[60px] md:pt-0 min-w-0 flex flex-col bg-warm-white relative animate-page-in">
        
        {/* Topbar */}
        <header className="h-[72px] bg-warm-white/90 backdrop-blur hidden md:flex items-center justify-end px-10 sticky top-0 z-30">
          <div className="flex items-center gap-8 text-[13px] font-medium text-primary">
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
            <button className="w-8 h-8 rounded-full bg-[#f4e6df] text-[#a54c30] flex items-center justify-center font-bold text-sm">
              D
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col xl:flex-row px-4 md:px-10 pb-16 gap-6 xl:gap-10">
          
          {/* Main Form Column */}
          <div className="flex-1 min-w-0 flex flex-col relative">
            
            {/* Header */}
            <div className="relative pt-4 md:pt-6 pb-6 md:pb-8">
              <div className="absolute right-0 top-0 pointer-events-none w-[500px] h-full hidden xl:flex items-center justify-end overflow-hidden opacity-60">
                <img src="/building-structure.png" alt="Building Structure" className="w-full h-auto object-contain object-right" />
              </div>

              <div className="relative z-10 max-w-[800px]">
                <h1 className="font-serif text-3xl md:text-[42px] leading-tight text-primary mb-3">
                  Literature Review
                </h1>
                <p className="text-sm md:text-base text-muted mb-4">
                  Generate comprehensive literature reviews with the power of AI.
                </p>
                <button className="flex items-center gap-2 text-accent font-medium text-[13px] hover:underline">
                  <PlayCircle className="w-4 h-4" /> How it works
                </button>
              </div>
            </div>

            {/* Tabs Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 bg-paper-white border-b-2 border-accent rounded-t-xl p-5 cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h3 className="font-bold text-[15px] text-primary">AI Research Planner</h3>
                  <span className="px-2 py-0.5 bg-orange-100 text-accent text-[10px] font-bold rounded-full uppercase tracking-wider">New</span>
                </div>
                <p className="text-[13px] text-muted pl-8 leading-snug">
                  Describe your topic and let AI find<br/>and organize relevant papers.
                </p>
              </div>
              
              <div className="flex-1 bg-paper-white/50 border border-soft-border border-b-0 rounded-t-xl p-5 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3 mb-2">
                  <Folder className="w-5 h-5 text-muted" />
                  <h3 className="font-bold text-[15px] text-primary">From Library</h3>
                </div>
                <p className="text-[13px] text-muted pl-8 leading-snug">
                  Select from your saved papers<br/>in the library.
                </p>
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-paper-white border border-soft-border rounded-xl sm:rounded-tl-none p-5 sm:p-8 shadow-sm flex flex-col gap-8 sm:gap-10">
              
              {/* Step 1 */}
              <div>
                <h2 className="flex items-center gap-2 text-[15px] font-bold text-primary mb-4">
                  <Sparkles className="w-4 h-4" /> 1. Describe your research topic
                </h2>
                <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
                  <div className="flex-1">
                    <div className="relative mb-4">
                      <textarea 
                        className="w-full h-[140px] border border-soft-border rounded-xl p-4 text-[14px] text-primary resize-none focus:outline-none focus:border-muted placeholder:text-muted/60"
                        placeholder="Example: I want to review recent multimodal fusion techniques for plant disease detection using UAV imagery published after 2022."
                      ></textarea>
                      <span className="absolute bottom-4 right-4 text-[11px] text-muted font-medium">0 / 2000</span>
                    </div>
                    
                    <p className="text-[12px] text-muted mb-3 font-medium">Try example topics</p>
                    <div className="flex flex-wrap gap-2.5">
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-black/5 hover:bg-black/10 rounded-full text-[12px] text-primary font-medium transition-colors">
                        <Search className="w-3.5 h-3.5 text-muted" /> Multimodal fusion for healthcare
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-black/5 hover:bg-black/10 rounded-full text-[12px] text-primary font-medium transition-colors">
                        <Search className="w-3.5 h-3.5 text-muted" /> LLMs for code generation
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-black/5 hover:bg-black/10 rounded-full text-[12px] text-primary font-medium transition-colors">
                        <Search className="w-3.5 h-3.5 text-muted" /> Graph neural networks in medicine
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-black/5 hover:bg-black/10 rounded-full text-[12px] text-primary font-medium transition-colors">
                        <Search className="w-3.5 h-3.5 text-muted" /> AI for climate change prediction
                      </button>
                    </div>
                  </div>
                  
                  <div className="w-full xl:w-[280px] shrink-0 bg-warm-white/50 rounded-xl p-5">
                    <h4 className="text-[13px] font-bold text-primary mb-4">What AI will do</h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 text-[12px] text-primary/80 font-medium">
                        <Search className="w-4 h-4 text-muted shrink-0" /> Search multiple academic sources
                      </li>
                      <li className="flex items-start gap-3 text-[12px] text-primary/80 font-medium">
                        <ListFilter className="w-4 h-4 text-muted shrink-0" /> Rank and filter high-quality papers
                      </li>
                      <li className="flex items-start gap-3 text-[12px] text-primary/80 font-medium">
                        <Focus className="w-4 h-4 text-muted shrink-0" /> Extract key information
                      </li>
                      <li className="flex items-start gap-3 text-[12px] text-primary/80 font-medium">
                        <Network className="w-4 h-4 text-muted shrink-0" /> Cluster topics and identify trends
                      </li>
                      <li className="flex items-start gap-3 text-[12px] text-primary/80 font-medium">
                        <PenTool className="w-4 h-4 text-muted shrink-0" /> Synthesize and write review
                      </li>
                      <li className="flex items-start gap-3 text-[12px] text-primary/80 font-medium">
                        <Quote className="w-4 h-4 text-muted shrink-0" /> Cite all sources properly
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div>
                <h2 className="flex items-center gap-2 text-[15px] font-bold text-primary mb-4">
                  2. Choose review type <Info className="w-3.5 h-3.5 text-muted cursor-pointer" />
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  
                  {/* Card 1 (Active) */}
                  <div className="border border-accent bg-accent/5 rounded-xl p-4 cursor-pointer relative overflow-hidden">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-4 h-4 rounded-full border-[4px] border-accent flex items-center justify-center shrink-0 bg-white"></div>
                        <h4 className="font-bold text-[13px] text-primary">Survey Paper</h4>
                     </div>
                     <p className="text-[11px] text-primary/80 leading-snug pl-7">Comprehensive overview of a research area.</p>
                  </div>

                  {/* Card 2 */}
                  <div className="border border-soft-border bg-white rounded-xl p-4 cursor-pointer hover:border-muted transition-colors">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-4 h-4 rounded-full border border-soft-border shrink-0"></div>
                        <h4 className="font-bold text-[13px] text-primary">Narrative Review</h4>
                     </div>
                     <p className="text-[11px] text-primary/80 leading-snug pl-7">Broad overview with flexible approach.</p>
                  </div>

                  {/* Card 3 */}
                  <div className="border border-soft-border bg-white rounded-xl p-4 cursor-pointer hover:border-muted transition-colors">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-4 h-4 rounded-full border border-soft-border shrink-0"></div>
                        <h4 className="font-bold text-[13px] text-primary">Systematic Review</h4>
                     </div>
                     <p className="text-[11px] text-primary/80 leading-snug pl-7">Rigorous and reproducible methodology.</p>
                  </div>

                  {/* Card 4 */}
                  <div className="border border-soft-border bg-white rounded-xl p-4 cursor-pointer hover:border-muted transition-colors">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-4 h-4 rounded-full border border-soft-border shrink-0"></div>
                        <h4 className="font-bold text-[13px] text-primary">Rapid Review</h4>
                     </div>
                     <p className="text-[11px] text-primary/80 leading-snug pl-7">Quick summary of evidence.</p>
                  </div>

                </div>
              </div>

              {/* Steps 3, 4, 5 Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                
                {/* 3. Sources */}
                <div className="md:col-span-5">
                   <h2 className="flex items-center gap-2 text-[13px] font-bold text-primary mb-4">
                     3. Sources <Info className="w-3.5 h-3.5 text-muted cursor-pointer" />
                   </h2>
                   <div className="flex flex-wrap gap-3 mb-4">
                      {/* Checkboxes with logos/text */}
                      <label className="flex items-center gap-2 px-3 py-1.5 border border-soft-border rounded-md bg-white text-[12px] font-medium text-primary cursor-pointer">
                         <div className="w-3.5 h-3.5 rounded bg-accent text-white flex items-center justify-center"><Check className="w-2.5 h-2.5" /></div>
                         <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center text-white font-serif text-[10px] italic">S</div> Scopus
                      </label>
                      <label className="flex items-center gap-2 px-3 py-1.5 border border-soft-border rounded-md bg-white text-[12px] font-medium text-primary cursor-pointer">
                         <div className="w-3.5 h-3.5 rounded bg-accent text-white flex items-center justify-center"><Check className="w-2.5 h-2.5" /></div>
                         <div className="w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center text-white font-serif text-[10px]">SD</div> ScienceDirect
                      </label>
                      <label className="flex items-center gap-2 px-3 py-1.5 border border-soft-border rounded-md bg-white text-[12px] font-medium text-primary cursor-pointer">
                         <div className="w-3.5 h-3.5 rounded bg-accent text-white flex items-center justify-center"><Check className="w-2.5 h-2.5" /></div>
                         <div className="w-4 h-4 bg-blue-800 rounded-sm flex items-center justify-center text-white font-serif text-[10px]">IE</div> IEEE Xplore
                      </label>
                      <label className="flex items-center gap-2 px-3 py-1.5 border border-soft-border rounded-md bg-white text-[12px] font-medium text-primary cursor-pointer">
                         <div className="w-3.5 h-3.5 rounded bg-accent text-white flex items-center justify-center"><Check className="w-2.5 h-2.5" /></div>
                         <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center text-white font-serif text-[10px]">acm</div> ACM Digital Library
                      </label>
                      <label className="flex items-center gap-2 px-3 py-1.5 border border-soft-border rounded-md bg-white text-[12px] font-medium text-primary cursor-pointer">
                         <div className="w-3.5 h-3.5 rounded bg-accent text-white flex items-center justify-center"><Check className="w-2.5 h-2.5" /></div>
                         <span className="font-serif italic font-bold">arXiv</span>
                      </label>
                      <label className="flex items-center gap-2 px-3 py-1.5 border border-soft-border rounded-md bg-white text-[12px] font-medium text-primary cursor-pointer opacity-70">
                         <div className="w-3.5 h-3.5 rounded border border-soft-border bg-white"></div>
                         <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center text-white font-serif text-[10px]">Sp</div> SpringerLink
                      </label>
                   </div>
                   <button className="flex items-center gap-1.5 px-3 py-1.5 border border-soft-border rounded-md bg-white text-[12px] font-medium text-primary hover:bg-black/5 transition-colors">
                      <Plus className="w-3.5 h-3.5 text-muted" /> Add source
                   </button>
                </div>

                {/* 4. Publication year range */}
                <div className="md:col-span-4 pl-0 md:pl-4 border-none md:border-l border-t border-soft-border md:border-t-0 pt-6 md:pt-0">
                   <h2 className="flex items-center gap-2 text-[13px] font-bold text-primary mb-4">
                     4. Publication year range <Info className="w-3.5 h-3.5 text-muted cursor-pointer" />
                   </h2>
                   <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 flex items-center justify-between border border-soft-border rounded-md px-3 py-2 text-[13px] bg-white">
                         2021 <ChevronDown className="w-3.5 h-3.5 text-muted" />
                      </div>
                      <span className="text-muted">-</span>
                      <div className="flex-1 flex items-center justify-between border border-soft-border rounded-md px-3 py-2 text-[13px] bg-white">
                         2026 <ChevronDown className="w-3.5 h-3.5 text-muted" />
                      </div>
                   </div>
                   <div className="relative mb-2 mt-2 px-1">
                      <div className="h-1 bg-accent/20 rounded-full w-full"></div>
                      <div className="h-1 bg-accent rounded-full w-[80%] absolute top-0 left-[20%]"></div>
                      <div className="w-3 h-3 bg-white border-2 border-accent rounded-full absolute top-1/2 -translate-y-1/2 left-[20%] -ml-1.5 shadow-sm"></div>
                      <div className="w-3 h-3 bg-white border-2 border-accent rounded-full absolute top-1/2 -translate-y-1/2 right-0 -mr-1.5 shadow-sm"></div>
                   </div>
                   <p className="text-[11px] text-muted font-medium px-1">Last 5 years</p>
                </div>

                {/* 5. Reference style */}
                <div className="md:col-span-3 pl-0 md:pl-4 border-none md:border-l border-t border-soft-border md:border-t-0 pt-6 md:pt-0">
                   <h2 className="flex items-center gap-2 text-[13px] font-bold text-primary mb-4">
                     5. Reference style <Info className="w-3.5 h-3.5 text-muted cursor-pointer" />
                   </h2>
                   <div className="flex items-center justify-between border border-soft-border rounded-md px-3 py-2 text-[13px] bg-white w-full">
                      IEEE <ChevronDown className="w-3.5 h-3.5 text-muted" />
                   </div>
                </div>

              </div>
              
              {/* Action Button */}
              <div className="mt-4 text-center">
                 <button className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3.5 rounded-xl font-bold text-[15px] shadow-sm hover:bg-accent/90 transition-colors">
                    <Sparkles className="w-5 h-5" /> Start Research Review
                 </button>
                 <p className="text-[12px] text-muted font-medium mt-3">
                    Estimated time: 3-6 minutes depending on topic and sources
                 </p>
              </div>

            </div>
          </div>

          {/* Right Sidebar (Review Configuration) */}
          <div className="w-full xl:w-[320px] shrink-0">
             <div className="bg-paper-white border border-soft-border rounded-xl p-6 shadow-sm sticky top-28">
                
                <div className="flex items-center justify-between mb-8">
                   <h2 className="font-bold text-[15px] text-primary">Review Configuration</h2>
                   <Save className="w-4 h-4 text-muted cursor-pointer hover:text-primary transition-colors" />
                </div>

                {/* Papers to include */}
                <div className="mb-8">
                   <h3 className="text-[13px] font-bold text-primary mb-3">Papers to include</h3>
                   <div className="border border-dashed border-soft-border rounded-xl bg-warm-white flex flex-col items-center justify-center py-8 px-4 text-center mb-3">
                      <File className="w-6 h-6 text-muted mb-3" />
                      <h4 className="font-bold text-[13px] text-primary mb-1">No papers selected yet</h4>
                      <p className="text-[11px] text-muted leading-snug">AI will search and select the most<br/>relevant papers for your topic.</p>
                   </div>
                   <div className="flex items-center justify-between px-1">
                      <span className="text-[12px] font-medium text-muted">Est. papers to analyze</span>
                      <span className="text-[12px] font-bold text-accent">~ 30 - 80 papers</span>
                   </div>
                </div>

                {/* Review Structure */}
                <div>
                   <h3 className="text-[13px] font-bold text-primary mb-1">Review structure <span className="text-muted font-medium font-sans">(AI will generate)</span></h3>
                   <div className="space-y-2 mt-4">
                      {["Introduction", "Research Landscape", "Existing Methods", "Datasets and Benchmarks", "Limitations", "Research Gaps", "Future Directions", "Conclusion"].map((section, idx) => (
                         <div key={idx} className="flex items-center justify-between px-4 py-3 bg-white border border-soft-border rounded-lg text-[12px] font-medium text-primary cursor-move hover:border-muted transition-colors">
                            {section}
                            <GripVertical className="w-3.5 h-3.5 text-muted opacity-50" />
                         </div>
                      ))}
                   </div>
                   
                   <div className="flex items-center gap-1.5 mt-6 mb-3">
                      <h3 className="text-[12px] font-bold text-primary">Custom section</h3>
                      <Info className="w-3 h-3 text-muted" />
                   </div>
                   <button className="w-full flex items-center justify-center gap-2 py-3 border border-accent text-accent rounded-lg text-[13px] font-bold hover:bg-accent/5 transition-colors">
                      <Plus className="w-4 h-4" /> Add custom section
                   </button>
                </div>

             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
