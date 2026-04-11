"use client";

import { MessageSquareLock, ShieldEllipsis, User, Bot, Loader2, Copy, AlertTriangle, ExternalLink, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "../../../services/apiService";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/lib/store/workflowStore";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "ai";
  content: string;
  confidence?: number;
  citations?: string[];
  conflict_flag?: boolean;
}

export default function QnAPage() {
  const router = useRouter();
  const addConflictToWorkbench = useWorkflowStore((state) => state.addConflictToWorkbench);
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, query]);

  const mutation = useMutation({
    mutationFn: (userMessage: string) => apiService.queryRegulation({ query: userMessage }),
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.status === "Insufficient Data" ? "Insufficient Context: " + data.answer : data.answer || "No specific answer was returned for this query.",
          confidence: data.confidence,
          citations: data.citations || data.source_links,
          conflict_flag: data.conflict_flag,
        },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error: Could not retrieve intelligence data. Neural link failed." }
      ]);
    }
  });

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 80) return "text-tertiary";
    if (confidence >= 65) return "text-primary";
    return "text-destructive";
  };

  const copyCitation = (citation: string) => {
    navigator.clipboard.writeText(citation);
    toast.success("Citation Logged", {
      description: "Neural vector stored in clipboard.",
    });
  };

  const handleSubmit = () => {
    if (!query.trim() || mutation.isPending) return;
    const userMessage = query;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setQuery("");
    mutation.mutate(userMessage);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex items-end justify-between mb-10 flex-shrink-0 border-b-[0.5px] border-border/10 pb-6">
        <div>
          <div className="tech-label text-primary mb-3">Verification Interface</div>
          <h1 className="text-4xl font-bold font-serif italic tracking-tight text-foreground">Regulatory Q&A</h1>
        </div>
        <div className="flex items-center gap-3 px-5 py-2 bg-surface-container border-[0.5px] border-border/20">
          <ShieldEllipsis className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-mono font-bold text-foreground tracking-widest uppercase">Federated Guardrails ON</span>
        </div>
      </div>

      <div className="bg-white border-[0.5px] border-border/20 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] flex flex-col flex-1 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-transparent via-primary/20 to-transparent z-10" />
        
        {/* Chat Feed */}
        <div ref={scrollRef} className="flex-1 p-10 overflow-y-auto w-full scroll-smoth space-y-12">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-full opacity-30">
              <MessageSquareLock className="h-16 w-16 text-muted-foreground/20 mb-6 font-thin" />
              <h3 className="text-xl font-bold font-serif italic mb-2">Initialize Query</h3>
              <p className="text-muted-foreground font-serif max-w-sm text-sm">Awaiting cryptographic search parameters across RBI and SEBI databases.</p>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-6", msg.role === "user" ? "flex-row-reverse" : "")}>
                  <div className={cn(
                    "h-10 w-10 shrink-0 border-[0.5px] flex items-center justify-center",
                    msg.role === "user" ? "bg-surface-container-highest border-border/20" : "bg-primary border-primary"
                  )}>
                    {msg.role === "user" ? <User className="h-5 w-5 text-muted-foreground" /> : <Bot className="h-5 w-5 text-white" />}
                  </div>
                  
                  <div className={cn(
                    "max-w-[75%] p-8 border-[0.5px]",
                    msg.role === "user" 
                      ? "bg-surface-container-low border-border/20 text-foreground font-serif" 
                      : "bg-surface-container border-border/10 text-foreground font-serif leading-relaxed"
                  )}>
                    <p className="text-[15px]">{msg.content}</p>
                    
                    {msg.role === "ai" && msg.conflict_flag && (
                      <div className="mt-8 p-6 bg-destructive/5 border-[0.5px] border-destructive/20">
                        <div className="flex items-center gap-2 text-destructive font-mono font-bold text-[10px] uppercase tracking-widest mb-3">
                          <AlertTriangle className="h-4 w-4" />
                          Ambiguity Vector Detected
                        </div>
                        <p className="text-xs text-destructive/80 italic mb-6">Contradictory directives found in source documents.</p>
                        <button 
                          onClick={() => {
                            addConflictToWorkbench({
                              id: `QA-${Math.floor(Math.random() * 9000) + 1000}`,
                              source: { id: "Query Bot", title: "AI Detected Ambiguity" },
                              target: { id: "INTERNAL", title: "Institutional Policy" },
                              severity: 'High',
                              type: "Regulatory Ambiguity",
                              reasoning: msg.content,
                              status: 'Unresolved'
                            });
                            toast.success("Ambiguity promoted to legal workbench.");
                            router.push("/dashboard/amendment-workbench");
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-white border-[0.5px] border-destructive/20 text-destructive text-[9px] font-mono font-bold uppercase transition-colors hover:bg-destructive/5">
                          <ExternalLink className="h-3 w-3" />
                          ANALYZE IN CONFLICT EXPLORER
                        </button>
                      </div>
                    )}

                    {msg.role === "ai" && msg.citations && msg.citations.length > 0 && (
                      <div className="mt-8 pt-8 border-t-[0.5px] border-border/10">
                        <div className="flex items-center justify-between mb-6">
                          <span className="tech-label text-muted-foreground/30">Verification Citations</span>
                          {msg.confidence && (
                            <span className={cn("text-[10px] font-mono font-bold uppercase tracking-widest", getConfidenceColor(msg.confidence))}>
                              {msg.confidence}% CONFIDENCE
                            </span>
                          )}
                        </div>
                        <ul className="space-y-3">
                          {msg.citations.map((cite, j) => (
                            <li key={j} className="flex gap-4 items-start justify-between bg-white/50 p-4 border-[0.5px] border-border/10 group/cite">
                              <span className="text-[11px] font-mono text-muted-foreground leading-relaxed italic">• {cite}</span>
                              <button onClick={() => copyCitation(cite)} className="text-muted-foreground/20 hover:text-primary transition-colors shrink-0">
                                <Copy className="h-4 w-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {mutation.isPending && (
                <div className="flex gap-6 animate-pulse">
                  <div className="h-10 w-10 shrink-0 bg-primary/20 border-primary/10 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  </div>
                  <div className="max-w-[75%] p-8 bg-surface-container-low border-[0.5px] border-border/10 w-full">
                    <div className="tech-label text-primary/40 mb-4 animate-pulse">Synthesizing Regulatory Vector</div>
                    <div className="space-y-3">
                      <div className="h-[1px] bg-border/20 w-3/4"></div>
                      <div className="h-[1px] bg-border/20 w-full"></div>
                      <div className="h-[1px] bg-border/20 w-5/6"></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Input Block */}
        <div className="p-8 border-t-[0.5px] border-border/10 bg-surface-container-low/50">
          <div className="relative flex items-center gap-4">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Query regulatory framework for neural validation..."
              className="flex-1 bg-white border-[0.5px] border-border/20 py-5 px-8 text-sm font-serif italic focus:border-primary transition-all outline-none shadow-inner text-foreground placeholder:text-muted-foreground/30"
              disabled={mutation.isPending}
            />
            <button 
              onClick={handleSubmit}
              disabled={mutation.isPending || !query.trim()}
              className="px-10 h-[60px] bg-primary text-white text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-amber-900 transition-all disabled:opacity-30 flex items-center justify-center gap-3">
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> SUBMIT QUERY</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

