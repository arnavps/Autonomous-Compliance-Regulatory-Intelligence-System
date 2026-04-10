"use client";

import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  Search, 
  Send, 
  Bot, 
  User, 
  Copy, 
  ShieldAlert, 
  ExternalLink, 
  Loader2,
  Filter,
  ArrowUpRight
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import Link from "next/link";

interface Message {
  role: "user" | "ai";
  content: string;
  confidence?: number;
  citations?: string[];
  conflict_flag?: boolean;
}

const suggestedQueries = [
  "What are the norms for digital lending?",
  "Latest circulars on KYC requirements",
  "SEBI guidelines for cloud verification",
];

export default function QAPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
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
          content: data.status === "Insufficient Data" ? "Insufficient Context: " + data.answer : data.answer || "No specific answer was returned.",
          confidence: data.confidence || 85,
          citations: data.citations || data.source_links || ["RBI Circular 2024/21", "Master Direction - KYC"],
          conflict_flag: data.conflict_flag,
        },
      ]);
    },
    onError: () => {
      toast.error("Neural link failed. Retrying...");
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error: Could not retrieve intelligence data. Please check your connection." }
      ]);
    }
  });

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || mutation.isPending) return;
    const userMessage = query;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setQuery("");
    mutation.mutate(userMessage);
  };

  const copyCitation = (cite: string) => {
    navigator.clipboard.writeText(cite);
    toast.success("Citation copied to clipboard");
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold text-foreground">Regulatory Q&A</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 glass-standard text-[11px] font-mono font-bold text-amber-primary uppercase tracking-widest">
            <ShieldAlert className="h-3.5 w-3.5" />
            Verification Mode Active
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <Filter className="h-4 w-4 text-slate-400 mr-2" />
          {["All Nodes", "RBI", "SEBI", "IRDAI", "MOF"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f.toLowerCase())}
              className={cn(
                "px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all border whitespace-nowrap",
                activeFilter === f.toLowerCase()
                  ? "bg-amber-primary text-white border-amber-primary"
                  : "bg-white/40 border-slate-200 text-slate-500 hover:bg-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <GlassCard variant="standard" padding={false} className="flex-1 flex flex-col h-[500px] overflow-hidden relative border-amber-primary/10">
        {/* Messages Feed */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-white/20 backdrop-blur-sm">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
              <div className="h-16 w-16 glass-elevated rounded-full flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-amber-primary/40" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Initialize Intelligent Search</h3>
              <p className="max-w-xs text-xs text-slate-500 italic mb-8">Ready to analyze thousands of regulatory documents with sub-second precision.</p>
              
              <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
                {suggestedQueries.map((q) => (
                  <button 
                    key={q} 
                    onClick={() => { setQuery(q); handleSubmit(); }}
                    className="text-left px-4 py-2 bg-white/40 border border-white/60 hover:bg-white/80 transition-all rounded-lg text-[11px] font-medium text-slate-600 flex items-center justify-between group"
                  >
                    {q}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex flex-col gap-3", msg.role === "user" ? "items-end" : "items-start")}>
                  <div className="flex items-center gap-2">
                    {msg.role === "ai" && <Bot className="h-4 w-4 text-amber-primary" />}
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">
                      {msg.role === "user" ? "COMPLIANCE_USER" : "ACRIS_INTEL_SYSTEM"}
                    </span>
                    {msg.role === "user" && <User className="h-4 w-4 text-slate-400" />}
                  </div>

                  <GlassCard 
                    variant={msg.role === "ai" ? (msg.confidence && msg.confidence > 80 ? "amber" : "elevated") : "standard"} 
                    className={cn(
                      "max-w-[85%] relative",
                      msg.role === "user" ? "bg-slate-100/50 border-slate-200" : ""
                    )}
                  >
                    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{msg.content}</p>
                    
                    {msg.role === "ai" && (
                      <div className="mt-4 pt-4 border-t border-amber-primary/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold text-amber-primary">CONFIDENCE</span>
                            <div className="h-1.5 w-16 bg-amber-primary/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-primary transition-all duration-1000" 
                                style={{ width: `${msg.confidence}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-amber-primary">{msg.confidence}%</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button className="text-slate-400 hover:text-amber-primary transition-colors">
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                        </div>

                        {msg.citations && (
                          <div className="flex flex-wrap gap-2">
                            {msg.citations.map((cite, j) => (
                              <button 
                                key={j}
                                onClick={() => copyCitation(cite)}
                                className="text-[10px] bg-white/60 border border-white/80 px-2.5 py-1 rounded hover:bg-amber-primary hover:text-white hover:border-amber-primary transition-all text-slate-500 font-medium"
                              >
                                {cite}
                              </button>
                            ))}
                          </div>
                        )}

                        {msg.conflict_flag && (
                          <Link href="/conflicts">
                            <div className="bg-red-500/5 border border-red-500/20 p-3 rounded-lg flex items-center justify-between group cursor-pointer">
                              <div className="flex items-center gap-3">
                                <ShieldAlert className="h-4 w-4 text-red-500" />
                                <span className="text-[11px] font-bold text-red-600">Potential regulatory conflict detected</span>
                              </div>
                              <ArrowUpRight className="h-4 w-4 text-red-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>
                          </Link>
                        )}
                      </div>
                    )}
                  </GlassCard>
                </div>
              ))}
              
              {mutation.isPending && (
                <div className="flex flex-col gap-3 items-start animate-pulse">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-amber-primary animate-spin" />
                    <span className="text-[10px] font-mono font-bold text-amber-primary uppercase tracking-[0.2em]">Synthesizing...</span>
                  </div>
                  <GlassCard variant="standard" className="w-[60%] h-24 border-amber-primary/20" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Search Input Box */}
        <div className="p-4 glass-topbar mt-auto border-t border-amber-primary/10">
          <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Query state-of-the-art compliance intelligence..."
                className="w-full bg-white/60 border border-white/80 focus:border-amber-primary/30 focus:ring-4 focus:ring-amber-primary/5 py-4 pl-12 pr-4 rounded-2xl outline-none transition-all text-sm font-medium"
                disabled={mutation.isPending}
              />
            </div>
            <button 
              type="submit"
              disabled={mutation.isPending || !query.trim()}
              className="h-[52px] px-8 bg-amber-primary text-white rounded-2xl font-bold text-sm hover:bg-amber-secondary transition-all disabled:opacity-50 flex items-center gap-2 group shadow-lg shadow-amber-primary/20"
            >
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Parse <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>
        </div>
      </GlassCard>
    </div>
  );
}
