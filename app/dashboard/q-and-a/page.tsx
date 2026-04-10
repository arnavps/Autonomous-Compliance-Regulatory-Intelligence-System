"use client";

import { MessageSquareLock, ShieldEllipsis, User, Bot, Loader2, Copy, AlertTriangle, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "../../../services/apiService";
import { toast } from "sonner";
import Link from "next/link";

interface Message {
  role: "user" | "ai";
  content: string;
  confidence?: number;
  citations?: string[];
  conflict_flag?: boolean;
}

export default function QnAPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
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
    onError: (error) => {
      // The Axios interceptor fires a generic toast for 5xx/429 errors.
      // We also update the chat UI gracefully.
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error: Could not retrieve intelligence data. Please verify the backend connection." }
      ]);
    }
  });

  const getConfidenceBadge = (confidence: number) => {
    if (confidence > 80) return "bg-green-100 text-green-700";
    if (confidence >= 65) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const copyCitation = (citation: string) => {
    navigator.clipboard.writeText(citation);
    toast.success("Citation Copied", {
      description: "Copied to clipboard for investor-grade reporting.",
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
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold font-aventa tracking-tight">Regulatory Q&A</h1>
          <p className="text-slate-500 font-garamond italic">Ask any regulatory question grounded in verified India FinReg sources.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg">
          <ShieldEllipsis className="h-5 w-5 text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-700">Enterprise Guardrails Active</span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        
        {/* Chat Feed */}
        <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto w-full scroll-smooth">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <MessageSquareLock className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Initialize Compliance Query</h3>
              <p className="text-slate-400 max-w-sm">Type your query below to start a verified search across RBI and SEBI databases.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-indigo-100" : "bg-slate-100 border border-slate-200"}`}>
                    {msg.role === "user" ? <User className="h-5 w-5 text-indigo-600" /> : <Bot className="h-5 w-5 text-slate-600" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-5 ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-slate-50 border border-slate-100 rounded-tl-sm text-slate-700"}`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    
                    {/* Conflict Detect block */}
                    {msg.role === "ai" && msg.conflict_flag && (
                      <div className="mt-4 mb-2 p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                          <AlertTriangle className="h-5 w-5" />
                          Conflict Detected
                        </div>
                        <p className="text-xs text-red-600">ACRIS has detected a contradiction in the underlying regulatory sources regarding this topic.</p>
                        <Link href="/dashboard/conflict-map">
                          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-red-200 text-red-700 rounded-md text-xs font-semibold hover:bg-red-50 transition-colors w-max">
                            <ExternalLink className="h-4 w-4" />
                            View in Conflict Explorer
                          </button>
                        </Link>
                      </div>
                    )}

                    {/* Citations block for AI */}
                    {msg.role === "ai" && msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200/60">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Citations</span>
                          {msg.confidence && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${getConfidenceBadge(msg.confidence)}`}>
                              {msg.confidence}% Confidence
                            </span>
                          )}
                        </div>
                        <ul className="text-xs text-indigo-600 space-y-2">
                          {msg.citations.map((cite, j) => (
                            <li key={j} className="flex gap-2 items-start justify-between bg-white p-2 rounded-md border border-slate-200">
                              <span className="flex-1 leading-relaxed">• {cite}</span>
                              <button onClick={() => copyCitation(cite)} className="text-slate-400 hover:text-indigo-600 transition-colors shrink-0">
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
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center bg-slate-100 border border-slate-200">
                    <Bot className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl p-5 bg-slate-50 border border-slate-100 rounded-tl-sm w-full shadow-inner animate-pulse">
                    <div className="flex items-center gap-2 mb-4">
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      <span className="text-sm font-medium text-slate-500 italic">ACRIS is cross-referencing regulatory framework...</span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <div className="h-2 bg-slate-200 rounded-full w-3/4"></div>
                      <div className="h-2 bg-slate-200 rounded-full w-full"></div>
                      <div className="h-2 bg-slate-200 rounded-full w-5/6"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Input Block */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-[2rem] flex-shrink-0">
          <div className="relative group">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="e.g., What are the latest KYC norms for Digital Lending as per RBI August 2024 circular?"
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-6 pr-32 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none shadow-sm"
              disabled={mutation.isPending}
            />
            <button 
              onClick={handleSubmit}
              disabled={mutation.isPending || !query.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              {mutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Ask ACRIS"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

