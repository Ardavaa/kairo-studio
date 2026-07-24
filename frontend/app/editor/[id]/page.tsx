"use client";

import { useState, useEffect } from "react";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import {
  ChevronLeft, File, Edit, View, HelpCircle, Cloud, Share, Download,
  Bold, Italic, Underline, Heading, List, ListOrdered, Sigma, Code, AtSign, MessageSquare,
  Undo, Redo, ZoomIn, ZoomOut, Maximize, GripVertical, Search, Book, PenTool, Settings, HelpCircle as HelpIcon, FileText
} from "lucide-react";
import Link from "next/link";
import Editor from "@monaco-editor/react";

const INITIAL_CODE = `#import "@preview/charged-ieee:0.1.4": ieee

#show: ieee.with(
  title: [Public Complaint Classification for Government Agency Identification Using Visual and Textual Representations Based on a Multimodal Transformer],
  abstract: [
    The surge in the volume of public complaint reports on e-government platforms such as CRM (Cepat Respons Masyarakat) and JAKI has created significant challenges, as the process of routing reports to the appropriate government agencies is still performed manually. Single-modality classification approaches that rely solely on textual report descriptions possess inherent limitations due to the nature of public complaint texts, which are typically short, informal, and often contain slang and typographical errors. Consequently, visual information from supporting images becomes a crucial complement.
  ]
)

This study proposes a multimodal classification system that integrates Transformer-based textual embedding representations and Vision Transformer (ViT)-based visual representations to automatically identify the target government agency. Three fusion strategies are experimentally compared, namely early fusion, intermediate fusion, and late fusion, with CatBoost employed as the downstream classifier, using a CRM dataset consisting of 81,676 reports categorized into 12 government agency classes.

The evaluation uses Macro F1-score as the primary metric to accommodate the class imbalance within the dataset, aiming to determine the most optimal fusion strategy and to measure the contribution of the multimodal approach compared to unimodal approaches in the context of public complaint report classification.`;

