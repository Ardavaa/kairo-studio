"use client";
import { useState } from "react";
import {
  Menu, Home, Search, Book, User, Building2,
  FileText, Sparkles, CheckSquare, FolderOpen,
  ChevronDown, HelpCircle, Bookmark, ArrowRight,
  TrendingUp, Settings, X, Lightbulb, Check,
  List, LayoutGrid, Star, MoreVertical, FileCode2,
  BrainCircuit, LayoutTemplate, MessageSquare, Database,
  Monitor, Microscope, Calculator, Globe, Leaf, Briefcase, Activity,
  Network, LineChart, Atom, Unlock, Users, FlaskConical, Hexagon, Landmark
} from "lucide-react";
import Image from "next/image";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [isFilled, setIsFilled] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setIsFilled(false);
  };

  return (
    <div className="flex min-h-screen bg-warm-white text-primary">

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-[280px] pt-[60px] md:pt-0 min-w-0 flex flex-col relative bg-warm-white animate-page-in">
        {/* Topbar */}
        <header className="h-[72px] bg-warm-white/90 backdrop-blur hidden md:flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="flex items-center gap-8"></div>
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

        <div className="flex-1 flex flex-col px-4 md:px-10 pb-10 md:pb-20">
          
          {/* Header area */}
          <div className="relative pt-4 md:pt-8 pb-6 md:pb-8">
            {/* Background Image restricted to header */}
            <div className="absolute right-0 top-0 pointer-events-none w-[600px] h-full hidden xl:flex items-center justify-end overflow-hidden opacity-80">
              <img src="/building-structure.png" alt="Building Structure" className="w-full h-auto object-contain object-right" />
            </div>

            <div className="relative z-10 max-w-[800px] mb-6 md:mb-8">
              <h1 className="font-serif text-3xl md:text-[42px] leading-tight text-primary mb-3">
                Search Papers
              </h1>
              <p className="text-sm md:text-base text-muted">
                {isFilled ? "Discover and access high-quality research from trusted sources." : "Find research across millions of trusted sources."}
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative z-10 max-w-full flex flex-col sm:flex-row bg-transparent sm:bg-paper-white rounded-lg sm:shadow-[0_4px_16px_rgba(0,0,0,0.06)] sm:border border-soft-border overflow-hidden sm:h-14 gap-2 sm:gap-0">
              <button type="button" className="flex items-center justify-between gap-3 px-5 text-sm font-medium text-primary sm:border-r border-soft-border hover:bg-black/5 whitespace-nowrap sm:min-w-[140px] h-12 sm:h-full bg-paper-white border border-soft-border sm:border-none rounded-lg sm:rounded-none">
                All fields <ChevronDown className="w-4 h-4 text-muted" />
              </button>
              <div className="flex-1 flex items-center px-5 relative h-12 sm:h-full bg-paper-white border border-soft-border sm:border-none rounded-lg sm:rounded-none">
                <Search className="w-5 h-5 text-muted mr-3" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for articles, journals, authors, keywords, topics..."
                  className="w-full text-[15px] outline-none bg-transparent placeholder:text-muted/70 text-primary"
                />
                {query && (
                  <button type="button" onClick={clearSearch} className="p-1 hover:bg-black/5 rounded-full text-muted">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button type="submit" className="bg-accent text-white px-8 flex items-center justify-center hover:bg-accent/90 transition-colors h-12 sm:h-full sm:m-1.5 rounded-lg sm:rounded-md shadow-sm">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Main Layout Grid */}
          <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 flex-1 mt-4">
            
            {/* Left Content Area */}
            <div className="flex-1 min-w-0 flex flex-col">
              
              {!isFilled ? (
                // UNFILLED STATE
                <div className="space-y-12 animate-in fade-in duration-300">
                  {/* Try searching for */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm">
                    <span className="text-muted shrink-0">Try searching for:</span>
                    <div className="flex flex-wrap gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-paper-white border border-soft-border rounded-full hover:border-muted transition-colors text-primary font-medium text-[13px]">
                        <FileCode2 className="w-3.5 h-3.5 text-muted" /> Deep learning for medical imaging
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-paper-white border border-soft-border rounded-full hover:border-muted transition-colors text-primary font-medium text-[13px]">
                        <BrainCircuit className="w-3.5 h-3.5 text-muted" /> LLM alignment and safety
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-paper-white border border-soft-border rounded-full hover:border-muted transition-colors text-primary font-medium text-[13px]">
                        <Network className="w-3.5 h-3.5 text-muted" /> Graph neural networks
                      </button>
                      <button className="w-9 h-9 flex items-center justify-center bg-paper-white border border-soft-border rounded-full hover:border-muted transition-colors text-muted shrink-0">
                        <span className="mb-2">...</span>
                      </button>
                    </div>
                  </div>

                  {/* Explore popular research areas */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-primary">Explore popular research areas</h2>
                      <a href="#" className="text-[13px] font-medium text-accent hover:underline hidden sm:flex items-center gap-1">
                        View all subjects <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                      {/* Cards */}
                      {[
                        { icon: Monitor, name: "Computer Science", count: "12.4M+" },
                        { icon: Settings, name: "Engineering", count: "8.7M+" },
                        { icon: Activity, name: "Medicine & Health", count: "9.1M+" },
                        { icon: Calculator, name: "Mathematics", count: "5.3M+" },
                        { icon: Users, name: "Social Sciences", count: "6.2M+" },
                        { icon: LineChart, name: "Business & Economics", count: "4.8M+" },
                        { icon: Atom, name: "Physics & Astronomy", count: "3.6M+" },
                        { icon: Leaf, name: "Environmental Science", count: "2.9M+" },
                      ].map((subject, idx) => (
                        <div key={idx} className="bg-paper-white border border-soft-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-full border border-soft-border flex items-center justify-center text-muted shrink-0">
                            <subject.icon className="w-5 h-5 stroke-[1.5]" />
                          </div>
                          <div>
                            <h3 className="text-[13px] font-semibold text-primary mb-0.5">{subject.name}</h3>
                            <p className="text-[11px] text-muted">{subject.count} papers</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Recent search trends */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-primary">Recent search trends</h2>
                      <a href="#" className="text-[13px] font-medium text-accent hover:underline hidden sm:flex items-center gap-1">
                        View all trends <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6">
                      <div className="bg-paper-white border border-soft-border rounded-xl p-2 divide-y divide-soft-border">
                        {[
                          { name: "Multimodal fusion for sentiment analysis", count: "1,248" },
                          { name: "Transformer models in time series forecasting", count: "986" },
                          { name: "Graph neural networks for recommendation systems", count: "754" },
                        ].map((trend, i) => (
                          <div key={i} className="flex items-center justify-between px-4 py-3.5 hover:bg-black/5 cursor-pointer">
                            <div className="flex items-center gap-3 text-[13px] text-primary font-medium">
                              <TrendingUp className="w-4 h-4 text-muted" /> {trend.name}
                            </div>
                            <span className="text-[11px] text-muted">{trend.count} papers</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-paper-white border border-soft-border rounded-xl p-2 divide-y divide-soft-border">
                        {[
                          { name: "Large language models for code generation", count: "1,103" },
                          { name: "Federated learning in healthcare", count: "632" },
                          { name: "Diffusion models for image restoration", count: "581" },
                        ].map((trend, i) => (
                          <div key={i} className="flex items-center justify-between px-4 py-3.5 hover:bg-black/5 cursor-pointer">
                            <div className="flex items-center gap-3 text-[13px] text-primary font-medium">
                              <TrendingUp className="w-4 h-4 text-muted" /> {trend.name}
                            </div>
                            <span className="text-[11px] text-muted">{trend.count} papers</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Tip */}
                  <div className="bg-accent/5 rounded-xl border border-accent/20 p-5 flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="text-accent mt-0.5 shrink-0"><Lightbulb className="w-6 h-6 stroke-[1.5]" /></div>
                      <div>
                        <p className="text-[13px] text-primary font-medium mb-1">Tip: Use specific keywords, authors, or topics to get more relevant results.</p>
                        <p className="text-[13px] text-primary">You can also use filters on the right to narrow down your search.</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 text-[13px] font-semibold text-accent hover:underline shrink-0">
                      Advanced search <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ) : (
                // FILLED STATE
                <div className="flex flex-col h-full animate-in fade-in duration-300">
                  
                  {/* Quick Filters */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="text-[13px] text-muted mr-1">Quick filters:</span>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-paper-white border border-soft-border rounded-full text-[13px] font-medium text-primary hover:bg-black/5">
                      <FileCode2 className="w-3.5 h-3.5 text-muted" /> Computer Science <X className="w-3.5 h-3.5 text-muted ml-1" />
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-paper-white border border-soft-border rounded-full text-[13px] font-medium text-primary hover:bg-black/5">
                      Review Article
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-paper-white border border-soft-border rounded-full text-[13px] font-medium text-primary hover:bg-black/5">
                      Open Access
                    </button>
                    <button className="text-[13px] font-medium text-accent ml-2 hover:underline">
                      Clear all
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-soft-border mb-6 gap-4 sm:gap-0">
                    <div className="flex gap-6 overflow-x-auto no-scrollbar">
                      {["Papers", "Preprints", "Journals", "Authors", "Conferences"].map((tab, i) => (
                        <button key={i} className={`pb-3 text-[14px] font-medium whitespace-nowrap ${i === 0 ? 'text-accent border-b-2 border-accent' : 'text-muted hover:text-primary'}`}>
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pb-2 text-[13px]">
                      <span className="text-muted">12,842 results</span>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1.5 font-medium text-primary border border-soft-border rounded px-2.5 py-1.5 bg-paper-white hidden md:flex">
                          Most relevant <ChevronDown className="w-3.5 h-3.5 text-muted" />
                        </button>
                        <div className="flex items-center gap-1 bg-paper-white border border-soft-border rounded p-0.5">
                          <button className="p-1.5 bg-accent/10 text-accent rounded"><List className="w-4 h-4" /></button>
                          <button className="p-1.5 text-muted hover:text-primary"><LayoutGrid className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results List */}
                  <div className="space-y-4">
                    
                    {/* Paper 1 */}
                    <div className="bg-paper-white border border-soft-border rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:shadow-md transition-shadow relative">
                      <div className="hidden sm:flex flex-col items-center gap-4">
                        <div className="w-5 h-5 border border-soft-border rounded flex items-center justify-center"></div>
                        <span className="text-xs font-bold text-muted">1</span>
                      </div>
                      
                      {/* Thumbnail Placeholder */}
                      <div className="w-[120px] h-[160px] bg-white border border-soft-border shadow-sm flex flex-col p-2 shrink-0">
                        <div className="w-full h-2 bg-gray-200 mb-1"></div>
                        <div className="w-3/4 h-2 bg-gray-200 mb-2"></div>
                        <div className="w-full h-1 bg-gray-100 mb-0.5"></div>
                        <div className="w-full h-1 bg-gray-100 mb-0.5"></div>
                        <div className="w-5/6 h-1 bg-gray-100 mb-2"></div>
                        <div className="flex-1 grid grid-cols-2 gap-1 content-start mt-2">
                           <div className="bg-gray-200 h-8"></div>
                           <div className="bg-gray-200 h-8"></div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-primary mb-1">
                          Multimodal Fusion Techniques: A Comprehensive Survey
                        </h3>
                        <p className="text-[13px] text-primary mb-1">
                          Sakshini Hangloo, <span className="underline cursor-pointer">Bhavna Arora</span>
                        </p>
                        <p className="text-[13px] text-muted mb-3">
                          Neurocomputing, 2025 • 130827 • Elsevier
                        </p>
                        <p className="text-[13px] text-primary/80 mb-3 leading-relaxed line-clamp-2">
                          This survey provides a comprehensive overview of multimodal fusion techniques, including data representation, information fusion, and... <span className="text-accent font-medium cursor-pointer">Show more ∨</span>
                        </p>
                        <div className="flex gap-2 text-[11px] font-medium text-muted">
                          <span className="px-2.5 py-1 bg-black/5 rounded-full">Multimodal Learning</span>
                          <span className="px-2.5 py-1 bg-black/5 rounded-full">Surveys</span>
                          <span className="px-2.5 py-1 bg-black/5 rounded-full">Information Fusion</span>
                          <span className="px-2.5 py-1 bg-black/5 rounded-full">+2</span>
                        </div>
                      </div>

                      <div className="w-full sm:w-[140px] flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 sm:text-right mt-2 sm:mt-0">
                        <div className="flex gap-3 text-muted">
                          <button className="hover:text-accent"><Star className="w-5 h-5" /></button>
                          <button className="hover:text-accent"><Bookmark className="w-5 h-5" /></button>
                          <button className="hover:text-primary"><MoreVertical className="w-5 h-5" /></button>
                        </div>
                        <div className="sm:mt-4 text-center sm:mr-6 flex sm:block items-baseline gap-1">
                          <div className="text-[15px] font-bold text-[#0066cc]">1,432</div>
                          <div className="text-[11px] text-muted font-medium">Citations</div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700 sm:mr-2 sm:mt-auto">
                           <Unlock className="w-3.5 h-3.5" /> Open Access
                        </div>
                      </div>
                    </div>

                    {/* Paper 2 */}
                    <div className="bg-paper-white border border-soft-border rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:shadow-md transition-shadow relative">
                      <div className="hidden sm:flex flex-col items-center gap-4">
                        <div className="w-5 h-5 border border-soft-border rounded flex items-center justify-center"></div>
                        <span className="text-xs font-bold text-muted">2</span>
                      </div>
                      
                      <div className="w-[120px] h-[160px] bg-white border border-soft-border shadow-sm flex flex-col p-2 shrink-0">
                        <div className="w-full h-2 bg-gray-200 mb-1"></div>
                        <div className="w-5/6 h-2 bg-gray-200 mb-2"></div>
                        <div className="w-full h-1 bg-gray-100 mb-0.5"></div>
                        <div className="flex gap-1 mt-2 mb-2">
                           <div className="bg-blue-100 h-6 w-1/3"></div>
                           <div className="bg-red-100 h-6 w-1/3"></div>
                           <div className="bg-green-100 h-6 w-1/3"></div>
                        </div>
                        <div className="w-full h-1 bg-gray-100 mb-0.5"></div>
                        <div className="w-full h-1 bg-gray-100 mb-0.5"></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-primary mb-1">
                          A Survey on Multimodal Deep Learning for Sentiment Analysis
                        </h3>
                        <p className="text-[13px] text-primary mb-1">
                          Z. Zadeh, P. Poria, E. Cambria
                        </p>
                        <p className="text-[13px] text-muted mb-3">
                          IEEE Transactions on Affective Computing, 2024
                        </p>
                        <p className="text-[13px] text-primary/80 mb-3 leading-relaxed line-clamp-2">
                          We review recent advances in multimodal deep learning approaches for sentiment analysis, covering datasets, models, and evaluation... <span className="text-accent font-medium cursor-pointer">Show more ∨</span>
                        </p>
                        <div className="flex gap-2 text-[11px] font-medium text-muted">
                          <span className="px-2.5 py-1 bg-black/5 rounded-full">Sentiment Analysis</span>
                          <span className="px-2.5 py-1 bg-black/5 rounded-full">Deep Learning</span>
                          <span className="px-2.5 py-1 bg-black/5 rounded-full">Multimodal</span>
                          <span className="px-2.5 py-1 bg-black/5 rounded-full">+3</span>
                        </div>
                      </div>

                      <div className="w-full sm:w-[140px] flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 sm:text-right mt-2 sm:mt-0">
                        <div className="flex gap-3 text-muted">
                          <button className="hover:text-accent"><Star className="w-5 h-5" /></button>
                          <button className="hover:text-accent"><Bookmark className="w-5 h-5" /></button>
                          <button className="hover:text-primary"><MoreVertical className="w-5 h-5" /></button>
                        </div>
                        <div className="sm:mt-4 text-center sm:mr-6 flex sm:block items-baseline gap-1">
                          <div className="text-[15px] font-bold text-[#0066cc]">956</div>
                          <div className="text-[11px] text-muted font-medium">Citations</div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700 sm:mr-2 sm:mt-auto">
                           <Unlock className="w-3.5 h-3.5" /> Open Access
                        </div>
                      </div>
                    </div>
                    
                    {/* Paper 3 */}
                    <div className="bg-paper-white border border-soft-border rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:shadow-md transition-shadow relative">
                      <div className="hidden sm:flex flex-col items-center gap-4">
                        <div className="w-5 h-5 border border-soft-border rounded flex items-center justify-center"></div>
                        <span className="text-xs font-bold text-muted">3</span>
                      </div>
                      
                      <div className="w-[120px] h-[160px] bg-white border border-soft-border shadow-sm flex flex-col p-2 shrink-0">
                        <div className="w-full h-2 bg-gray-200 mb-1"></div>
                        <div className="w-2/3 h-2 bg-gray-200 mb-2"></div>
                        <div className="w-full h-1 bg-gray-100 mb-0.5"></div>
                        <div className="w-full h-1 bg-gray-100 mb-0.5"></div>
                        <div className="w-3/4 h-1 bg-gray-100 mb-4"></div>
                        <div className="w-full h-10 bg-gray-200 rounded-sm"></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-primary mb-1">
                          Cross-Modal Transformers: A Unified Framework for Multimodal Learning
                        </h3>
                        <p className="text-[13px] text-primary mb-1">
                          D. Li, J. Wang, H. Zhang et al.
                        </p>
                        <p className="text-[13px] text-muted mb-3">
                          Proceedings of AAAI, 2023
                        </p>
                      </div>

                      <div className="w-full sm:w-[140px] flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 sm:text-right mt-2 sm:mt-0">
                        <div className="flex gap-3 text-muted">
                          <button className="hover:text-accent"><Star className="w-5 h-5" /></button>
                          <button className="hover:text-accent"><Bookmark className="w-5 h-5" /></button>
                          <button className="hover:text-primary"><MoreVertical className="w-5 h-5" /></button>
                        </div>
                        <div className="sm:mt-4 text-center sm:mr-6 flex sm:block items-baseline gap-1">
                          <div className="text-[15px] font-bold text-[#0066cc]">723</div>
                          <div className="text-[11px] text-muted font-medium">Citations</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
            
            {/* Right Sidebar (Filters) */}
            <div className="w-full xl:w-[300px] shrink-0">
              <div className="bg-paper-white border border-soft-border rounded-xl p-5 shadow-sm sticky top-28">
                
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-primary">Refine your search</h3>
                  <button onClick={clearSearch} className="text-[12px] font-semibold text-accent hover:underline">Clear all</button>
                </div>

                <div className="space-y-6 divide-y divide-soft-border">
                  
                  {/* Publication Year */}
                  <div className="pt-2">
                    <button className="w-full flex items-center justify-between text-[13px] font-bold text-primary mb-4">
                      Publication year <ChevronDown className="w-4 h-4 text-muted" />
                    </button>
                    {/* Histogram Mock */}
                    <div className="h-12 flex items-end justify-between gap-[2px] px-2 opacity-50 mb-1">
                      {[2, 3, 4, 3, 5, 4, 6, 5, 8, 12, 10, 8, 15, 22, 16, 28, 18, 14, 12, 10, 8, 8, 5, 4, 4].map((h, i) => (
                        <div key={i} className={`w-full bg-accent rounded-t-sm`} style={{ height: `${h * 3}%` }}></div>
                      ))}
                    </div>
                    {/* Slider Mock */}
                    <div className="px-2 mb-4 relative">
                      <div className="h-1 bg-accent/20 rounded-full w-full"></div>
                      <div className="h-1 bg-accent rounded-full w-full absolute top-0"></div>
                      <div className="w-3 h-3 bg-accent rounded-full absolute top-1/2 -translate-y-1/2 -ml-1 border-2 border-white shadow-sm"></div>
                      <div className="w-3 h-3 bg-accent rounded-full absolute top-1/2 -translate-y-1/2 right-0 -mr-1 border-2 border-white shadow-sm"></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 border border-soft-border rounded px-3 py-1.5 text-[13px] text-primary">2010</div>
                      <div className="flex-1 border border-soft-border rounded px-3 py-1.5 text-[13px] text-primary text-right">2026</div>
                    </div>
                  </div>

                  {/* Document Type */}
                  <div className="pt-5">
                    <button className="w-full flex items-center justify-between text-[13px] font-bold text-primary mb-4">
                      Document type <ChevronDown className="w-4 h-4 text-muted" />
                    </button>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3 text-[13px] text-primary">
                          <div className="w-4 h-4 rounded bg-accent text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="font-medium">All</span>
                        </div>
                        <span className="text-[12px] text-muted">12,842</span>
                      </label>
                      <label className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3 text-[13px] text-primary">
                          <div className="w-4 h-4 rounded border border-soft-border bg-white flex items-center justify-center"></div>
                          Article
                        </div>
                        <span className="text-[12px] text-muted">8,921</span>
                      </label>
                      <label className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3 text-[13px] text-primary">
                          <div className="w-4 h-4 rounded border border-soft-border bg-white flex items-center justify-center"></div>
                          Review
                        </div>
                        <span className="text-[12px] text-muted">2,134</span>
                      </label>
                      <label className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3 text-[13px] text-primary">
                          <div className="w-4 h-4 rounded border border-soft-border bg-white flex items-center justify-center"></div>
                          Conference Paper
                        </div>
                        <span className="text-[12px] text-muted">1,245</span>
                      </label>
                      <label className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3 text-[13px] text-primary">
                          <div className="w-4 h-4 rounded border border-soft-border bg-white flex items-center justify-center"></div>
                          Book Chapter
                        </div>
                        <span className="text-[12px] text-muted">542</span>
                      </label>
                    </div>
                  </div>

                  {/* Subject Area */}
                  <div className="pt-5">
                    <button className="w-full flex items-center justify-between text-[13px] font-bold text-primary mb-4">
                      Subject area <ChevronDown className="w-4 h-4 text-muted" />
                    </button>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3 text-[13px] text-primary">
                          <div className={`w-4 h-4 rounded flex items-center justify-center ${isFilled ? 'bg-accent text-white' : 'border border-soft-border bg-white'}`}>
                            {isFilled && <Check className="w-3 h-3" />}
                          </div>
                          <span className={isFilled ? "font-medium" : ""}>Computer Science</span>
                        </div>
                        <span className="text-[12px] text-muted">8,342</span>
                      </label>
                      <label className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3 text-[13px] text-primary">
                          <div className="w-4 h-4 rounded border border-soft-border bg-white flex items-center justify-center"></div>
                          Engineering
                        </div>
                        <span className="text-[12px] text-muted">2,145</span>
                      </label>
                      <label className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3 text-[13px] text-primary">
                          <div className="w-4 h-4 rounded border border-soft-border bg-white flex items-center justify-center"></div>
                          Mathematics
                        </div>
                        <span className="text-[12px] text-muted">1,238</span>
                      </label>
                      <label className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3 text-[13px] text-primary">
                          <div className="w-4 h-4 rounded border border-soft-border bg-white flex items-center justify-center"></div>
                          Social Sciences
                        </div>
                        <span className="text-[12px] text-muted">804</span>
                      </label>
                    </div>
                    <button className="text-[12px] font-semibold text-accent flex items-center gap-1 mt-4">
                      Show more <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Other Filters */}
                  <div className="pt-5"><button className="w-full flex items-center justify-between text-[13px] font-bold text-primary">Access type <ChevronDown className="w-4 h-4 text-muted" /></button></div>
                  <div className="pt-5"><button className="w-full flex items-center justify-between text-[13px] font-bold text-primary">Publisher <ChevronDown className="w-4 h-4 text-muted" /></button></div>
                  <div className="pt-5"><button className="w-full flex items-center justify-between text-[13px] font-bold text-primary">Language <ChevronDown className="w-4 h-4 text-muted" /></button></div>
                  <div className="pt-5 pb-2"><button className="w-full flex items-center justify-between text-[13px] font-bold text-primary">Source type <ChevronDown className="w-4 h-4 text-muted" /></button></div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
