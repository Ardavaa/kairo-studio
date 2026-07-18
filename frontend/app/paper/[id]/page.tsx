import Link from "next/link";
import {
  Menu, Home, Search, Book, User, Building2,
  FileText, Sparkles, CheckSquare, FolderOpen,
  ChevronDown, HelpCircle, Bookmark, ArrowLeft,
  Settings, Unlock, Download, Eye, Copy, Check, Quote,
  Upload, ChevronRight, Share2, Activity, PieChart
} from "lucide-react";

export default function PaperDetailsPage() {
  return (
    <div className="flex min-h-screen bg-warm-white text-primary font-sans">
      

      {/* Inner Sidebar (TOC) */}
      <div className="w-[240px] ml-[280px] bg-warm-white border-r border-soft-border flex flex-col fixed inset-y-0 z-10 pt-8">
        
        <div className="px-6 mb-8 mt-1.5">
          <Link href="/search" className="flex items-center gap-2 text-[13px] font-semibold text-primary hover:text-accent transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to search results
          </Link>
        </div>

        <div className="px-6 mb-4">
          <h4 className="text-[11px] font-bold text-muted uppercase tracking-wider">On this page</h4>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-8 space-y-1 text-[13px] font-medium">
          <a href="#abstract" className="block px-3 py-2 text-accent bg-accent/5 rounded-md">Abstract</a>
          <a href="#introduction" className="block px-3 py-2 text-muted hover:text-primary hover:bg-black/5 rounded-md">1. Introduction</a>
          <a href="#related-work" className="block px-3 py-2 text-muted hover:text-primary hover:bg-black/5 rounded-md">2. Related Work</a>
          <a href="#methodology" className="block px-3 py-2 text-muted hover:text-primary hover:bg-black/5 rounded-md">3. Methodology</a>
          <a href="#experiments" className="block px-3 py-2 text-muted hover:text-primary hover:bg-black/5 rounded-md">4. Experiments</a>
          <a href="#results" className="block px-3 py-2 text-muted hover:text-primary hover:bg-black/5 rounded-md">5. Results</a>
          <a href="#discussion" className="block px-3 py-2 text-muted hover:text-primary hover:bg-black/5 rounded-md">6. Discussion</a>
          <a href="#conclusion" className="block px-3 py-2 text-muted hover:text-primary hover:bg-black/5 rounded-md">7. Conclusion</a>
          
          <div className="h-px bg-soft-border my-3 mx-3"></div>
          
          <a href="#figures" className="block px-3 py-2 text-muted hover:text-primary hover:bg-black/5 rounded-md">Figures (8)</a>
          <a href="#tables" className="block px-3 py-2 text-muted hover:text-primary hover:bg-black/5 rounded-md">Tables (4)</a>
          <a href="#references" className="block px-3 py-2 text-muted hover:text-primary hover:bg-black/5 rounded-md">References (132)</a>
          <a href="#cited-by" className="block px-3 py-2 text-muted hover:text-primary hover:bg-black/5 rounded-md">Cited By (1,432)</a>
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 ml-[520px] min-w-0 flex flex-col bg-warm-white animate-page-in">
        
        {/* Topbar */}
        <header className="h-[72px] bg-warm-white/90 backdrop-blur flex items-center justify-end px-10 sticky top-0 z-30">
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

        <div className="flex px-10 py-6 gap-12 max-w-[1400px]">
          
          {/* Left Main Paper Column */}
          <div className="flex-1 min-w-0">
            
            {/* Action Bar (Top Right of Main Content visually, but in DOM it's above content) */}
            <div className="flex justify-end gap-3 mb-8">
              <button className="flex items-center gap-2 px-4 py-2 bg-paper-white border border-soft-border rounded-lg text-[13px] font-medium text-primary hover:bg-black/5 shadow-sm">
                <Quote className="w-4 h-4 text-muted" /> Cite
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-paper-white border border-soft-border rounded-lg text-[13px] font-medium text-primary hover:bg-black/5 shadow-sm">
                <Upload className="w-4 h-4 text-muted" /> Export <ChevronDown className="w-3.5 h-3.5 ml-1 text-muted" />
              </button>
              <button className="flex items-center gap-2 px-5 py-2 bg-accent text-white rounded-lg text-[13px] font-medium hover:bg-accent/90 shadow-sm">
                <Bookmark className="w-4 h-4 fill-current" /> Save to Library
              </button>
            </div>

            {/* Title & Meta */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-2.5 py-1 bg-black/5 rounded-full text-[11px] font-medium text-primary">Review Article</span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700">
                  <Unlock className="w-3.5 h-3.5" /> Open Access
                </span>
              </div>
              
              <h1 className="font-serif text-[34px] leading-[1.2] text-primary mb-4">
                Multimodal Fusion Techniques:<br/>A Comprehensive Survey
              </h1>
              
              <p className="text-[15px] text-primary mb-2">
                Sakshini Hangloo, <span className="underline font-medium cursor-pointer">Bhavna Arora</span>
              </p>
              
              <p className="text-[13px] text-muted mb-8">
                Neurocomputing, Volume 508, 15 January 2025, 130827<br/>Elsevier
              </p>

              {/* Stats Bar */}
              <div className="flex items-center gap-8 bg-paper-white border border-soft-border rounded-xl p-5 shadow-sm overflow-x-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-soft-border flex items-center justify-center text-muted shrink-0">
                    <Quote className="w-4 h-4 fill-current opacity-20" />
                  </div>
                  <div>
                    <div className="font-bold text-[15px] text-primary">1,432</div>
                    <div className="text-[11px] text-muted font-medium">Citations</div>
                  </div>
                </div>
                
                <div className="w-px h-10 bg-soft-border"></div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-soft-border flex items-center justify-center text-muted shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[15px] text-primary">98.7</div>
                    <div className="text-[11px] text-muted font-medium">Field-Weighted<br/>Citation Impact</div>
                  </div>
                </div>

                <div className="w-px h-10 bg-soft-border"></div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-soft-border flex items-center justify-center text-muted shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[15px] text-primary">12,842</div>
                    <div className="text-[11px] text-muted font-medium">Downloads</div>
                  </div>
                </div>

                <div className="w-px h-10 bg-soft-border"></div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-soft-border flex items-center justify-center text-muted shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[15px] text-primary">25,311</div>
                    <div className="text-[11px] text-muted font-medium">Views</div>
                  </div>
                </div>

                <div className="w-px h-10 bg-soft-border"></div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-[3px] border-l-blue-500 border-t-red-500 border-r-yellow-500 border-b-purple-500 flex items-center justify-center shrink-0">
                  </div>
                  <div>
                    <div className="text-[11px] text-muted font-medium">Altmetric</div>
                    <div className="font-bold text-[15px] text-primary">156</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Paper Content */}
            <div className="prose prose-sm max-w-none text-primary pb-20">
              
              <h2 id="abstract" className="font-serif text-2xl mb-4 font-bold">Abstract</h2>
              <p className="text-[15px] leading-relaxed mb-6">
                Multimodal fusion has emerged as a powerful paradigm to integrate information from diverse data sources, enabling improved performance across a wide range of applications. This survey provides a comprehensive overview of multimodal fusion techniques, including data representation, fusion strategies, and evaluation metrics. We categorize existing methods into early fusion, late fusion, and hybrid fusion approaches, and discuss their strengths, limitations, and suitable use cases. Additionally, we highlight prominent benchmarks and datasets, identify open challenges, and outline promising future directions.
              </p>

              <div className="flex items-center gap-3 flex-wrap mb-10">
                <span className="text-[13px] font-bold">Keywords:</span>
                <span className="px-3 py-1.5 bg-black/5 rounded-full text-[12px] font-medium text-muted">Multimodal Learning</span>
                <span className="px-3 py-1.5 bg-black/5 rounded-full text-[12px] font-medium text-muted">Information Fusion</span>
                <span className="px-3 py-1.5 bg-black/5 rounded-full text-[12px] font-medium text-muted">Deep Learning</span>
                <span className="px-3 py-1.5 bg-black/5 rounded-full text-[12px] font-medium text-muted">Survey</span>
                <span className="px-3 py-1.5 bg-black/5 rounded-full text-[12px] font-medium text-muted">Representation Learning</span>
              </div>

              <h2 id="introduction" className="font-serif text-2xl mb-4 font-bold">1. Introduction</h2>
              <p className="text-[15px] leading-relaxed mb-4">
                The rapid growth of data across various modalities such as text, image, audio, and video has created a pressing need for systems that can effectively leverage complementary information from these sources. Multimodal fusion aims to combine information from multiple modalities to improve the robustness, generalization, and accuracy of predictive models...
              </p>
              <button className="text-[13px] font-semibold text-accent flex items-center gap-1 hover:underline mb-12">
                Show more <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-between mb-4">
                <h2 id="figures" className="font-serif text-2xl font-bold m-0">Figures (8)</h2>
                <button className="text-[13px] font-semibold text-accent hover:underline">View all</button>
              </div>

              {/* Figures Grid */}
              <div className="grid grid-cols-4 gap-4 mb-12 relative">
                
                {/* Figure Mockups */}
                <div className="aspect-square bg-paper-white border border-soft-border rounded-lg overflow-hidden flex flex-col p-2 hover:border-muted transition-colors cursor-pointer">
                   <div className="flex-1 flex items-center justify-center">
                      <div className="w-3/4 h-3/4 border-2 border-blue-200 rounded-sm flex flex-col gap-2 items-center justify-center p-2">
                         <div className="w-full h-1/3 bg-blue-100 rounded-sm"></div>
                         <div className="w-full h-1/3 bg-green-100 rounded-sm"></div>
                      </div>
                   </div>
                </div>

                <div className="aspect-square bg-paper-white border border-soft-border rounded-lg overflow-hidden flex flex-col p-2 hover:border-muted transition-colors cursor-pointer">
                   <div className="flex-1 flex items-center justify-center relative">
                      <div className="w-2 h-2 bg-red-400 rounded-full absolute top-1/4 left-1/4"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full absolute top-1/2 left-1/3"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full absolute bottom-1/3 right-1/4"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full absolute top-1/3 right-1/3"></div>
                      {/* scatter dots */}
                      <div className="w-1.5 h-1.5 bg-red-300 rounded-full absolute top-1/4 left-1/5 ml-2 mt-2"></div>
                      <div className="w-1.5 h-1.5 bg-blue-300 rounded-full absolute top-1/2 left-1/4 mt-2"></div>
                   </div>
                </div>

                <div className="aspect-square bg-paper-white border border-soft-border rounded-lg overflow-hidden flex flex-col p-2 hover:border-muted transition-colors cursor-pointer">
                   <div className="flex-1 flex items-center justify-center">
                       <div className="flex gap-2">
                           <div className="w-6 h-8 bg-yellow-100 border border-yellow-300 rounded-sm"></div>
                           <div className="w-6 h-8 bg-purple-100 border border-purple-300 rounded-sm"></div>
                       </div>
                   </div>
                </div>

                <div className="aspect-square bg-paper-white border border-soft-border rounded-lg overflow-hidden flex items-end justify-center p-2 gap-1 hover:border-muted transition-colors cursor-pointer relative">
                    <div className="w-3 bg-blue-400 h-1/3"></div>
                    <div className="w-3 bg-orange-400 h-2/3"></div>
                    <div className="w-3 bg-green-400 h-1/2"></div>
                    <div className="w-3 bg-red-400 h-full"></div>
                    
                    {/* Right Arrow Overlay indicating more */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-8 h-8 bg-white border border-soft-border rounded-full shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 z-10">
                        <ChevronRight className="w-4 h-4 text-muted" />
                    </div>
                </div>

              </div>

            </div>
          </div>

          {/* Right Sidebar (Details & Recommendations) */}
          <div className="w-[340px] shrink-0 space-y-6">
            
            {/* AI Summary Box */}
            <div className="bg-paper-white border border-soft-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[15px] text-primary">AI Summary</h3>
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <p className="text-[13px] text-primary/90 leading-relaxed mb-6">
                This survey comprehensively reviews multimodal fusion techniques, categorizing them into early, late, and hybrid fusion methods. It discusses data representation, fusion strategies, evaluation metrics, benchmarks, and future research directions.
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-soft-border rounded-lg text-[12px] font-semibold text-primary hover:bg-black/5 w-full justify-center transition-colors mb-6">
                <Sparkles className="w-3.5 h-3.5 text-accent" /> Generate detailed summary
              </button>

              <div className="h-px bg-soft-border -mx-6 mb-6"></div>

              <h4 className="font-bold text-[13px] text-primary mb-4">Key Contributions</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-[13px] text-primary/90 leading-snug">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Comprehensive taxonomy of multimodal fusion techniques.</span>
                </li>
                <li className="flex items-start gap-2.5 text-[13px] text-primary/90 leading-snug">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Analysis of strengths, limitations, and use cases for each fusion approach.</span>
                </li>
                <li className="flex items-start gap-2.5 text-[13px] text-primary/90 leading-snug">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Curated benchmarks and datasets for multimodal fusion research.</span>
                </li>
                <li className="flex items-start gap-2.5 text-[13px] text-primary/90 leading-snug">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Identification of open challenges and future directions.</span>
                </li>
              </ul>
            </div>

            {/* Paper Info Box */}
            <div className="bg-paper-white border border-soft-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-[15px] text-primary mb-4">Paper Info</h3>
              <div className="space-y-3 text-[13px]">
                <div className="flex">
                  <span className="text-muted w-28 shrink-0">Published in</span>
                  <span className="text-primary font-medium">Neurocomputing</span>
                </div>
                <div className="flex">
                  <span className="text-muted w-28 shrink-0">Volume / Issue</span>
                  <span className="text-primary font-medium">Volume 508</span>
                </div>
                <div className="flex">
                  <span className="text-muted w-28 shrink-0">Pages</span>
                  <span className="text-primary font-medium">130827</span>
                </div>
                <div className="flex">
                  <span className="text-muted w-28 shrink-0">Published</span>
                  <span className="text-primary font-medium">15 January 2025</span>
                </div>
                <div className="flex">
                  <span className="text-muted w-28 shrink-0">DOI</span>
                  <span className="text-primary font-medium flex items-center gap-1.5">
                    10.1016/j.neucom.2024.130827 <Copy className="w-3 h-3 text-muted cursor-pointer hover:text-primary" />
                  </span>
                </div>
              </div>
            </div>

            {/* Related Papers Box */}
            <div className="bg-paper-white border border-soft-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[15px] text-primary">Related Papers</h3>
                <button className="text-[12px] font-semibold text-accent hover:underline">View all</button>
              </div>
              
              <div className="space-y-5">
                
                <div className="flex gap-3 group cursor-pointer">
                   <div className="w-[48px] h-[64px] bg-white border border-soft-border shadow-sm flex flex-col p-1 shrink-0 group-hover:border-muted transition-colors">
                      <div className="w-full h-1 bg-gray-200 mb-0.5"></div>
                      <div className="w-2/3 h-1 bg-gray-200 mb-1"></div>
                      <div className="w-full h-px bg-gray-100 mb-0.5"></div>
                      <div className="w-full h-px bg-gray-100 mb-0.5"></div>
                   </div>
                   <div>
                     <h4 className="text-[13px] font-bold text-primary leading-snug mb-1 group-hover:text-accent transition-colors">
                       A Survey on Multimodal Deep Learning for Sentiment Analysis
                     </h4>
                     <p className="text-[11px] text-primary mb-0.5">Z. Zadeh et al.</p>
                     <p className="text-[11px] text-muted">IEEE Trans. Affective Computing, 2024</p>
                   </div>
                </div>

                <div className="flex gap-3 group cursor-pointer">
                   <div className="w-[48px] h-[64px] bg-white border border-soft-border shadow-sm flex flex-col p-1 shrink-0 group-hover:border-muted transition-colors">
                      <div className="w-full h-1 bg-gray-200 mb-0.5"></div>
                      <div className="w-4/5 h-1 bg-gray-200 mb-1"></div>
                      <div className="w-full h-px bg-gray-100 mb-0.5"></div>
                      <div className="flex gap-1 mb-1">
                         <div className="bg-blue-100 h-3 w-1/3"></div>
                         <div className="bg-red-100 h-3 w-1/3"></div>
                      </div>
                   </div>
                   <div>
                     <h4 className="text-[13px] font-bold text-primary leading-snug mb-1 group-hover:text-accent transition-colors">
                       Cross-Modal Transformers: A Unified Framework for Multimodal Learning
                     </h4>
                     <p className="text-[11px] text-primary mb-0.5">D. Li et al.</p>
                     <p className="text-[11px] text-muted">AAAI, 2023</p>
                   </div>
                </div>

                <div className="flex gap-3 group cursor-pointer">
                   <div className="w-[48px] h-[64px] bg-white border border-soft-border shadow-sm flex flex-col p-1 shrink-0 group-hover:border-muted transition-colors">
                      <div className="w-full h-1 bg-gray-200 mb-0.5"></div>
                      <div className="w-full h-1 bg-gray-200 mb-1"></div>
                      <div className="w-full h-4 bg-gray-100 mb-0.5"></div>
                   </div>
                   <div>
                     <h4 className="text-[13px] font-bold text-primary leading-snug mb-1 group-hover:text-accent transition-colors">
                       Multimodal Representation Learning: A Survey and Taxonomy
                     </h4>
                     <p className="text-[11px] text-primary mb-0.5">Y. Chen et al.</p>
                     <p className="text-[11px] text-muted">ACM Computing Surveys, 2022</p>
                   </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
