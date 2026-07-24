"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Menu, Home, Search, Book, User, Building2, 
  FileText, Sparkles, CheckSquare, FolderOpen, 
  HelpCircle, Settings, X, Bookmark, ChevronDown,
  Plus, Send, Scale, Target, Lightbulb, BarChart2,
  Shield, MessageSquare, RefreshCw, Network,
  PanelLeftClose, PanelLeftOpen, Trash2
} from "lucide-react";
import GradientChatInput from "@/components/ui/gradient-chat-input";
import KnowledgeGraph from "@/components/KnowledgeGraph";

type Conversation = {
  id: string;
  title: string;
  created_at: string;
};

export default function AIAssistantPage() {
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);

  const fetchConversations = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/research/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (e) {
      console.error("Failed to fetch conversations", e);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleLoadConversation = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/research/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setActiveConversationId(id);
        const messages = [];
        if (data.query) {
          messages.push({ id: 1, text: data.query, sender: "user" });
        }
        if (data.explanation) {
          messages.push({ 
            id: 2, 
            text: data.explanation, 
            sender: "bot", 
            papers: data.papers,
            showGraphButton: data.papers && data.papers.length > 0
          });
        }
        setInitialMessages(messages);
        setHasStartedChat(messages.length > 0);
      }
    } catch (e) {
      console.error("Failed to load conversation", e);
    }
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent triggering the load
    try {
      const res = await fetch(`http://localhost:8000/api/v1/research/conversations/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        if (activeConversationId === id) {
          handleNewChat();
        }
        fetchConversations();
      }
    } catch (e) {
      console.error("Failed to delete conversation", e);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setInitialMessages([]);
    setHasStartedChat(false);
  };

  const handleSend = async (message: string) => {
    setHasStartedChat(true);
    // Refresh conversations after sending because a new one might be created
    setTimeout(fetchConversations, 2000); 
  };

  const handleViewGraph = () => {
    setShowGraph(true);
  };

  return (
    <div className="flex h-screen bg-warm-white text-primary font-sans relative overflow-hidden">
      {/* Knowledge Graph Modal */}
      {showGraph && <KnowledgeGraph onClose={() => setShowGraph(false)} />}
      {/* Background Glow */}
      {!hasStartedChat && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[900px] bg-[radial-gradient(ellipse_at_50%_40%,rgba(234,88,12,0.12)_0%,transparent_70%)] pointer-events-none z-0 hidden md:block" />
      )}

      {/* Page Container (accounting for global sidebar) */}
      <div className="flex-1 ml-0 md:ml-[280px] flex h-screen relative z-10 transition-all">
        
        {/* Secondary Sidebar: Chat History */}
        {isSidebarOpen && (
          <>
            {/* Backdrop for mobile */}
            <div 
              className="fixed inset-0 bg-black/20 z-40 lg:hidden animate-fade-in"
              onClick={() => setIsSidebarOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 lg:relative z-50 lg:z-auto w-[280px] lg:w-[260px] bg-paper-white border-r border-soft-border flex flex-col shrink-0 animate-fade-in h-screen shadow-2xl lg:shadow-none">
              <div className="h-[72px] p-4 flex items-center justify-between border-b border-transparent shrink-0 gap-2">
                <button 
                  onClick={handleNewChat}
                  className="flex-1 flex items-center gap-2 text-[14px] font-semibold text-primary hover:bg-black/5 py-2 px-3 rounded-xl transition-colors border border-soft-border shadow-sm bg-white"
                >
                  <Plus className="w-4 h-4 text-accent" />
                  New Chat
                </button>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="shrink-0 p-2 text-muted hover:text-primary hover:bg-black/5 rounded-lg transition-colors"
                  title="Close sidebar"
                >
                  <PanelLeftClose className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
                <div>
                  <h4 className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2 px-2">Recent Chats</h4>
                  <div className="space-y-0.5">
                    {conversations.length === 0 ? (
                      <div className="px-2 py-2 text-[12px] text-muted italic">No past conversations</div>
                    ) : (
                      conversations.map(conv => (
                        <div key={conv.id} className={`group flex items-center justify-between w-full text-left px-2.5 py-2 text-[13px] rounded-lg transition-colors cursor-pointer ${activeConversationId === conv.id ? 'bg-black/5 text-primary font-medium' : 'text-muted hover:bg-black/5 hover:text-primary'}`} onClick={() => { handleLoadConversation(conv.id); if(window.innerWidth < 768) setIsSidebarOpen(false); }}>
                          <span className="truncate">{conv.title}</span>
                          <button 
                            onClick={(e) => handleDeleteConversation(e, conv.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                            title="Delete conversation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col relative bg-warm-white h-screen pt-[60px] lg:pt-0 overflow-hidden">
          {/* Floating Expand Sidebar Button when closed */}
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-[76px] lg:top-4 left-4 z-30 lg:z-50 p-2 text-muted hover:text-primary hover:bg-white/80 rounded-lg transition-colors bg-warm-white/80 backdrop-blur-md border border-soft-border shadow-sm"
              title="Open sidebar"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          )}

          {/* Topbar */}
          {hasStartedChat && (
            <header className="h-16 md:h-[72px] flex items-center justify-end px-4 md:px-10 shrink-0 bg-warm-white/90 backdrop-blur-md z-40 border-b border-transparent transition-all">
              <div className="flex items-center gap-4 md:gap-8">
                <a href="#" className="hidden md:block text-sm font-semibold text-primary hover:text-accent transition-colors">
                  Journals & Conferences
                </a>
                <button className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors">
                  Research Tools
                  <ChevronDown className="w-4 h-4 text-muted" />
                </button>
                <a href="#" className="hidden md:flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors">
                  <HelpCircle className="w-4 h-4 text-muted" />
                  Help
                </a>
                <div className="hidden md:block w-px h-5 bg-soft-border mx-2" />
                <a href="#" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors">
                  <Bookmark className="w-4 h-4 text-muted" />
                  <span className="hidden sm:inline">My Library</span>
                </a>
                <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#f4ece1] flex items-center justify-center text-sm font-bold text-primary ml-2 border border-soft-border hover:border-muted transition-colors">
                  D
                </button>
              </div>
            </header>
          )}

            {/* Center Content */}
            <div className={`flex-1 flex flex-col transition-all duration-700 ease-in-out w-full ${hasStartedChat ? 'pt-0 overflow-hidden' : 'pt-4 sm:pt-12 md:pt-24 overflow-y-auto no-scrollbar'}`}>
              
              {!hasStartedChat && (
                <div className="flex flex-col items-center animate-fade-in text-center mt-[2vh] md:mt-[5vh] px-4 md:px-8 shrink-0">
                  <h1 className="font-serif text-3xl md:text-[42px] font-normal text-primary mb-2 md:mb-3">
                    Ask away, Ardava!
                  </h1>
                  <p className="text-muted text-sm md:text-[15px] mb-4 md:mb-10 max-w-sm md:max-w-none mx-auto">
                    Your AI partner for research. Ask anything or get help with your research tasks.
                  </p>
                </div>
              )}

              {/* Search/Chat Input Box */}
              <div className={`w-full relative z-30 flex flex-col overflow-hidden ${hasStartedChat ? 'flex-1 justify-end' : 'shrink-0'}`}>
                <GradientChatInput
                  key={activeConversationId || 'new'}
                  initialMessages={initialMessages}
                  placeholder="Ask anything about your research..."
                  onSend={handleSend}
                  onViewGraph={handleViewGraph}
                  className={hasStartedChat ? "w-full h-full" : "w-full"}
                />
              </div>

              {!hasStartedChat && (
                <div className="animate-fade-in mt-6 md:mt-10 w-full flex flex-col items-center px-4 shrink-0 pb-12">
                  <span className="text-[13px] text-muted mb-4 md:mb-6">Try asking about</span>

                  {/* Grid 1: Action Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full max-w-[800px] mb-8">
                    <div className="bg-paper-white border border-soft-border rounded-xl p-4 md:p-5 hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-[14px] font-semibold text-primary mb-1">Summarize a paper</h4>
                        <p className="text-[12px] text-muted leading-relaxed">Get a concise summary of key findings and insights.</p>
                      </div>
                    </div>

                    <div className="bg-paper-white border border-soft-border rounded-xl p-4 md:p-5 hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                        <Scale className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-[14px] font-semibold text-primary mb-1">Compare methods</h4>
                        <p className="text-[12px] text-muted leading-relaxed">Compare approaches, models, or techniques.</p>
                      </div>
                    </div>

                    <div className="bg-paper-white border border-soft-border rounded-xl p-4 md:p-5 hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                        <Search className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-[14px] font-semibold text-primary mb-1">Find recent papers</h4>
                        <p className="text-[12px] text-muted leading-relaxed">Discover the latest and most relevant papers.</p>
                      </div>
                    </div>

                    <div className="bg-paper-white border border-soft-border rounded-xl p-4 md:p-5 hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                        <Target className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-[14px] font-semibold text-primary mb-1">Identify research gaps</h4>
                        <p className="text-[12px] text-muted leading-relaxed">Find open problems and future research directions.</p>
                      </div>
                    </div>

                    <div className="bg-paper-white border border-soft-border rounded-xl p-4 md:p-5 hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-[14px] font-semibold text-primary mb-1">Explain a concept</h4>
                        <p className="text-[12px] text-muted leading-relaxed">Get clear explanations for complex concepts.</p>
                      </div>
                    </div>

                    <div className="bg-paper-white border border-soft-border rounded-xl p-4 md:p-5 hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer flex items-start gap-4">
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
                  <div className="bg-black/5 rounded-full py-2 px-4 md:py-2.5 md:px-5 flex items-center gap-2 text-[12px] md:text-[13px] text-primary/80 font-medium border border-black/5 mb-8 md:mb-0 text-center">
                    <Shield className="w-4 h-4 shrink-0" />
                    <span className="leading-tight">Your conversations are private and used only to help you with research.</span>
                  </div>
                </div>
              )}
            </div>
        </main>
      </div>
    </div>
  );
}
