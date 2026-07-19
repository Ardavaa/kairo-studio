"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Menu, Home, Search, Book, User, Building2, 
  FileText, Sparkles, CheckSquare, FolderOpen, 
  HelpCircle, Settings, X, Bookmark, ChevronDown,
  Plus, Send, Scale, Target, Lightbulb, BarChart2,
  Shield, MessageSquare, RefreshCw, Network
} from "lucide-react";
import GradientChatInput from "@/components/ui/gradient-chat-input";
import KnowledgeGraph from "@/components/KnowledgeGraph";

export default function AIAssistantPage() {
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const handleSend = async (message: string) => {
    setHasStartedChat(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/research/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: message }),
      });
      // the GradientChatInput will handle the auto-reply UI and showing the button.
    } catch (e) {
      console.error("Error connecting to backend.", e);
    }
  };

  const handleViewGraph = () => {
    setShowGraph(true);
  };

  return (
    <div className="flex min-h-screen bg-warm-white text-primary font-sans relative">
      {/* Knowledge Graph Modal */}
      {showGraph && <KnowledgeGraph onClose={() => setShowGraph(false)} />}
      {/* Background Glow */}
      {!hasStartedChat && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[900px] bg-[radial-gradient(ellipse_at_50%_40%,rgba(234,88,12,0.12)_0%,transparent_70%)] pointer-events-none z-0" />
      )}

      {/* Main Content */}
      <main className="flex-1 ml-[280px] min-w-0 flex flex-col relative z-10 animate-page-in min-h-screen">
        {/* Topbar */}
        {hasStartedChat && (
          <header className="h-[72px] flex items-center justify-end px-10 shrink-0 sticky top-0 bg-warm-white/80 backdrop-blur-md z-40 border-b border-transparent transition-all">
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
        )}

        {/* Center Content */}
        <div className={`flex-1 flex flex-col items-center px-8 pb-12 transition-all duration-700 ease-in-out ${hasStartedChat ? 'pt-8' : 'pt-24'}`}>
          
          {!hasStartedChat && (
            <div className="flex flex-col items-center animate-fade-in text-center">
              <h1 className="font-serif text-[42px] font-normal text-primary mb-3">
                Ask away, Ardava!
              </h1>
              <p className="text-muted text-[15px] mb-10">
                Your AI partner for research. Ask anything or get help with your research tasks.
              </p>
            </div>
          )}

          {/* Search/Chat Input Box */}
          <div className="w-full max-w-[800px] relative z-30 flex-1 flex flex-col justify-end">
            <GradientChatInput
              placeholder="Ask anything about your research..."
              onSend={handleSend}
              onViewGraph={handleViewGraph}
              className="w-full max-w-full"
            />
          </div>

          {!hasStartedChat && (
            <div className="animate-fade-in mt-10 w-full flex flex-col items-center">
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
          )}
        </div>
      </main>
    </div>
  );
}
