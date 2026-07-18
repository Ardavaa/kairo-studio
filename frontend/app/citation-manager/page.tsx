"use client";
import { useState } from "react";
import {
  ChevronDown, HelpCircle, Bookmark, Search, Filter, 
  ArrowUpDown, Download, Plus, MoreHorizontal, X, Copy, 
  Code, FileText, Link, Settings, ChevronLeft, ChevronRight,
  Upload
} from "lucide-react";

export default function CitationManagerPage() {
  const [showImportMenu, setShowImportMenu] = useState(true);

  return (
    <div className="flex min-h-screen bg-warm-white text-primary font-sans">
      <main className="flex-1 ml-[280px] min-w-0 flex flex-col relative bg-warm-white animate-page-in">
        
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-[1000px] h-[800px] bg-[radial-gradient(ellipse_at_30%_20%,rgba(234,88,12,0.08)_0%,transparent_60%)] pointer-events-none z-0" />

        {/* Topbar */}
        <header className="h-[72px] flex items-center justify-end px-10 shrink-0 relative z-10">
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

        <div className="flex-1 flex px-10 pb-10 gap-8 relative z-10">
          
          {/* Main Left Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            
            {/* Header section */}
            <div className="pt-4 pb-8">
              <h1 className="font-serif text-[42px] leading-tight text-primary mb-3">
                Citation Manager
              </h1>
              <p className="text-[15px] text-muted mb-4">
                Organize, manage, and export your academic references.
              </p>
              <div className="text-[13px] font-medium text-muted">
                1,284 References &nbsp;•&nbsp; 18 Collections
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 flex items-center bg-white border border-soft-border rounded-lg px-4 h-11 shadow-sm">
                <Search className="w-4 h-4 text-muted shrink-0 mr-3" />
                <input 
                  type="text"
                  placeholder="Search references, authors, titles, DOI..."
                  className="flex-1 bg-transparent border-none outline-none text-[14px] text-primary placeholder:text-muted"
                />
              </div>
              <button className="flex items-center gap-2 px-4 h-11 bg-white border border-soft-border rounded-lg text-[13px] font-semibold text-primary hover:bg-black/5 shadow-sm">
                <Filter className="w-4 h-4 text-muted" /> Filter <ChevronDown className="w-3.5 h-3.5 text-muted ml-1" />
              </button>
              <button className="flex items-center gap-2 px-4 h-11 bg-white border border-soft-border rounded-lg text-[13px] font-semibold text-primary hover:bg-black/5 shadow-sm">
                <ArrowUpDown className="w-4 h-4 text-muted" /> Sort <ChevronDown className="w-3.5 h-3.5 text-muted ml-1" />
              </button>
              <button className="flex items-center gap-2 px-4 h-11 bg-white border border-soft-border rounded-lg text-[13px] font-semibold text-primary hover:bg-black/5 shadow-sm">
                <Upload className="w-4 h-4 text-muted" /> Import
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-soft-border mb-6">
              <button className="text-[14px] font-bold text-primary pb-3 border-b-2 border-accent">
                All References
              </button>
              <button className="text-[14px] font-medium text-muted hover:text-primary pb-3">
                Collections
              </button>
              <button className="text-[14px] font-medium text-muted hover:text-primary pb-3">
                Recently Added
              </button>
            </div>

            {/* Tags/Pills */}
            <div className="flex items-center gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
              <button className="px-4 py-1.5 rounded-full border border-accent bg-orange-50 text-[12px] font-bold text-accent shrink-0">
                All
              </button>
              <button className="px-4 py-1.5 rounded-full border border-soft-border bg-white text-[12px] font-medium text-primary hover:border-muted shrink-0">
                Computer Vision Survey
              </button>
              <button className="px-4 py-1.5 rounded-full border border-soft-border bg-white text-[12px] font-medium text-primary hover:border-muted shrink-0">
                Multimodal AI
              </button>
              <button className="px-4 py-1.5 rounded-full border border-soft-border bg-white text-[12px] font-medium text-primary hover:border-muted shrink-0">
                LLM Research
              </button>
              <button className="px-4 py-1.5 rounded-full border border-soft-border bg-white text-[12px] font-medium text-primary hover:border-muted shrink-0">
                Graph Neural Networks
              </button>
              <button className="w-8 h-8 rounded-full border border-soft-border bg-white text-muted flex items-center justify-center hover:border-muted shrink-0">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-soft-border rounded-xl shadow-sm overflow-visible relative flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-soft-border text-[12px] font-bold text-muted uppercase tracking-wider">
                    <th className="px-5 py-4 w-12 text-center font-normal"><input type="checkbox" className="rounded border-soft-border" /></th>
                    <th className="px-4 py-4 w-[28%] font-bold">Title</th>
                    <th className="px-4 py-4 font-bold">Authors</th>
                    <th className="px-4 py-4 font-bold">Year</th>
                    <th className="px-4 py-4 font-bold">Source</th>
                    <th className="px-4 py-4 font-bold">Collection</th>
                    <th className="px-4 py-4 font-bold">Added</th>
                    <th className="px-4 py-4 w-12 text-center"><Settings className="w-4 h-4 mx-auto" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-border">
                  {/* Row 1 */}
                  <tr className="hover:bg-black/5 group bg-orange-50/30">
                    <td className="px-5 py-5 text-center"><input type="checkbox" defaultChecked className="rounded border-accent text-accent focus:ring-accent" /></td>
                    <td className="px-4 py-5"><h4 className="text-[13px] font-bold text-primary leading-snug">Multimodal fusion techniques for image classification: A survey</h4></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">Sakshini Hangloo et al.</p></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">2025</p></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">Neurocomputing</p></td>
                    <td className="px-4 py-5"><span className="px-2.5 py-1 rounded bg-orange-50 text-[11px] font-semibold text-accent border border-orange-100 whitespace-nowrap">Computer Vision Survey</span></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-muted whitespace-nowrap">May 10, 2025</p></td>
                    <td className="px-4 py-5 text-center"><button className="text-muted hover:text-primary"><MoreHorizontal className="w-4 h-4" /></button></td>
                  </tr>
                  
                  {/* Row 2 */}
                  <tr className="hover:bg-black/5 group">
                    <td className="px-5 py-5 text-center"><input type="checkbox" className="rounded border-soft-border" /></td>
                    <td className="px-4 py-5"><h4 className="text-[13px] font-bold text-primary leading-snug">A comprehensive review of graph neural networks</h4></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">Zhou, J., Cui, G.</p></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">2024</p></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">IEEE Transactions on Neural Networks</p></td>
                    <td className="px-4 py-5"><span className="px-2.5 py-1 rounded bg-gray-50 text-[11px] font-semibold text-gray-600 border border-gray-100 whitespace-nowrap">Graph Neural Networks</span></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-muted whitespace-nowrap">May 8, 2025</p></td>
                    <td className="px-4 py-5 text-center"><button className="text-muted hover:text-primary"><MoreHorizontal className="w-4 h-4" /></button></td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-black/5 group">
                    <td className="px-5 py-5 text-center"><input type="checkbox" className="rounded border-soft-border" /></td>
                    <td className="px-4 py-5"><h4 className="text-[13px] font-bold text-primary leading-snug">Large language models in scientific discovery: A systematic review</h4></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">Boiko, D. A. et al.</p></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">2024</p></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">Nature Machine Intelligence</p></td>
                    <td className="px-4 py-5"><span className="px-2.5 py-1 rounded bg-purple-50 text-[11px] font-semibold text-purple-600 border border-purple-100 whitespace-nowrap">LLM Research</span></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-muted whitespace-nowrap">May 6, 2025</p></td>
                    <td className="px-4 py-5 text-center"><button className="text-muted hover:text-primary"><MoreHorizontal className="w-4 h-4" /></button></td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-black/5 group">
                    <td className="px-5 py-5 text-center"><input type="checkbox" className="rounded border-soft-border" /></td>
                    <td className="px-4 py-5"><h4 className="text-[13px] font-bold text-primary leading-snug">Dataset distillation: A survey</h4></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">Yoon, J. et al.</p></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">2023</p></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">ACM Computing Surveys</p></td>
                    <td className="px-4 py-5"><span className="px-2.5 py-1 rounded bg-blue-50 text-[11px] font-semibold text-blue-600 border border-blue-100 whitespace-nowrap">Multimodal AI</span></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-muted whitespace-nowrap">May 5, 2025</p></td>
                    <td className="px-4 py-5 text-center"><button className="text-muted hover:text-primary"><MoreHorizontal className="w-4 h-4" /></button></td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="hover:bg-black/5 group">
                    <td className="px-5 py-5 text-center"><input type="checkbox" className="rounded border-soft-border" /></td>
                    <td className="px-4 py-5"><h4 className="text-[13px] font-bold text-primary leading-snug">Vision transformers: An updated survey</h4></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">Khan, S. et al.</p></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">2023</p></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">Artificial Intelligence Review</p></td>
                    <td className="px-4 py-5"><span className="px-2.5 py-1 rounded bg-orange-50 text-[11px] font-semibold text-accent border border-orange-100 whitespace-nowrap">Computer Vision Survey</span></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-muted whitespace-nowrap">May 2, 2025</p></td>
                    <td className="px-4 py-5 text-center"><button className="text-muted hover:text-primary"><MoreHorizontal className="w-4 h-4" /></button></td>
                  </tr>

                  {/* Row 6 */}
                  <tr className="hover:bg-black/5 group relative">
                    <td className="px-5 py-5 text-center"><input type="checkbox" className="rounded border-soft-border" /></td>
                    <td className="px-4 py-5"><h4 className="text-[13px] font-bold text-primary leading-snug">Self-supervised learning for computer vision: A survey</h4></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">Chen, X. et al.</p></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">2023</p></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">IEEE Access</p></td>
                    <td className="px-4 py-5"><span className="px-2.5 py-1 rounded bg-orange-50 text-[11px] font-semibold text-accent border border-orange-100 whitespace-nowrap">Computer Vision Survey</span></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-muted whitespace-nowrap">Apr 30, 2025</p></td>
                    <td className="px-4 py-5 text-center"><button className="text-muted hover:text-primary"><MoreHorizontal className="w-4 h-4" /></button></td>
                  </tr>

                  {/* Row 7 */}
                  <tr className="hover:bg-black/5 group">
                    <td className="px-5 py-5 text-center"><input type="checkbox" className="rounded border-soft-border" /></td>
                    <td className="px-4 py-5"><h4 className="text-[13px] font-bold text-primary leading-snug">A survey on prompt engineering for large language models</h4></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">Liu, P. et al.</p></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">2023</p></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-primary">ACM Computing Surveys</p></td>
                    <td className="px-4 py-5"><span className="px-2.5 py-1 rounded bg-purple-50 text-[11px] font-semibold text-purple-600 border border-purple-100 whitespace-nowrap">LLM Research</span></td>
                    <td className="px-4 py-5"><p className="text-[12px] text-muted whitespace-nowrap">Apr 28, 2025</p></td>
                    <td className="px-4 py-5 text-center"><button className="text-muted hover:text-primary"><MoreHorizontal className="w-4 h-4" /></button></td>
                  </tr>
                </tbody>
              </table>

              {/* Mock Dropdown positioned exactly as in screenshot */}
              {showImportMenu && (
                <div className="absolute right-[210px] bottom-[15px] w-48 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-soft-border py-2 z-20">
                  <button className="w-full text-left px-4 py-2 hover:bg-black/5 flex items-center gap-3 text-[12px] font-medium text-primary">
                    <FileText className="w-3.5 h-3.5 text-muted" /> Import BibTeX
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-black/5 flex items-center gap-3 text-[12px] font-medium text-primary">
                    <FileText className="w-3.5 h-3.5 text-muted" /> Import RIS
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-black/5 flex items-center gap-3 text-[12px] font-medium text-primary">
                    <FileText className="w-3.5 h-3.5 text-muted" /> Import EndNote
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-black/5 flex items-center gap-3 text-[12px] font-medium text-primary">
                    <Search className="w-3.5 h-3.5 text-muted" /> Import DOI
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-black/5 flex items-center gap-3 text-[12px] font-medium text-primary">
                    <FileText className="w-3.5 h-3.5 text-muted" /> Import PDF
                  </button>
                </div>
              )}
            </div>

            {/* Pagination & Footer actions */}
            <div className="flex items-center justify-between mt-6">
              <span className="text-[13px] text-muted font-medium">Showing 1-25 of 1,284 references</span>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded flex items-center justify-center text-muted hover:bg-black/5 border border-soft-border bg-white"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-accent bg-orange-50 border border-accent font-bold text-[13px]">1</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-primary hover:bg-black/5 font-medium text-[13px]">2</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-primary hover:bg-black/5 font-medium text-[13px]">3</button>
                <span className="w-8 h-8 flex items-center justify-center text-muted text-[13px]">...</span>
                <button className="w-8 h-8 rounded flex items-center justify-center text-primary hover:bg-black/5 font-medium text-[13px]">52</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-primary hover:bg-black/5 border border-soft-border bg-white"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

          </div>

          {/* Right Sidebar Panel */}
          <div className="w-[360px] shrink-0">
            <div className="bg-white border border-soft-border rounded-xl shadow-sm p-8 sticky top-28 h-auto flex flex-col relative">
              <button className="absolute top-6 right-6 text-muted hover:text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="inline-block px-2.5 py-1 rounded bg-orange-50 text-[11px] font-bold text-accent mb-4 border border-orange-100">
                  Journal Article
                </span>
                <h2 className="font-serif text-[22px] font-bold text-primary leading-tight mb-4 pr-6">
                  Multimodal fusion techniques for image classification: A survey
                </h2>
                <p className="text-[14px] text-muted leading-relaxed mb-4">
                  Sakshini Hangloo, R. K. Gupta, Neeraj Sharma et al.
                </p>
                <p className="text-[13px] text-primary mb-2">
                  Neurocomputing, 2025, 578, 126123
                </p>
                <p className="text-[13px] text-primary">
                  DOI: <span className="text-accent hover:underline cursor-pointer font-medium">10.1016/j.neucom.2024.126123</span>
                </p>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-4 gap-2 mb-8">
                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-soft-border hover:bg-black/5 transition-colors">
                  <Copy className="w-4 h-4 text-primary" />
                  <span className="text-[11px] font-semibold text-primary text-center leading-tight">Copy<br/>Citation</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-soft-border hover:bg-black/5 transition-colors">
                  <Code className="w-4 h-4 text-primary" />
                  <span className="text-[11px] font-semibold text-primary text-center leading-tight">Export<br/>BibTeX</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-soft-border hover:bg-black/5 transition-colors">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-[11px] font-semibold text-primary text-center leading-tight">Export<br/>RIS</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-soft-border hover:bg-black/5 transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-primary" />
                  <span className="text-[11px] font-semibold text-primary text-center leading-tight">More<br/>Options</span>
                </button>
              </div>

              {/* Meta Data */}
              <div className="space-y-4 text-[13px] mb-10">
                <div className="flex">
                  <span className="w-32 text-muted">Collection</span>
                  <span className="px-2 py-0.5 rounded bg-orange-50 text-[11px] font-semibold text-accent border border-orange-100">
                    Computer Vision Survey
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-muted">Added</span>
                  <span className="text-primary font-medium">May 10, 2025</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-muted">Reference Type</span>
                  <span className="text-primary font-medium">Journal Article</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-muted">Language</span>
                  <span className="text-primary font-medium">English</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-muted">Publisher</span>
                  <span className="text-primary font-medium">Elsevier</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-muted">Access</span>
                  <span className="text-primary font-semibold flex items-center gap-1.5 cursor-pointer hover:underline">
                    <Link className="w-3.5 h-3.5" /> Open in Source
                  </span>
                </div>
              </div>

              {/* Add to Collection Button */}
              <button className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-accent text-accent rounded-xl text-[14px] font-bold hover:bg-orange-50 transition-colors">
                <Bookmark className="w-4 h-4" /> Add to Collection <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
          
        </div>

        {/* Floating Action Button */}
        <button className="fixed bottom-10 right-10 w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(234,88,12,0.4)] hover:bg-accent/90 hover:scale-105 transition-all z-50">
          <Plus className="w-6 h-6" />
        </button>

      </main>
    </div>
  );
}
