"use client";

import * as React from "react";
import { Plus, Send, Network, FileText, Quote } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ToolCallingLoader from "./ToolCallingLoader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ------------------------------------------------------------------ */
/*  types                                                             */
/* ------------------------------------------------------------------ */
export interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "bot";
  showGraphButton?: boolean;
  isLoading?: boolean;
  papers?: any[];
}

export interface GradientChatInputProps {
  placeholder?: string;
  sound?: boolean;
  onSend?: (message: string) => void;
  onViewGraph?: () => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  component                                                         */
/* ------------------------------------------------------------------ */
export default function GradientChatInput({
  placeholder = "Send Message",
  sound = true,
  onSend,
  onViewGraph,
  className,
}: GradientChatInputProps) {
  const [value, setValue] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const idRef = React.useRef(0);
  const audioRef = React.useRef<AudioContext | null>(null);

  const getAudioContext = React.useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (Ctx) audioRef.current = new Ctx();
    }
    return audioRef.current;
  }, []);

  const playChime = React.useCallback(
    (notes: { freq: number; at: number }[], volume: number) => {
      if (!sound) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === "suspended") void ctx.resume();

      notes.forEach(({ freq, at }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + at;
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.2);
      });
    },
    [sound, getAudioContext],
  );

  const playSend = React.useCallback(
    () => playChime([{ freq: 523.25, at: 0 }, { freq: 783.99, at: 0.06 }], 0.05),
    [playChime],
  );

  const playReceive = React.useCallback(
    () => playChime([{ freq: 392.0, at: 0 }, { freq: 587.33, at: 0.08 }], 0.05),
    [playChime],
  );

  const handleSend = async () => {
    const text = value.trim();
    if (!text) return;

    onSend?.(text);
    const userId = idRef.current++;
    setMessages((prev) => [...prev, { id: userId, text, sender: "user" }]);
    playSend();
    setValue("");

    const botId = idRef.current++;
    setMessages((prev) => [...prev, { id: botId, text: "", sender: "bot", isLoading: true }]);

    try {
      const res = await fetch("http://localhost:8000/api/v1/research/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });
      
      const data = await res.json();
      
      playReceive();
      setMessages((prev) => 
        prev.map((m) => 
          m.id === botId 
            ? { 
                ...m, 
                isLoading: false, 
                text: data.explanation || "Pencarian selesai.", 
                papers: data.papers || [],
                showGraphButton: true
              } 
            : m
        )
      );
    } catch (e) {
      console.error(e);
      playReceive();
      setMessages((prev) => 
        prev.map((m) => 
          m.id === botId 
            ? { ...m, isLoading: false, text: "Gagal memproses permintaan." } 
            : m
        )
      );
    }
  };

  const hasText = value.trim().length > 0;

  return (
    <div className={cn("relative mx-auto w-full max-w-4xl flex flex-col h-full", className)}>
      <div className="flex-1 flex flex-col gap-6 px-2 pb-8 pt-4">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={cn(
                "flex flex-col gap-3",
                m.sender === "user" ? "items-end" : "items-start"
              )}
            >
              <div className={cn(
                "max-w-[85%] break-words px-5 py-4 text-[15px] shadow-sm flex flex-col gap-4",
                m.sender === "user"
                  ? "rounded-[24px_24px_6px_24px] bg-paper-white border border-soft-border text-primary"
                  : "rounded-[24px_24px_24px_6px] bg-[#E85D04]/5 text-primary border border-[#E85D04]/20"
              )}>
                {m.isLoading ? (
                  <ToolCallingLoader />
                ) : (
                  <>
                    {m.sender === "bot" ? (
                      <div className="prose prose-sm max-w-none text-primary prose-p:leading-relaxed prose-headings:text-primary prose-a:text-accent prose-table:my-4">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({node, ...props}) => <div className="overflow-x-auto"><table className="min-w-full divide-y divide-soft-border border border-soft-border rounded-lg" {...props} /></div>,
                            th: ({node, ...props}) => <th className="px-4 py-3 bg-black/5 text-left text-xs font-semibold uppercase tracking-wider" {...props} />,
                            td: ({node, ...props}) => <td className="px-4 py-3 border-t border-soft-border text-[13.5px]" {...props} />,
                          }}
                        >
                          {m.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span>{m.text}</span>
                    )}
                    
                    {/* Render Papers if they exist */}
                    {m.papers && m.papers.length > 0 && (
                      <div className="flex flex-col gap-3 mt-2 w-full">
                        <span className="text-[13px] font-semibold text-muted uppercase tracking-wider">Top Sources</span>
                        <div className="grid grid-cols-1 gap-3">
                          {m.papers.map((p, idx) => (
                            <motion.div 
                              key={p.openalex_id || idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + (idx * 0.1) }}
                              className="bg-white border border-soft-border rounded-xl p-4 flex gap-3 items-start shadow-sm"
                            >
                              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                                <FileText className="w-4 h-4 text-accent" />
                              </div>
                              <div className="flex flex-col">
                                <a href={p.openalex_id} target="_blank" rel="noreferrer" className="font-semibold text-[14px] text-primary hover:text-accent hover:underline leading-snug">
                                  {p.title}
                                </a>
                                <div className="flex items-center gap-4 mt-2 text-[12px] text-muted">
                                  <span>📅 {p.publication_year || "Unknown"}</span>
                                  {p.cited_by_count !== undefined && (
                                    <span className="flex items-center gap-1"><Quote className="w-3 h-3"/> {p.cited_by_count} citations</span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {m.showGraphButton && (
                      <motion.button 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        onClick={() => onViewGraph?.()}
                        className="flex items-center gap-2 mt-2 self-start bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
                      >
                        <Network className="w-4 h-4" />
                        Explore in Knowledge Graph
                      </motion.button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* the input card */}
      <div className="sticky bottom-8 z-10 w-full mt-auto">
        <div className="relative rounded-[24px] border border-soft-border bg-paper-white p-1.5 shadow-md">
          <div className="relative z-[2] flex items-center justify-between gap-3 rounded-[20px] bg-paper-white p-1.5">
          <div className="flex flex-1 items-center gap-3 pr-1">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Add attachment"
              className="size-11 shrink-0 rounded-xl bg-black/5 text-muted hover:bg-black/10 hover:text-primary transition-colors border-none"
            >
              <Plus className="size-5" />
            </Button>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={placeholder}
              aria-label="Message"
              className="h-auto flex-1 border-none outline-none focus:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-2 py-0 text-[15px] text-primary shadow-none placeholder:text-muted/70"
            />
          </div>
          <Button
            type="button"
            onClick={handleSend}
            onMouseDown={(e) => e.preventDefault()}
            size="icon"
            aria-label="Send message"
            className={cn(
              "size-11 shrink-0 rounded-xl transition-all active:scale-95",
              hasText ? "bg-accent hover:bg-accent/90 text-white shadow-sm" : "bg-black/5 text-muted/50 hover:bg-black/5"
            )}
          >
            <Send className="size-5" strokeWidth={2} />
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