function handleEditorWillMount(monaco: any) {
  if (!monaco.languages.getLanguages().some((lang: any) => lang.id === "typst")) {
    monaco.languages.register({ id: "typst" });
    
    monaco.languages.setMonarchTokensProvider("typst", {
      tokenizer: {
        root: [
          [/\/\/.*$/, "comment"],
          [/\/\*/, "comment", "@comment"],
          [/#(import|show|let|set|if|else|for|in|while|break|continue|return|include)/, "keyword"],
          [/#([a-zA-Z0-9_-]+)/, "function"],
          [/"([^"\\]|\\.)*"/, "string"],
          [/^={1,6}\s+.*$/, "keyword.heading"],
          [/\$.*?\$/, "string.math"],
        ],
        comment: [
          [/[^\/*]+/, "comment"],
          [/\*\//, "comment", "@pop"],
          [/[\/*]/, "comment"]
        ]
      }
    });

    monaco.editor.defineTheme("kairo-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "2563eb", fontStyle: "bold" },
        { token: "function", foreground: "059669" },
        { token: "string", foreground: "b45309" },
        { token: "comment", foreground: "9ca3af", fontStyle: "italic" },
        { token: "keyword.heading", foreground: "111827", fontStyle: "bold" },
        { token: "string.math", foreground: "7c3aed" },
      ],
      colors: {
        "editor.background": "#FAFAFA",
        "editor.lineHighlightBackground": "#F3F4F6",
        "editorLineNumber.foreground": "#D1D5DB",
        "editorLineNumber.activeForeground": "#9CA3AF",
        "editor.selectionBackground": "#E5E7EB",
      }
    });
  }
}

export default function EditorPage({ params }: { params: { id: string } }) {
  const [zoom, setZoom] = useState(135);
  const [code, setCode] = useState(INITIAL_CODE);
  const [pages, setPages] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const compile = async () => {
      setIsCompiling(true);
      setError(null);
      try {
        const res = await fetch("/api/compile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code })
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Compilation failed");
        } else if (data.pages) {
          setPages(data.pages);
        }
      } catch (err: any) {
        setError(err.toString());
      } finally {
        setIsCompiling(false);
      }
    };

    const timer = setTimeout(() => {
      compile();
    }, 800);

    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div className="flex flex-col h-screen bg-[#F6F7F9] font-sans overflow-hidden text-gray-800 selection:bg-accent/20">
      
      {/* Top Menu Bar */}
      <header className="h-[40px] flex items-center justify-between px-3 border-b border-gray-200 bg-white shrink-0 text-[13px]">
        {/* Left */}
        <div className="flex items-center gap-1">
          <Link href="/project-workspace" className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded font-semibold text-gray-900 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Kairo
          </Link>
          <div className="w-[1px] h-4 bg-gray-200 mx-2" />
          <button className="px-2 py-1 hover:bg-gray-100 rounded text-gray-600 transition-colors">File</button>
          <button className="px-2 py-1 hover:bg-gray-100 rounded text-gray-600 transition-colors">Edit</button>
          <button className="px-2 py-1 hover:bg-gray-100 rounded text-gray-600 transition-colors">View</button>
          <button className="px-2 py-1 hover:bg-gray-100 rounded text-gray-600 transition-colors">Help</button>
        </div>

        {/* Center - Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-500 font-medium absolute left-1/2 -translate-x-1/2 pointer-events-none hidden md:flex">
          <Cloud className="w-4 h-4 text-gray-400" />
          <span>Ardava</span>
          <span className="text-gray-300">›</span>
          <span className="truncate max-w-[200px]">Multimodal Public Complaint Classif...</span>
          <span className="text-gray-300">›</span>
          <span className="text-gray-900">main.typ</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md font-medium text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-sm">
            Share
          </button>
          <button className="flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-sm">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Activity Bar (Thin left sidebar) */}
        <div className="w-[48px] bg-[#FDFDFD] border-r border-gray-200 flex flex-col items-center py-4 gap-4 shrink-0 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)] hidden md:flex">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors">
            <Book className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <PenTool className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <HelpIcon className="w-5 h-5" />
          </button>
          <div className="w-10 flex items-center justify-center mt-2 mb-8">
            <div className="text-gray-200 font-serif font-bold -rotate-90 tracking-[0.2em] text-lg uppercase select-none">kairo</div>
          </div>
        </div>

        {/* Resizable Panels */}
        <PanelGroup direction="horizontal" className="flex-1">
          
          {/* Editor Panel */}
          <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#FDFDFD]">
            
            {/* Formatting Toolbar */}
            <div className="h-[44px] border-b border-gray-200/80 flex items-center justify-between px-2 shrink-0 overflow-x-auto bg-white">
              <div className="flex items-center gap-1 p-1">
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 font-serif font-bold text-sm transition-colors">Ag</button>
                <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Bold className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Italic className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Underline className="w-4 h-4" /></button>
                <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Heading className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><List className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><ListOrdered className="w-4 h-4" /></button>
                <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Sigma className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Code className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><AtSign className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><MessageSquare className="w-4 h-4" /></button>
              </div>

              <div className="flex items-center gap-1 p-1">
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Undo className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Redo className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 overflow-hidden relative">
              <Editor
                height="100%"
                language="typst"
                theme="kairo-light"
                value={code}
                onChange={(val) => setCode(val || "")}
                beforeMount={handleEditorWillMount}
                options={{
                  minimap: { enabled: false },
                  lineNumbersMinChars: 3,
                  fontSize: 14,
                  fontFamily: "var(--font-mono), monospace",
                  padding: { top: 24, bottom: 24 },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  overviewRulerLanes: 0,
                  hideCursorInOverviewRuler: true,
                  renderLineHighlight: "none",
                  scrollbar: {
                    vertical: "hidden",
                    horizontal: "hidden"
                  }
                }}
              />
            </div>

          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-[10px] -mx-[5px] relative group flex items-center justify-center cursor-col-resize z-20 outline-none hidden md:flex">
            <div className="w-[1px] h-full bg-gray-200 group-hover:bg-accent/50 group-active:bg-accent transition-colors duration-200" />
            <div className="absolute w-4 h-6 bg-white border border-gray-200 rounded-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <GripVertical className="w-3 h-3 text-gray-400" />
            </div>
          </PanelResizeHandle>

          {/* Preview Panel */}
          <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#F3F4F6] relative hidden md:flex">
            
            {/* Preview Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-lg shadow-sm overflow-hidden z-20 h-[36px]">
              <button className="px-3 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 border-r border-gray-100 active:bg-gray-100 transition-colors">
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="px-4 text-[13px] font-medium text-gray-700 min-w-[70px] text-center select-none">
                {zoom}%
              </div>
              <button className="px-3 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 border-l border-gray-100 active:bg-gray-100 transition-colors">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button className="px-3 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 border-l border-gray-100 active:bg-gray-100 transition-colors" title="Fit to page">
                <Maximize className="w-4 h-4" />
              </button>
            </div>

            {/* Document Preview Area */}
            <div className="flex-1 overflow-auto bg-[#F3F4F6] custom-scrollbar relative">
              
              {/* Compiling Overlay / Indicator */}
              {isCompiling && (
                <div className="fixed top-[60px] right-8 z-30 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm rounded-full px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-gray-500">
                  <div className="w-3 h-3 rounded-full border-[1.5px] border-gray-400 border-t-transparent animate-spin" />
                  Compiling
                </div>
              )}

              <div className="min-h-full min-w-max p-12 flex flex-col items-center">
                {error && (
                  <div className="w-[794px] bg-red-50 border border-red-200 text-red-700 p-4 rounded-md shadow-sm mb-4 z-10">
                    <h3 className="font-bold mb-2">Compilation Error</h3>
                    <pre className="whitespace-pre-wrap text-[13px] font-mono">{error}</pre>
                  </div>
                )}

                {pages.map((svg, idx) => (
                  <div 
                    key={idx}
                    className="bg-white shadow-md border border-gray-200/50 mb-8 origin-top [&>svg]:!max-w-none" 
                    style={{ 
                      transform: `scale(${zoom / 100})`, 
                      marginBottom: `${Math.max(32, (zoom/100 - 1) * 1123 + 32)}px`
                    }}
                    dangerouslySetInnerHTML={{ __html: svg }}
                  />
                ))}

                {pages.length === 0 && !error && (
                  <div className="mt-20 text-gray-400 font-medium flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    <p>Initializing Typst Compiler...</p>
                  </div>
                )}
              </div>
            </div>

          </Panel>

        </PanelGroup>

      </div>
    </div>
  );
}
