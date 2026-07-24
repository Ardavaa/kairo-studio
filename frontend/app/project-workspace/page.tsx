"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Folder, File, MoreVertical, Edit2, Trash2, Search, X } from "lucide-react";
import {
  ChevronDown, LayoutGrid, List, BookOpen, LayoutTemplate, FolderPlus,
  MessageSquare, Compass, Cloud, FileText,
  ChevronUp, HelpCircle, Bookmark, MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectWorkspacePage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [contextMenu, setContextMenu] = useState<{ id: string, x: number, y: number } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string, title: string } | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        setProjects(Array.isArray(data) ? data : []);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newProjectTitle.trim() || isCreating) return;
    
    setIsCreating(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newProjectTitle, template: "empty" })
    });
    if (res.ok) {
      const newProject = await res.json();
      router.push(`/editor/${newProject.id}`);
    } else {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = (id: string, title: string) => {
    setProjectToDelete({ id, title });
    setDeleteConfirmText("");
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!projectToDelete || deleteConfirmText !== projectToDelete.title || isDeleting) return;

    setIsDeleting(true);
    const res = await fetch(`/api/projects/${projectToDelete.id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    }
    setIsDeleting(false);
  };

  const handleRenameSubmit = async (id: string) => {
    if (!editTitle.trim()) return;
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle })
    });
    if (res.ok) {
      const updated = await res.json();
      setProjects(prev => prev.map(p => p.id === id ? updated : p));
    }
    setEditingId(null);
  };

  const formatTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "today";
    if (days === 1) return "1 day";
    return `${days} days`;
  };

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
              <button onClick={() => setIsCreatingModalOpen(true)} className="flex-1 flex items-center p-4 lg:p-5 bg-white border border-gray-200/80 rounded-xl hover:border-gray-300 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] text-left group">
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
              {isLoading && <div className="text-gray-400 text-sm py-4">Loading projects...</div>}
              {!isLoading && projects.length === 0 && (
                <div className="text-gray-400 text-sm py-4">No projects yet. Start from scratch!</div>
              )}
              {projects.map((project, idx) => (
                view === "grid" ? (
                  <div key={project.id} className="group flex flex-col gap-3 relative">
                    {/* Document Preview (Paper) */}
                    <Link href={`/editor/${project.id}`} className="aspect-[1/1.414] bg-white border border-gray-200/80 rounded-lg shadow-sm relative overflow-hidden group-hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] group-hover:-translate-y-1 group-hover:border-gray-300 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] origin-bottom block">
                      
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
                    </Link>
                    
                    {/* Title & Metadata */}
                    <div className="flex items-start justify-between px-2 gap-2">
                      <div className="flex flex-col min-w-0">
                        {editingId === project.id ? (
                          <input 
                            autoFocus
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleRenameSubmit(project.id)}
                            onBlur={() => handleRenameSubmit(project.id)}
                            className="text-[14px] font-semibold text-gray-900 border border-accent rounded px-1 w-full outline-none"
                          />
                        ) : (
                          <Link href={`/editor/${project.id}`}>
                            <h3 className="text-[14px] font-semibold text-gray-900 leading-snug truncate group-hover:text-accent transition-colors">{project.title}</h3>
                          </Link>
                        )}
                        <p className="text-[12px] text-gray-500 truncate">Updated {formatTimeAgo(project.updated)} ago</p>
                      </div>
                      <button 
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setContextMenu({ id: project.id, x: rect.right, y: rect.bottom });
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-white border border-gray-200/80 rounded-xl hover:border-gray-300 hover:shadow-sm active:scale-[0.99] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group relative">
                    <Link href={`/editor/${project.id}`} className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-12 bg-gray-50 border border-gray-200 rounded flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        {editingId === project.id ? (
                          <input 
                            autoFocus
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleRenameSubmit(project.id)}
                            onBlur={() => handleRenameSubmit(project.id)}
                            className="text-[15px] font-semibold text-gray-900 border border-accent rounded px-1 w-full outline-none"
                            onClick={e => e.preventDefault()}
                          />
                        ) : (
                          <h3 className="text-[15px] font-semibold text-gray-900 truncate group-hover:text-accent transition-colors">{project.title}</h3>
                        )}
                        <p className="text-[13px] text-gray-500">Updated {formatTimeAgo(project.updated)} ago</p>
                      </div>
                    </Link>
                    <button 
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-100 rounded transition-all shrink-0 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setContextMenu({ id: project.id, x: rect.right - 100, y: rect.bottom });
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                )
              ))}
            </div>

            {contextMenu && (
              <div 
                className="fixed z-50 bg-white border border-gray-200 shadow-lg rounded-md py-1 w-32 flex flex-col"
                style={{ top: contextMenu.y, left: contextMenu.x - 128 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="px-4 py-1.5 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left flex items-center gap-2"
                  onClick={() => {
                    const project = projects.find(p => p.id === contextMenu.id);
                    if (project) {
                      setEditTitle(project.title);
                      setEditingId(contextMenu.id);
                    }
                    setContextMenu(null);
                  }}
                >
                  <Edit2 className="w-3.5 h-3.5" /> Rename
                </button>
                <button 
                  className="px-4 py-1.5 text-[13px] text-red-600 hover:bg-red-50 text-left flex items-center gap-2"
                  onClick={() => {
                    const project = projects.find(p => p.id === contextMenu.id);
                    if (project) {
                      handleDeleteClick(contextMenu.id, project.title);
                    }
                    setContextMenu(null);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}

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

      {/* Create Project Modal */}
      {isCreatingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" 
            onClick={() => !isCreating && setIsCreatingModalOpen(false)} 
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Create New Project</h2>
              <p className="text-sm text-gray-500 mt-1">Enter a name for your new empty document.</p>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <input 
                type="text"
                autoFocus
                value={newProjectTitle}
                onChange={e => setNewProjectTitle(e.target.value)}
                placeholder="Project Name"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[15px] outline-none focus:bg-white focus:border-accent/40 focus:ring-4 focus:ring-accent/10 transition-all duration-200"
                disabled={isCreating}
              />
              <div className="flex items-center justify-end gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setIsCreatingModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newProjectTitle.trim() || isCreating}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-accent text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && projectToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => !isDeleting && setDeleteModalOpen(false)} 
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[480px] overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Delete Project</h2>
              <button 
                type="button"
                onClick={() => !isDeleting && setDeleteModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleConfirmDelete} className="p-6">
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                The project will be permanently deleted, including its deployments and domains. This action is irreversible and can not be undone.
              </p>

              <div className="bg-red-50/80 border border-red-200/60 rounded-lg p-4 mb-6">
                <h3 className="text-red-800 font-semibold text-sm mb-1">Warning</h3>
                <p className="text-red-700 text-sm">This action is not reversible. Please be certain.</p>
              </div>

              <div className="mb-8">
                <label className="block text-sm text-gray-700 mb-2">
                  Enter the project name <strong>{projectToDelete.title}</strong> to continue:
                </label>
                <input 
                  type="text"
                  autoFocus
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-shadow"
                  disabled={isDeleting}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                <button 
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={deleteConfirmText !== projectToDelete.title || isDeleting}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-[#ef4444] text-white hover:bg-[#dc2626] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : "Delete project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
