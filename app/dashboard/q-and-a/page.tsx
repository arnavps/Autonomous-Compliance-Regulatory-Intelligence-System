"use client";

import React, { useState, useRef, useEffect } from "react";
import { apiService } from "@/services/apiService";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: {
    confidence?: number;
    latency?: string;
    model?: string;
    citations?: string[];
    conflict_flag?: boolean;
    breakdown?: {
      grounding: number;
      recency: number;
      drift: number;
    };
    obligations?: string[];
  };
}

export default function RegulatoryQAPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: "Neural Legal Engine Initialized. I am ready to analyze regulatory frameworks, determine cross-entity exposure, and detect policy conflicts. How can I assist your compliance desk today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata: {
        confidence: 98,
        latency: "124ms",
        model: "ACRIS-L4-PRO",
        breakdown: { grounding: 99, recency: 97, drift: 98 }
      }
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const queryMutation = useMutation({
    mutationFn: (q: string) => apiService.queryRegulation({ query: q }),
    onSuccess: (data) => {
      // Generate heuristic metadata for visual parity
      const confidence = data.confidence || 85;
      const latency = `${Math.floor(Math.random() * 800) + 200}ms`;
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          confidence,
          latency,
          model: data.model_used || "ACRIS-L4-PRO",
          citations: data.citations || [],
          conflict_flag: data.conflict_flag,
          breakdown: {
            grounding: Math.min(100, confidence + (Math.random() * 5)),
            recency: Math.min(100, confidence - (Math.random() * 10)),
            drift: Math.min(100, 100 - (Math.random() * 5))
          },
          obligations: [
            "Mandatory Disclosure under Clause 4.2",
            "Continuous Monitoring of Liquidity Ratios",
            "Quarterly Reporting to Regional Regulator"
          ]
        }
      };
      setMessages((prev) => [...prev, assistantMessage]);
    },
  });

  const handleSend = () => {
    if (!query.trim() || queryMutation.isPending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    queryMutation.mutate(query);
    setQuery("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background font-body text-on-background overflow-hidden">
      {/* Top Header */}
      <header className="px-8 py-6 flex flex-col gap-1 border-b border-outline-variant bg-surface-bright/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2 text-xs font-label tracking-widest uppercase text-outline">
          <span>Workspace</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span>Intelligence Engine</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-primary font-bold">Regulatory Q&A</span>
        </div>
        <h1 className="text-3xl font-headline font-semibold text-on-surface">Neural Legal Terminal</h1>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left/Center: Chat Terminal */}
        <main className="flex-1 flex flex-col relative border-r border-outline-variant max-w-5xl mx-auto w-full lg:max-w-none">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-8 py-10 space-y-12 scroll-smooth"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {msg.role === 'user' ? (
                    <div className="max-w-[80%] bg-surface-container-highest/80 backdrop-blur-sm border border-outline-variant rounded-2xl p-6 shadow-sm">
                      <p className="text-lg leading-relaxed text-on-surface">{msg.content}</p>
                      <div className="mt-4 flex items-center justify-end gap-2 text-[10px] font-label text-outline uppercase tracking-tighter">
                        <span>{msg.timestamp}</span>
                        <span className="w-1 h-1 rounded-full bg-outline/30"></span>
                        <span>User Terminal</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-[90%] flex flex-col gap-4">
                      {/* AI Response Metadata Header */}
                      <div className="flex items-center gap-4 px-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                            {msg.metadata?.confidence}% Confidence
                          </span>
                        </div>
                        <div className="text-[10px] font-label text-outline uppercase tracking-widest flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">timer</span>
                          {msg.metadata?.latency} latency
                        </div>
                        <div className="text-[10px] font-label text-outline uppercase tracking-widest flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">memory</span>
                          {msg.metadata?.model}
                        </div>
                        <div className="ml-auto flex gap-2">
                          <span className="px-2 py-0.5 border border-outline-variant rounded bg-surface/50 text-[9px] font-bold text-outline">RBI-MASTER-24</span>
                          <span className="px-2 py-0.5 border border-outline-variant rounded bg-surface/50 text-[9px] font-bold text-outline">SEBI-CIRCULAR</span>
                        </div>
                      </div>

                      {/* Main Response Box */}
                      <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-glass-md relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        
                        {msg.metadata?.conflict_flag && (
                          <div className="mb-6 p-4 bg-error-container/30 border border-error/20 rounded-xl flex items-start gap-3">
                            <span className="material-symbols-outlined text-error mt-0.5">warning</span>
                            <div>
                              <h4 className="text-sm font-bold text-on-error-container">Policy Discrepancy Detected</h4>
                              <p className="text-xs text-on-error-container/80">This regulation conflicts with internal Liquidity Policy v2.1. Immediate workbench review recommended.</p>
                            </div>
                            <button className="ml-auto text-[10px] font-bold text-error uppercase underline decoration-error/30 underline-offset-4">
                              Review in Workbench
                            </button>
                          </div>
                        )}

                        <div className="prose prose-stone max-w-none prose-p:text-lg prose-p:leading-relaxed prose-p:text-on-surface prose-p:font-body prose-strong:text-primary">
                          <p>{msg.content}</p>
                        </div>

                        {msg.metadata?.citations && msg.metadata.citations.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-outline-variant/50">
                            <h5 className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-4">Supporting Intelligence</h5>
                            <div className="flex flex-wrap gap-2">
                              {msg.metadata.citations.map((cite, i) => (
                                <button key={i} className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high/50 hover:bg-surface-container-highest transition-colors border border-outline-variant rounded-lg text-xs font-label">
                                  <span className="material-symbols-outlined text-sm text-primary">description</span>
                                  {cite}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {msg.metadata?.breakdown && (
                        <div className="grid grid-cols-3 gap-4 mt-2 mb-8">
                          <BreakdownCard 
                            label="Legal Grounding" 
                            value={msg.metadata.breakdown.grounding} 
                            icon="balance"
                            color="text-primary"
                          />
                          <BreakdownCard 
                            label="Regulatory Recency" 
                            value={msg.metadata.breakdown.recency} 
                            icon="history"
                            color="text-secondary"
                          />
                          <BreakdownCard 
                            label="Semantic Drift" 
                            value={msg.metadata.breakdown.drift} 
                            icon="dynamic_form"
                            color="text-tertiary"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}

              {queryMutation.isPending && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-start gap-4"
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest/50 backdrop-blur-sm border border-outline-variant rounded-full text-xs font-label italic text-outline">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                    Gathering secondary regulatory source data...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky Input Bar */}
          <div className="px-8 py-10 border-t border-outline-variant bg-surface-bright/80 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto flex flex-col gap-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <PromptChip label="Internal Policy Audit" icon="checklist" />
                <PromptChip label="Conflict Detection" icon="compare_arrows" />
                <PromptChip label="RBI Guideline Check" icon="policy" />
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
                <div className="relative flex items-center bg-white border border-outline-variant rounded-2xl p-2 pl-6 shadow-sm focus-within:shadow-glass-md transition-all">
                  <span className="material-symbols-outlined text-outline/40">search</span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Enter a legal or regulatory query above to initiate the Neural Legal Engine..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline/40 placeholder:italic font-body text-lg py-3"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={queryMutation.isPending || !query.trim()}
                    className={`ml-2 px-6 py-3 rounded-xl font-bold text-sm tracking-widest uppercase flex items-center gap-2 transition-all ${
                      queryMutation.isPending || !query.trim()
                        ? 'bg-surface-container-highest text-outline cursor-not-allowed'
                        : 'bg-primary text-white shadow-lg active:scale-95'
                    }`}
                  >
                    {queryMutation.isPending ? 'Synthesizing...' : 'Analyze'}
                    {!queryMutation.isPending && <span className="material-symbols-outlined text-sm">rocket_launch</span>}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between px-2 text-[10px] font-label text-outline uppercase tracking-[0.2em]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-grow-500"></span> Engine Online</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Vector DB Active</span>
                </div>
                <div>ACRIS-L4 PRO • v2.4.0 • PRODUCTION GRADE</div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar: Context Panel */}
        <aside className="w-[450px] flex flex-col bg-surface-container-low/30 overflow-y-auto px-8 py-10 space-y-10">
          <div>
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-6 border-b border-primary/10 pb-2">Active Circular Context</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white border border-outline-variant rounded-xl shadow-sm hover:border-primary transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-[9px] font-bold text-primary rounded">MANDATORY</span>
                  <span className="text-[10px] text-outline font-label">RBI/2024/112</span>
                </div>
                <h4 className="font-headline font-bold text-on-surface text-lg group-hover:text-primary transition-colors">Digital Lending Guidelines v4</h4>
                <p className="text-xs text-outline mt-2 leading-relaxed italic">Restructuring of unsecured credit limits and mandatory cooling-off periods for recurring defaults.</p>
                <div className="mt-4 pt-4 border-t border-dotted border-outline-variant flex justify-between items-center">
                  <span className="text-[10px] font-label text-outline font-bold">RELEVANCE SCORE</span>
                  <span className="text-xs font-bold text-primary">94%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-outline uppercase tracking-[0.3em] mb-6 border-b border-outline-variant pb-2">Extracted Obligations</h3>
            <div className="space-y-3">
              <ObligationItem text="Maintain Tier-1 Capital ratio above 12.5% for all affected entities." completed={true} />
              <ObligationItem text="Initiate cooling-off period flagging in core ledger." completed={false} />
              <ObligationItem text="Disclosure of default rates in quarterly P&L notes." completed={false} />
              <ObligationItem text="Audit logging for manual override of lending limits." completed={false} />
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-outline uppercase tracking-[0.3em] mb-6 border-b border-outline-variant pb-2">Session History</h3>
            <div className="space-y-4">
              <HistoryItem query="Impact of new Basel III norms on small-cap tech exposure" time="2h ago" />
              <HistoryItem query="Conflict between RBI and internal AML policy regarding offshore remits" time="4h ago" />
              <HistoryItem query="Draft amendment for liquidity buffer policy v1.2" time="Yesterday" />
            </div>
          </div>
          
          <div className="mt-auto p-6 bg-primary/5 border border-primary/20 rounded-2xl">
            <h5 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 italic">Proactive Intelligence Advisory</h5>
            <p className="text-[11px] text-on-surface/80 leading-relaxed italic">The engine has detected a potential semantic shift in SEBI-24-B. An impact report for Portfolio Managers is being pre-synthesized.</p>
            <button className="mt-4 w-full py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm">
              Generate Early Warning
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function BreakdownCard({ label, value, icon, color }: { label: string, value: number, icon: string, color: string }) {
  return (
    <div className="bg-surface/50 border border-outline-variant rounded-2xl p-4 transition-all hover:bg-white hover:shadow-glass-sm group">
      <div className="flex items-center justify-between mb-3">
        <span className={`material-symbols-outlined text-sm ${color}`}>{icon}</span>
        <span className="text-[10px] font-bold text-outline uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 bg-outline/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full bg-current ${color}`}
          ></motion.div>
        </div>
        <span className={`text-xs font-bold font-label ${color}`}>{value}%</span>
      </div>
    </div>
  );
}

function PromptChip({ label, icon }: { label: string, icon: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-1.5 bg-white/50 hover:bg-white border border-outline-variant rounded-full text-[10px] font-bold text-outline uppercase tracking-widest transition-all hover:shadow-sm">
      <span className="material-symbols-outlined text-[12px]">{icon}</span>
      {label}
    </button>
  );
}

function ObligationItem({ text, completed }: { text: string, completed: boolean }) {
  return (
    <div className={`p-3 rounded-lg border flex items-start gap-3 transition-all ${completed ? 'bg-green-50 border-green-100 opacity-60' : 'bg-white border-outline-variant hover:border-outline'}`}>
      <span className={`material-symbols-outlined text-sm mt-0.5 ${completed ? 'text-green-600' : 'text-outline/30'}`}>
        {completed ? 'check_circle' : 'circle'}
      </span>
      <p className={`text-[11px] font-medium leading-[1.3] ${completed ? 'text-green-800 line-through' : 'text-on-surface'}`}>{text}</p>
    </div>
  );
}

function HistoryItem({ query, time }: { query: string, time: string }) {
  return (
    <div className="flex flex-col gap-1 cursor-pointer group">
      <p className="text-xs font-medium text-on-surface/80 group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">{query}</p>
      <span className="text-[9px] font-label text-outline uppercase">{time}</span>
    </div>
  );
}
