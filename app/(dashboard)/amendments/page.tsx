"use client";

import { 
  AppWindow, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight,
  Loader2,
  Scale,
  Plus,
  ChevronRight,
  BookOpen,
  Zap
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function AmendmentsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAmendment, setSelectedAmendment] = useState<number | null>(null);

  const amendments = [
    { 
      id: "AMD-104", 
      title: "Digital Lending Clause 4.2", 
      reason: "RBI Circular 2024/08 Compliance", 
      status: "Draft",
      risk_reduction: "High",
      impact: "Revises consent flow for multi-tenant digital credit vectors."
    },
    { 
      id: "AMD-098", 
      title: "KYC Master Direction Alignment", 
      reason: "SEBI ESG Mandate 2024", 
      status: "Review",
      risk_reduction: "Medium",
      impact: "Updates field requirements for institutional identity mapping."
    }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("AI Amendment Draft Generated", {
        description: "Reviewing for structural consistency..."
      });
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between pb-4 border-b border-amber-primary/10">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <AppWindow className="h-4 w-4 text-amber-primary fill-amber-primary/20" />
            <span className="text-[10px] font-mono font-bold text-amber-primary uppercase tracking-[0.2em]">Policy Rectification Workbench</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Amendment Workbench</h1>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-2 bg-amber-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-amber-secondary transition-all shadow-lg shadow-amber-primary/20"
        >
          {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
          AI Auto-Draft
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left: Amendment List */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-4 overflow-y-auto no-scrollbar pr-2">
           <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Amendment Queue</span>
              <Plus className="h-4 w-4 text-slate-300 hover:text-amber-primary cursor-pointer" />
           </div>

           <div className="space-y-3">
              {amendments.map((amend, i) => (
                <GlassCard 
                  key={amend.id} 
                  variant={selectedAmendment === i ? "elevated" : "standard"}
                  className={cn(
                    "p-5 cursor-pointer transition-all border-amber-primary/5",
                    selectedAmendment === i && "border-amber-primary/30"
                  )}
                  onClick={() => setSelectedAmendment(i)}
                >
                   <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{amend.id}</span>
                      <span className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded",
                        amend.status === "Review" ? "bg-blue-500/10 text-blue-600" : "bg-amber-primary/10 text-amber-primary"
                      )}>
                        {amend.status.toUpperCase()}
                      </span>
                   </div>
                   <h3 className="text-[15px] font-bold text-slate-900 mb-1">{amend.title}</h3>
                   <p className="text-[11px] text-slate-500 mb-4">{amend.reason}</p>
                   
                   <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                         <div className={cn("h-1.5 w-1.5 rounded-full", amend.risk_reduction === "High" ? "bg-green-500" : "bg-amber-primary")} />
                         <span className="text-[10px] font-bold text-slate-400 uppercase">{amend.risk_reduction} Mitigation</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                   </div>
                </GlassCard>
              ))}
           </div>
        </div>

        {/* Right: Workspace Center */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
           <GlassCard variant="standard" padding={false} className="flex-1 flex flex-col border-amber-primary/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-primary/20 to-transparent" />
              
              <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
                 {selectedAmendment !== null ? (
                   <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold text-amber-primary uppercase tracking-[0.2em]">Active Workbench</span>
                        <h2 className="text-2xl font-serif font-bold">{amendments[selectedAmendment].title}</h2>
                        <p className="text-sm text-slate-500 italic font-serif">Addressing structural conflict: {amendments[selectedAmendment].reason}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-3">
                            <div className="flex items-center gap-2">
                               <AlertTriangle className="h-4 w-4 text-red-500" />
                               <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Current Deficiency</span>
                            </div>
                            <GlassCard variant="standard" className="bg-red-500/5 border-red-500/10 p-4">
                               <p className="text-[11px] text-slate-700 leading-relaxed font-serif">
                                  "The onboarding module lacks explicit vector validation for NBFC-adjacent digital credit lines as per Master Direction 2024-C."
                               </p>
                            </GlassCard>
                         </div>
                         <div className="space-y-3">
                            <div className="flex items-center gap-2">
                               <Zap className="h-4 w-4 text-green-500" />
                               <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">AI Proposal</span>
                            </div>
                            <GlassCard variant="standard" className="bg-green-500/5 border-green-500/10 p-4">
                               <p className="text-[11px] text-slate-700 leading-relaxed font-serif">
                                  "Insert multi-stage neural validation layer between identity ingest and credit vector initiation, matching RBI Spec 4.2."
                               </p>
                            </GlassCard>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-foreground">DRAFTING_CANVAS</span>
                            <div className="flex gap-2">
                               <button className="text-[9px] font-bold text-slate-400 hover:text-slate-600 uppercase">Preview</button>
                               <button className="text-[9px] font-bold text-amber-primary hover:text-amber-secondary uppercase">Auto-Fix</button>
                            </div>
                         </div>
                         <div className="glass-elevated border border-amber-primary/10 rounded-xl p-6 min-h-[200px] bg-white/40 font-mono text-xs leading-relaxed text-slate-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-20">
                               <BookOpen className="h-8 w-8" />
                            </div>
                             <div className="animate-pulse-slow">
                                <span className="text-amber-primary font-bold">// SEC 4.2 AMENDMENT //</span><br/><br/>
                                <span className="text-slate-400">4.2.1 Identification of Entities</span><br/>
                                Any entity operating under the <span className="text-slate-900 font-bold bg-amber-primary/10 px-1">"Digital Lending Framework"</span> must undergo neural vector verification at the point of origin. 
                                <br/><br/>
                                <span className="text-slate-400">4.2.2 Compliance Mapping</span><br/>
                                Failure to match institutional identity against the <span className="text-amber-primary font-bold">ACRIS-RBI-LEDGER</span> will result in immediate suspension of credit initiation.
                             </div>
                         </div>
                      </div>
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                      <div className="h-20 w-20 glass-elevated rounded-full flex items-center justify-center mb-8">
                         <Scale className="h-10 w-10 text-amber-primary/40" />
                      </div>
                      <h3 className="text-xl font-serif font-bold mb-3">Select an Amendment to Begin</h3>
                      <p className="max-w-xs text-xs text-slate-500 italic">ACRIS Workbench allows legal counsel to iterate on policy drafts with real-time regulatory feedback.</p>
                   </div>
                 )}
              </div>

              {selectedAmendment !== null && (
                <div className="p-6 glass-topbar mt-auto border-t border-amber-primary/10 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full bg-green-500" />
                         <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Structural Consistency: 98%</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full bg-amber-primary" />
                         <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Draft Score: Optimized</span>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button className="px-6 py-2 glass-standard text-slate-500 text-[11px] font-bold uppercase tracking-widest rounded-xl">Discard</button>
                      <button 
                        onClick={() => toast.success("Policy Amendment Submitted for Review")}
                        className="px-8 py-2 bg-amber-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-amber-primary/20 flex items-center gap-2 group"
                      >
                         Submit Stakeholders <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                   </div>
                </div>
              )}
           </GlassCard>
        </div>
      </div>
    </div>
  );
}
