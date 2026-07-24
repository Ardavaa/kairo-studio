"use client";

import { useState, useEffect, useRef, useMemo, use } from "react";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import {
  ChevronLeft, File, Edit, View, HelpCircle, Cloud, Share, Download,
  Bold, Italic, Underline, Heading, List, ListOrdered, Sigma, Code, AtSign, MessageSquare,
  Undo, Redo, ZoomIn, ZoomOut, Maximize, GripVertical, Search, Book, PenTool, Settings, HelpCircle as HelpIcon, FileText,
  FolderPlus, FilePlus, Upload, Image as ImageIcon, Eye, MoreHorizontal, Trash2, Edit2, Folder,
  ChevronRight, ChevronDown
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

    monaco.languages.register({ id: "bibtex" });
    monaco.languages.setMonarchTokensProvider("bibtex", {
      tokenizer: {
        root: [
          [/@[a-zA-Z]+/, "keyword"],
          [/[a-zA-Z0-9_:\-]+(?=\s*,)/, "function"],
          [/[a-zA-Z0-9_:\-]+(?=\s*=)/, "type.identifier"],
          [/"/, "string", "@string_double"],
          [/[{}]/, "delimiter"],
          [/%.*$/, "comment"],
          [/[0-9]+/, "number"],
        ],
        string_double: [
          [/[^\\"]+/, "string"],
          [/\\./, "string.escape"],
          [/"/, "string", "@pop"]
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
        { token: "type.identifier", foreground: "059669" },
        { token: "delimiter", foreground: "6b7280" },
        { token: "number", foreground: "d97706" },
      ],
      colors: {
        "editor.background": "#FDFDFD",
        "editor.lineHighlightBackground": "#F3F4F6",
        "editorLineNumber.foreground": "#D1D5DB",
        "editorLineNumber.activeForeground": "#9CA3AF",
        "editor.selectionBackground": "#E5E7EB",
      }
    });
  }
}

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [zoom, setZoom] = useState(135);
  const [code, setCode] = useState("");
  const [pages, setPages] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<"files" | "search" | "outline" | null>("files");
  const [activeFile, setActiveFile] = useState<string>("main.typ");
  const [creatingItem, setCreatingItem] = useState<'file' | 'folder' | null>(null);
  const [createInput, setCreateInput] = useState("");
  
  const [projectFiles, setProjectFiles] = useState<{ name: string, type: 'typst' | 'image' | 'bib' | 'other' | 'folder' }[]>([]);
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState("");
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, fileName: string } | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);

  // Search & Replace
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCaseSensitive, setSearchCaseSensitive] = useState(false);
  const [replaceQuery, setReplaceQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{file: string, matches: any[]}[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [collapsedSearchResults, setCollapsedSearchResults] = useState<Record<string, boolean>>({});

  // Outline
  const [collapsedOutlines, setCollapsedOutlines] = useState<Record<number, boolean>>({});

  const outlines = useMemo(() => {
    if (!activeFile.endsWith('.typ') && !activeFile.endsWith('.md')) return [];
    const lines = code.split('\n');
    const results: { line: number, depth: number, text: string, hasChildren?: boolean }[] = [];
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(/^(=+)\s+(.*)$/);
      if (match) {
        results.push({
          line: i + 1,
          depth: match[1].length,
          text: match[2].trim().replace(/\[|\]/g, '') // strip brackets if any
        });
      }
    }
    return results.map((outline, i) => {
      const nextOutline = results[i + 1];
      const hasChildren = nextOutline && nextOutline.depth > outline.depth;
      return { ...outline, hasChildren };
    });
  }, [code, activeFile]);

  const visibleOutlines = useMemo(() => {
    let hiddenUntilDepth: number | null = null;
    return outlines.filter((outline) => {
      if (hiddenUntilDepth !== null) {
        if (outline.depth > hiddenUntilDepth) {
          return false; 
        } else {
          hiddenUntilDepth = null;
        }
      }
      
      if (collapsedOutlines[outline.line]) {
        hiddenUntilDepth = outline.depth;
      }
      return true;
    });
  }, [outlines, collapsedOutlines]);

  const handleOutlineClick = (line: number) => {
    if (editorRef.current) {
      editorRef.current.revealLineInCenter(line);
      editorRef.current.setPosition({ lineNumber: line, column: 1 });
      editorRef.current.focus();
    }
  };

  const handleExpandAllOutline = () => setCollapsedOutlines({});
  const handleCollapseAllOutline = () => {
    const allCollapsed: Record<number, boolean> = {};
    outlines.forEach(o => {
      if (o.hasChildren) allCollapsed[o.line] = true;
    });
    setCollapsedOutlines(allCollapsed);
  };

  // Debounce search effect
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?id=${id}&q=${encodeURIComponent(searchQuery)}&casesensitive=${searchCaseSensitive}`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchCaseSensitive]);

  const handleSearchResultClick = (file: string, match: any) => {
    handleFileClick(file);
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.revealLineInCenter(match.line);
        editorRef.current.setSelection({
          startLineNumber: match.line,
          startColumn: match.col,
          endLineNumber: match.line,
          endColumn: match.col + match.matchLength
        });
        editorRef.current.focus();
      }
    }, 150); // slight delay to allow editor to load new file content
  };

  const handleReplace = async (file: string, match: any) => {
    try {
      const res = await fetch(`/api/replace?id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file,
          search: searchQuery,
          replace: replaceQuery,
          line: match.line,
          matchStart: match.matchStart,
          casesensitive: searchCaseSensitive
        })
      });
      if (res.ok) {
        if (file === activeFile) {
          fetch(`/api/files/content?id=${id}&name=${encodeURIComponent(file)}`)
            .then(r => r.text())
            .then(text => {
              if (typeof text === 'string') {
                setCode(text);
                if (editorRef.current) {
                  editorRef.current.setValue(text);
                }
              }
            });
        }
        const currentSearch = searchQuery;
        setSearchQuery(""); 
        setTimeout(() => setSearchQuery(currentSearch), 10);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplaceAll = async (file?: string) => {
    try {
      const promises = [];
      const filesToReplace = file ? [searchResults.find(r => r.file === file)!] : searchResults;
      
      for (const result of filesToReplace) {
        promises.push(fetch(`/api/replace?id=${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: result.file,
            search: searchQuery,
            replace: replaceQuery,
            casesensitive: searchCaseSensitive
          })
        }));
      }

      await Promise.all(promises);
      
      // Refresh active file if it was part of the replace
      const wasActiveFileReplaced = filesToReplace.some(r => r && r.file === activeFile);
      if (wasActiveFileReplaced) {
        fetch(`/api/files/content?id=${id}&name=${encodeURIComponent(activeFile)}`)
          .then(r => r.text())
          .then(text => {
            if (typeof text === 'string') {
              setCode(text);
              if (editorRef.current) {
                editorRef.current.setValue(text);
              }
            }
          });
      }

      const currentSearch = searchQuery;
      setSearchQuery("");
      setTimeout(() => setSearchQuery(currentSearch), 10);
    } catch (err) {
      console.error(err);
    }
  };

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // Fetch files and initial content on mount
  useEffect(() => {
    fetch(`/api/files?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProjectFiles(data);
      })
      .catch(console.error);

    fetch(`/api/files/content?id=${id}&name=${encodeURIComponent(activeFile)}`)
      .then(res => {
        if (res.ok) return res.text();
        throw new Error('Failed to load file');
      })
      .then(text => {
        if (typeof text === 'string') {
          setCode(text);
        }
      })
      .catch(console.error);
  }, []);

  // Handle Ctrl+Scroll zoom for the preview panel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); // Prevent browser zoom
        const delta = e.deltaY < 0 ? 10 : -10;
        setZoom(z => Math.min(300, Math.max(50, z + delta)));
      }
    };

    const container = previewContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const memoizedSvgPages = useMemo(() => {
    return pages.map((svg, idx) => (
      <div 
        key={idx}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    ));
  }, [pages]);

  const handleDeleteFile = async (fileName: string) => {
    if (fileName === "main.typ") return;
    if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) return;

    try {
      const res = await fetch(`/api/files?id=${id}&name=${encodeURIComponent(fileName)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setProjectFiles(prev => prev.filter(f => f.name !== fileName));
      } else {
        alert("Failed to delete file");
      }
    } catch (err) {
      console.error(err);
      alert("Delete error");
    }
  };

  const handleRenameSubmit = async (oldName: string) => {
    const oldBasename = oldName.split('/').pop() || oldName;
    if (!renameInput || renameInput === oldBasename) {
      setRenamingFile(null);
      return;
    }
    const dir = oldName.substring(0, oldName.lastIndexOf('/'));
    const newName = dir ? `${dir}/${renameInput}` : renameInput;

    try {
      const res = await fetch(`/api/files?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldName, newName })
      });
      if (res.ok) {
        setProjectFiles(prev => prev.map(f => {
          if (f.name === oldName) {
            let type: 'typst' | 'image' | 'bib' | 'other' | 'folder' = f.type;
            if (type !== 'folder') {
              type = 'other';
              if (renameInput.endsWith('.typ')) type = 'typst';
              else if (renameInput.endsWith('.bib')) type = 'bib';
              else if (renameInput.match(/\.(png|jpe?g|gif|svg|webp)$/i)) type = 'image';
            }
            return { ...f, name: newName, type };
          }
          return f;
        }));
        if (activeFile === oldName) setActiveFile(newName);
      } else {
        alert("Failed to rename file");
      }
    } catch (err) {
      console.error(err);
      alert("Rename error");
    }
    setRenamingFile(null);
  };

  const handleFileClick = async (fileName: string) => {
    if (renamingFile === fileName) return;
    setActiveFile(fileName);
    try {
      const res = await fetch(`/api/files/content?id=${id}&name=${encodeURIComponent(fileName)}`);
      if (res.ok) {
        if (fileName.endsWith('.typ') || fileName.endsWith('.bib') || fileName.endsWith('.txt')) {
          const text = await res.text();
          if (typeof text === 'string') {
            setCode(text);
            if (editorRef.current) {
              editorRef.current.setValue(text);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSubmit = async () => {
    if (!createInput) {
      setCreatingItem(null);
      return;
    }
    try {
      const isFolder = creatingItem === 'folder';
      const res = await fetch(`/api/files?id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createInput, isFolder })
      });
      if (res.ok) {
        let type: 'typst' | 'image' | 'bib' | 'other' | 'folder' = 'other';
        if (isFolder) type = 'folder';
        else if (createInput.endsWith('.typ')) type = 'typst';
        else if (createInput.endsWith('.bib')) type = 'bib';
        else if (createInput.match(/\.(png|jpe?g|gif|svg|webp)$/i)) type = 'image';
        
        setProjectFiles(prev => [...prev, { name: createInput, type }]);
      } else {
        alert("Failed to create " + creatingItem);
      }
    } catch (err) {
      console.error(err);
      alert("Create error");
    }
    setCreatingItem(null);
    setCreateInput("");
  };

  const handleDrop = async (e: React.DragEvent, folderName: string) => {
    e.preventDefault();
    setDragOverFolder(null);
    const draggedFileName = e.dataTransfer.getData("fileName");
    if (!draggedFileName || draggedFileName === folderName) return;
    
    const targetIsFolder = projectFiles.find(f => f.name === folderName)?.type === 'folder';
    if (!targetIsFolder) return; // Allow bubbling to handleRootDrop

    e.stopPropagation(); // Only stop if we are handling a folder drop

    const basename = draggedFileName.split('/').pop();
    const newName = `${folderName}/${basename}`;
    if (draggedFileName === newName) return;

    try {
      const res = await fetch(`/api/files?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldName: draggedFileName, newName })
      });
      if (res.ok) {
        setProjectFiles(prev => prev.map(f => f.name === draggedFileName ? { ...f, name: newName } : f));
        if (activeFile === draggedFileName) setActiveFile(newName);
      }
    } catch (err) {
      console.error("Move error:", err);
    }
  };

  const handleRootDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverFolder(null);
    const draggedFileName = e.dataTransfer.getData("fileName");
    if (!draggedFileName) return;
    if (!draggedFileName.includes('/')) return; // already in root

    const newName = draggedFileName.split('/').pop()!;
    try {
      const res = await fetch(`/api/files?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldName: draggedFileName, newName })
      });
      if (res.ok) {
        setProjectFiles(prev => prev.map(f => f.name === draggedFileName ? { ...f, name: newName } : f));
        if (activeFile === draggedFileName) setActiveFile(newName);
      }
    } catch (err) {
      console.error("Move to root error:", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      
      const newFiles = Array.from(files).map(file => {
        formData.append("files", file);
        let type: 'typst' | 'image' | 'bib' | 'other' = 'other';
        if (file.name.endsWith('.typ')) type = 'typst';
        else if (file.name.endsWith('.bib')) type = 'bib';
        else if (file.type.startsWith('image/')) type = 'image';
        return { name: file.name, type };
      });
      
      try {
        const res = await fetch(`/api/upload?id=${id}`, {
          method: "POST",
          body: formData
        });
        
        if (res.ok) {
          setProjectFiles([...projectFiles, ...newFiles]);
          // Force a re-compile so typst can see the new files
          setCode(prev => prev + " ");
          setTimeout(() => setCode(prev => prev.slice(0, -1)), 50);
        } else {
          alert("Failed to upload files");
        }
      } catch (err) {
        console.error(err);
        alert("Upload error");
      }
    }
  };

  const formatText = (prefix: string, suffix: string = "") => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const selection = editor.getSelection();
    const model = editor.getModel();
    const text = model.getValueInRange(selection);
    
    editor.executeEdits("toolbar", [{
      range: selection,
      text: prefix + text + suffix,
      forceMoveMarkers: true
    }]);
    editor.focus();
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(`/api/export?id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const compile = async () => {
      setIsCompiling(true);
      setError(null);
      try {
        const res = await fetch(`/api/compile?id=${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, targetFile: activeFile })
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

  const toggleFolder = (folderName: string) => {
    setCollapsedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderName)) next.delete(folderName);
      else next.add(folderName);
      return next;
    });
  };

  const isVisible = (fileName: string) => {
    const parts = fileName.split('/');
    let currentPath = "";
    for (let i = 0; i < parts.length - 1; i++) {
      currentPath += (i === 0 ? "" : "/") + parts[i];
      if (collapsedFolders.has(currentPath)) return false;
    }
    return true;
  };

  const sortedFiles = [...projectFiles].sort((a, b) => a.name.localeCompare(b.name));

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
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-sm ${isExporting ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isExporting ? <div className="w-4 h-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" /> : <Download className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        <div className="w-[48px] bg-[#FDFDFD] border-r border-gray-200 flex flex-col items-center py-4 gap-4 shrink-0 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)] hidden md:flex">
          <button 
            onClick={() => setActiveTab(activeTab === 'files' ? null : 'files')}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activeTab === 'files' ? 'bg-[#E5E7EB] text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
            <File className="w-[20px] h-[20px]" strokeWidth={2} />
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === 'search' ? null : 'search')}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activeTab === 'search' ? 'bg-[#E5E7EB] text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Search className="w-[20px] h-[20px]" strokeWidth={2} />
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === 'outline' ? null : 'outline')}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activeTab === 'outline' ? 'bg-[#E5E7EB] text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Book className="w-[20px] h-[20px]" strokeWidth={2} />
          </button>

          <div className="flex-1" />
          
          <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <PenTool className="w-[20px] h-[20px]" strokeWidth={2} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <Settings className="w-[20px] h-[20px]" strokeWidth={2} />
          </button>
        </div>

        {activeTab && (
          <div className="w-[260px] bg-[#FDFDFD] border-r border-gray-200 flex flex-col shrink-0 shadow-[2px_0_15px_rgba(0,0,0,0.03)] z-10">
            {activeTab === 'files' && (
              <div className="p-4 flex flex-col h-full overflow-hidden">
                <div className="h-[52px] flex items-center justify-between shrink-0">
                  <h2 className="font-bold text-gray-900 text-[15px]">Files</h2>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center border border-gray-300/80 rounded-[4px] overflow-hidden bg-white shadow-sm">
                      <button onClick={() => { setCreatingItem('file'); setCreateInput(""); }} className="px-2 py-1.5 hover:bg-gray-50 border-r border-gray-200 text-gray-700 active:bg-gray-100 transition-colors" title="New File">
                        <FilePlus className="w-[14px] h-[14px]" />
                      </button>
                      <button onClick={() => { setCreatingItem('folder'); setCreateInput(""); }} className="px-2 py-1.5 hover:bg-gray-50 text-gray-700 active:bg-gray-100 transition-colors" title="New Folder">
                        <FolderPlus className="w-[14px] h-[14px]" />
                      </button>
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-[32px] h-[32px] flex items-center justify-center border border-gray-300/80 rounded-[4px] bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
                      title="Upload File"
                    >
                      <Upload className="w-[14px] h-[14px]" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      multiple 
                      onChange={handleFileUpload} 
                    />
                  </div>
                </div>

                <div 
                  className="flex-1 overflow-y-auto mt-2 pb-10 relative custom-scrollbar"
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={handleRootDrop}
                >
                  {creatingItem && (
                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 border-y border-blue-100">
                      {creatingItem === 'folder' ? (
                        <Folder className="w-4 h-4 text-blue-500 shrink-0 fill-blue-100" strokeWidth={1.5} />
                      ) : (
                        <File className="w-4 h-4 text-blue-500 shrink-0" strokeWidth={1.5} />
                      )}
                      <input
                        autoFocus
                        value={createInput}
                        onChange={(e) => setCreateInput(e.target.value)}
                        onBlur={handleCreateSubmit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCreateSubmit();
                          if (e.key === 'Escape') {
                            setCreatingItem(null);
                            setCreateInput("");
                          }
                        }}
                        placeholder={`New ${creatingItem}...`}
                        className="text-[13px] bg-white border border-blue-400 px-1 py-0.5 w-full outline-none"
                      />
                    </div>
                  )}
                  {sortedFiles.filter(f => isVisible(f.name)).map((file, i) => {
                    const depth = file.name.split('/').length - 1;
                    const displayName = file.name.split('/').pop() || file.name;
                    const isCollapsed = collapsedFolders.has(file.name);
                    const isFolder = file.type === 'folder';

                    return (
                      <div 
                        key={i} 
                        tabIndex={0}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setRenamingFile(file.name);
                          setRenameInput(displayName);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setContextMenu({ x: e.clientX, y: e.clientY, fileName: file.name });
                        }}
                        onClick={() => {
                          if (isFolder) toggleFolder(file.name);
                          else handleFileClick(file.name);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Delete' && file.name !== 'main.typ') {
                            handleDeleteFile(file.name);
                          }
                        }}
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData("fileName", file.name);
                        }}
                        onDragOver={(e) => {
                          if (file.type === 'folder') {
                            e.preventDefault();
                            e.stopPropagation(); // prevent triggering root drop
                            setDragOverFolder(file.name);
                          }
                        }}
                        onDragLeave={() => {
                          if (file.type === 'folder') setDragOverFolder(null);
                        }}
                        onDrop={(e) => handleDrop(e, file.name)}
                        style={{ paddingLeft: `${8 + depth * 14}px`, paddingRight: '8px' }}
                        className={`flex items-center justify-between group py-1 cursor-pointer transition-colors outline-none focus:ring-1 focus:ring-inset focus:ring-blue-400 border-l-[3px] ${
                          dragOverFolder === file.name 
                            ? 'bg-blue-50/50 border-blue-400' 
                            : activeFile === file.name 
                              ? 'bg-[#E5E7EB] text-gray-900 border-gray-400' 
                              : 'text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 relative flex-1 truncate text-[13.5px]">
                          {/* Tree Guide Lines */}
                          {depth > 0 && (
                            <div 
                              className="absolute left-0 top-0 bottom-0 pointer-events-none"
                              style={{ 
                                left: `-${depth * 14}px`, 
                                width: `${depth * 14}px` 
                              }}
                            >
                              {Array.from({ length: depth }).map((_, dIdx) => (
                                <div 
                                  key={dIdx}
                                  className="absolute top-0 bottom-0 border-l border-gray-200"
                                  style={{ left: `${8 + dIdx * 14}px` }}
                                />
                              ))}
                            </div>
                          )}

                          {isFolder ? (
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleFolder(file.name); }}
                              className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                            >
                              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          ) : (
                            <div className="w-4 h-4 shrink-0" />
                          )}

                          {file.type === 'folder' && <Folder className="w-[14px] h-[14px] text-gray-400 shrink-0 fill-gray-100" strokeWidth={1.5} />}
                          {file.type === 'typst' && <File className="w-[14px] h-[14px] text-gray-500 shrink-0" strokeWidth={1.5} />}
                          {file.type === 'image' && <ImageIcon className="w-[14px] h-[14px] text-gray-500 shrink-0" strokeWidth={1.5} />}
                          {file.type === 'bib' && <span className="text-[9px] font-bold tracking-tighter text-gray-500 bg-[#FDFDFD] border border-gray-200 px-0.5 rounded-[2px] leading-none w-[14px] h-[14px] flex items-center justify-center shrink-0">TEX</span>}
                          {file.type === 'other' && <File className="w-[14px] h-[14px] text-gray-400 shrink-0" strokeWidth={1.5} />}
                          
                          {renamingFile === file.name ? (
                            <input 
                              autoFocus
                              value={renameInput}
                              onChange={(e) => setRenameInput(e.target.value)}
                              onBlur={() => handleRenameSubmit(file.name)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRenameSubmit(file.name);
                                if (e.key === 'Escape') setRenamingFile(null);
                              }}
                              className="text-[13px] bg-white border border-blue-400 px-1 py-0.5 w-full outline-none"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="text-[13px] truncate select-none">{displayName}</span>
                          )}
                        </div>
                        
                        {activeFile === file.name && !isFolder ? (
                          <Eye className="w-[14px] h-[14px] text-gray-600 shrink-0 ml-2" />
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              setContextMenu({ x: rect.right, y: rect.bottom, fileName: file.name });
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded text-gray-500 shrink-0 ml-2 transition-opacity">
                            <MoreHorizontal className="w-[14px] h-[14px]" />
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {/* Context Menu Portal-like */}
                  {contextMenu && (
                    <div 
                      className="fixed z-50 bg-white border border-gray-200 shadow-lg rounded-md py-1 w-40 flex flex-col"
                      style={{ top: contextMenu.y, left: contextMenu.x }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button 
                        className="px-4 py-1.5 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left flex items-center gap-2"
                        onClick={() => {
                          setRenamingFile(contextMenu.fileName);
                          setRenameInput(contextMenu.fileName);
                          setContextMenu(null);
                        }}
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Rename
                      </button>
                      <button 
                        className="px-4 py-1.5 text-[13px] text-red-600 hover:bg-red-50 text-left flex items-center gap-2"
                        onClick={() => {
                          handleDeleteFile(contextMenu.fileName);
                          setContextMenu(null);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'search' && (
              <div className="p-4 flex flex-col h-full overflow-hidden">
                <div className="h-[44px] flex items-center shrink-0 mt-2 mb-2">
                  <h2 className="font-bold text-gray-900 text-[15px]">Search & Replace</h2>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <div className="border border-gray-300/80 rounded-[4px] bg-white flex items-center px-2 py-1.5 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent shadow-sm">
                    <input 
                      type="text" 
                      placeholder="Search" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="outline-none text-[13px] w-full text-gray-700 placeholder:text-gray-400" 
                    />
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <button 
                        title="Match Case"
                        onClick={() => setSearchCaseSensitive(!searchCaseSensitive)}
                        className={`px-1 py-0.5 rounded ${searchCaseSensitive ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-gray-100 font-medium'}`}
                      >
                        <span className="text-[10px]">Aa</span>
                      </button>
                    </div>
                  </div>
                  <div className="border border-gray-300/80 rounded-[4px] bg-white flex items-center px-2 py-1.5 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent shadow-sm">
                    <input 
                      type="text" 
                      placeholder="Replace" 
                      value={replaceQuery}
                      onChange={(e) => setReplaceQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleReplaceAll();
                      }}
                      className="outline-none text-[13px] w-full text-gray-700 placeholder:text-gray-400" 
                    />
                    <div className="flex items-center gap-1">
                      <button 
                        title="Replace All"
                        onClick={() => handleReplaceAll()}
                        disabled={!searchQuery || searchResults.length === 0}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-50"
                      >
                        <span className="text-[10px] font-bold leading-none block">a&gt;b</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto mt-4 custom-scrollbar -mx-4 px-4 pb-4">
                  {isSearching ? (
                    <div className="text-[12px] text-gray-400 text-center py-4">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {searchResults.map((result, i) => (
                        <div key={i} className="flex flex-col">
                          <div 
                            className="flex items-center gap-2 cursor-pointer group text-[13px] font-medium text-gray-700 hover:bg-gray-50 p-1 -mx-1 rounded transition-colors"
                            onClick={() => setCollapsedSearchResults(prev => ({...prev, [result.file]: !prev[result.file]}))}
                          >
                            <span className="text-gray-400">
                              {collapsedSearchResults[result.file] ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </span>
                            <span className="truncate flex-1">{result.file}</span>
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{result.matches.length}</span>
                            
                            <button 
                              title="Replace All in File"
                              onClick={(e) => { e.stopPropagation(); handleReplaceAll(result.file); }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded text-gray-500 transition-opacity"
                            >
                              <span className="text-[9px] font-bold block leading-none">a&gt;b</span>
                            </button>
                          </div>

                          {!collapsedSearchResults[result.file] && (
                            <div className="flex flex-col mt-1">
                              {result.matches.map((match, j) => (
                                <div 
                                  key={j} 
                                  className="flex items-start gap-2 cursor-pointer group hover:bg-accent/5 p-1 -mx-1 rounded transition-colors"
                                  onClick={() => handleSearchResultClick(result.file, match)}
                                >
                                  <div className="w-[20px] shrink-0 flex justify-end opacity-0 group-hover:opacity-100 pt-0.5">
                                    <button 
                                      title="Replace"
                                      onClick={(e) => { e.stopPropagation(); handleReplace(result.file, match); }}
                                      className="hover:bg-accent/20 p-0.5 rounded text-accent transition-colors"
                                    >
                                      <span className="text-[8px] font-bold block leading-none">a&gt;b</span>
                                    </button>
                                  </div>
                                  <div className="text-[12px] text-gray-600 font-mono break-all leading-tight py-0.5 flex-1 pl-4 relative">
                                    <span className="absolute left-0 text-gray-400 select-none text-[10px]">{match.line}</span>
                                    <span>{match.text.substring(0, match.matchStart)}</span>
                                    <span className="bg-yellow-200 text-gray-900 rounded-[2px] px-[1px] font-medium">{match.text.substring(match.matchStart, match.matchStart + match.matchLength)}</span>
                                    <span>{match.text.substring(match.matchStart + match.matchLength)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="text-[12px] text-gray-400 text-center py-4">No results found</div>
                  ) : null}
                </div>
              </div>
            )}
            
            {activeTab === 'outline' && (
              <div className="p-4 flex flex-col h-full overflow-hidden">
                <div className="h-[44px] flex items-center justify-between shrink-0 mt-2 mb-2">
                  <h2 className="font-bold text-gray-900 text-[15px]">Outline</h2>
                  <div className="flex items-center border border-gray-300/80 rounded-[4px] overflow-hidden bg-white shadow-sm">
                    <button 
                      onClick={handleExpandAllOutline}
                      title="Expand All"
                      className="px-2 py-1 hover:bg-gray-50 border-r border-gray-200 text-gray-700 text-lg leading-none active:bg-gray-100 transition-colors"
                    >+</button>
                    <button 
                      onClick={handleCollapseAllOutline}
                      title="Collapse All"
                      className="px-2 py-1 hover:bg-gray-50 text-gray-700 text-lg leading-none active:bg-gray-100 transition-colors"
                    >−</button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto mt-2 custom-scrollbar pb-10">
                  {outlines.length === 0 ? (
                    <div className="text-[12px] text-gray-400 text-center py-4">No headings found in this file</div>
                  ) : (
                    <div className="flex flex-col">
                      {visibleOutlines.map((outline) => (
                        <div 
                          key={outline.line}
                          className="flex items-center gap-1.5 hover:bg-gray-100/80 py-1.5 rounded cursor-pointer transition-colors text-[13px] text-[#0A2640] font-medium group"
                          style={{ paddingLeft: `${(outline.depth - 1) * 16 + 4}px` }}
                          onClick={() => handleOutlineClick(outline.line)}
                        >
                          <div 
                            className="w-4 h-4 flex items-center justify-center shrink-0"
                            onClick={(e) => {
                              if (outline.hasChildren) {
                                e.stopPropagation();
                                setCollapsedOutlines(prev => ({ ...prev, [outline.line]: !prev[outline.line] }));
                              }
                            }}
                          >
                            {outline.hasChildren ? (
                              collapsedOutlines[outline.line] ? (
                                <ChevronRight className="w-3.5 h-3.5 text-gray-400 hover:text-gray-700 transition-colors" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hover:text-gray-700 transition-colors" />
                              )
                            ) : (
                              <span className="w-3.5 h-3.5 inline-block" />
                            )}
                          </div>
                          <span className="truncate group-hover:text-accent transition-colors">{outline.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <PanelGroup orientation="horizontal" className="flex-1">
          
          {/* Editor Panel */}
          <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#FDFDFD]">
            
            {/* Formatting Toolbar */}
            <div className="h-[44px] border-b border-gray-200/80 flex items-center justify-between px-2 shrink-0 overflow-x-auto bg-white">
              <div className="flex items-center gap-1 p-1">
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 font-serif font-bold text-sm transition-colors">Ag</button>
                <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                <button onClick={() => formatText('*', '*')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Bold className="w-4 h-4" /></button>
                <button onClick={() => formatText('_', '_')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Italic className="w-4 h-4" /></button>
                <button onClick={() => formatText('#underline[', ']')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Underline className="w-4 h-4" /></button>
                <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                <button onClick={() => formatText('= ')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Heading className="w-4 h-4" /></button>
                <button onClick={() => formatText('- ')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><List className="w-4 h-4" /></button>
                <button onClick={() => formatText('+ ')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><ListOrdered className="w-4 h-4" /></button>
                <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                <button onClick={() => formatText('$ ', ' $')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Sigma className="w-4 h-4" /></button>
                <button onClick={() => formatText('`', '`')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Code className="w-4 h-4" /></button>
                <button onClick={() => formatText('@')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><AtSign className="w-4 h-4" /></button>
              </div>

              <div className="flex items-center gap-1 p-1">
                <button onClick={() => editorRef.current?.trigger('keyboard', 'undo', null)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Undo className="w-4 h-4" /></button>
                <button onClick={() => editorRef.current?.trigger('keyboard', 'redo', null)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 transition-colors"><Redo className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Code Editor or Image Viewer */}
            <div className="flex-1 overflow-hidden relative bg-[#FDFDFD]">
              {activeFile.match(/\.(png|jpe?g|gif|svg|webp)$/i) ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-50 border-t border-gray-200">
                  <div className="max-w-[80%] max-h-[80%] bg-white p-4 shadow-sm border border-gray-200 rounded-lg flex items-center justify-center">
                    <img 
                      src={`/api/files/content?id=${id}&name=${encodeURIComponent(activeFile)}&t=${Date.now()}`} 
                      alt={activeFile} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <p className="mt-4 text-sm text-gray-500 font-medium">{activeFile}</p>
                </div>
              ) : (
                <Editor
                  height="100%"
                  path={activeFile}
                  language={activeFile.endsWith('.bib') ? "bibtex" : "typst"}
                  theme="kairo-light"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  beforeMount={handleEditorWillMount}
                  onMount={(editor) => { editorRef.current = editor; }}
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
              )}
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
              <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="px-3 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 border-r border-gray-100 active:bg-gray-100 transition-colors">
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="px-4 text-[13px] font-medium text-gray-700 min-w-[70px] text-center select-none">
                {zoom}%
              </div>
              <button onClick={() => setZoom(z => Math.min(300, z + 25))} className="px-3 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 border-l border-gray-100 active:bg-gray-100 transition-colors">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button onClick={() => setZoom(135)} className="px-3 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 border-l border-gray-100 active:bg-gray-100 transition-colors" title="Fit to page">
                <Maximize className="w-4 h-4" />
              </button>
            </div>

            {/* Document Preview Area */}
            <div 
              ref={previewContainerRef}
              className="flex-1 overflow-auto bg-[#F3F4F6] custom-scrollbar relative"
            >
              
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

                {memoizedSvgPages.map((svgContent, idx) => (
                  <div 
                    key={idx}
                    className="bg-white shadow-md border border-gray-200/50 mb-8 origin-top [&>svg]:!max-w-none transition-all duration-200 ease-out" 
                    style={{ 
                      transform: `scale(${zoom / 100})`, 
                      marginBottom: `${Math.max(32, (zoom/100 - 1) * 1123 + 32)}px`
                    }}
                  >
                    {svgContent}
                  </div>
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
