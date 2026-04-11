"use client";

import { useState, useEffect } from "react";
import { Radar, Zap, ShieldAlert, ChevronRight, AlertCircle } from "lucide-react";
import apiClient from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/lib/store/workflowStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EarlyWarningPage() {
  const router = useRouter();
  const addConflictToWorkbench = useWorkflowStore((state) => state.addConflictToWorkbench);
  const [activeAnalysis, setActiveAnalysis] = useState<number | null>(null);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWarnings() {
      try {
        const response = await apiClient.get('/api/early-warnings');
        setWarnings(response.data.warnings || []);
      } catch (error) {
        console.error("Failed to fetch early warnings", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWarnings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-16 pb-8 border-b-[0.5px] border-border/10">
        <div>
          <div className="tech-label text-primary mb-4">Signal Intelligence</div>
          <h1 className="text-4xl font-bold font-serif italic tracking-tight text-foreground">Early Warning Radar</h1>
          <p className="text-muted-foreground font-serif text-lg mt-2 opacity-70">Predictive analysis of draft regulations and cross-jurisdictional shifts.</p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 bg-surface-container border-[0.5px] border-border/20">
          <Zap className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-foreground tracking-widest">REAL-TIME SURVEILLANCE ACTIVE</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-96 gap-6">
          <div className="h-12 w-[0.5px] bg-primary/20 animate-pulse" />
          <div className="tech-label text-muted-foreground/40 animate-pulse">Scanning Global Drafts</div>
        </div>
      ) : warnings.length === 0 ? (
        <div className="bg-surface-container-low border-[0.5px] border-border/20 p-20 text-center flex flex-col items-center">
          <Radar className="h-16 w-16 text-muted-foreground/10 mb-6" />
          <h3 className="text-2xl font-bold text-foreground mb-4">Null Detected</h3>
          <p className="text-muted-foreground font-serif italic max-w-md opacity-60 text-lg">
            Our intelligence pipeline is continually monitoring for new draft regulations. 
            At this moment, no high-risk deviations have been detected in the vector noise.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {warnings.map((warning, i) => (
            <div 
              key={warning.id || i} 
              className={cn(
                "bg-white border-[0.5px] p-8 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] transition-all flex flex-col group relative",
                warning.urgency === 'High' ? 'border-primary/40' : 'border-border/20'
              )}
            >
              {warning.urgency === 'High' && (
                <div className="absolute top-0 right-0 p-2">
                   <ShieldAlert className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div className="flex items-center justify-between mb-8">
                <span className="tech-label text-muted-foreground/40">{warning.issuing_body} • DRAFT</span>
                <span className={cn(
                  "font-mono text-[9px] font-bold px-2 py-1",
                  warning.urgency === 'High' ? "text-primary bg-primary/5" : "text-muted-foreground/40 bg-muted"
                )}>
                  {warning.urgency.toUpperCase()}
                </span>
              </div>

              <div className="h-[1px] w-full bg-border/10 mb-8" />
              
              <h4 className="text-xl font-bold mb-4 font-serif italic leading-snug group-hover:text-primary transition-colors cursor-default">
                {warning.title}
              </h4>
              <p className="text-sm text-muted-foreground font-serif leading-relaxed mb-8 opacity-80">
                {warning.proposed_change}
              </p>

              <div className="mt-auto space-y-6">
                 <div className="flex justify-between items-end border-b-[0.5px] border-border/10 pb-4">
                    <div className="flex flex-col">
                       <span className="tech-label text-muted-foreground/30 mb-1">Probability</span>
                       <span className="font-mono text-xs font-bold text-foreground">{warning.probability}</span>
                    </div>
                    <button
                      onClick={() => setActiveAnalysis(activeAnalysis === i ? null : i)}
                      className="group/btn flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-tighter text-primary hover:tracking-normal transition-all"
                    >
                      {activeAnalysis === i ? "CLOSE" : "EXPAND INTELLIGENCE"}
                      <ChevronRight className={cn("h-3 w-3 transition-transform", activeAnalysis === i ? "rotate-90" : "")} />
                    </button>
                 </div>

                 {activeAnalysis === i && (
                   <div className="p-6 bg-surface-container-low border-[0.5px] border-border/20 animate-in fade-in slide-in-from-top-4 duration-500">
                     <div className="tech-label text-primary/60 mb-4">Neural Impact Analysis</div>
                     <div className="space-y-4">
                        <div className="flex flex-col">
                           <span className="text-[9px] uppercase text-muted-foreground/40 font-mono mb-1">Affected Entities</span>
                           <span className="text-xs font-serif italic text-foreground">{warning.affected_entities}</span>
                        </div>
                         <div className="flex flex-col">
                           <span className="text-[9px] uppercase text-muted-foreground/40 font-mono mb-1">Strategy Recommendation</span>
                           <span className="text-xs font-serif italic text-foreground">Proactive adjustment of compliance vectors recommended.</span>
                        </div>
                        
                        <div className="pt-4 flex gap-4">
                           <a 
                             href={warning.url} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="flex-1 flex items-center justify-center border-[0.5px] border-border/20 py-3 text-[10px] font-mono font-bold text-muted-foreground hover:bg-white hover:text-foreground transition-all"
                           >
                             OPEN SOURCE
                           </a>
                           {warning.urgency === 'High' && (
                             <button 
                               onClick={() => {
                                 // Simulate creating a conflict from a warning
                                 addConflictToWorkbench({
                                   id: `WARN-${warning.id || i}`,
                                   source: { id: warning.issuing_body, title: warning.title },
                                   target: { id: "INTERNAL", title: "Institutional Lending Policy" },
                                   severity: 'High',
                                   type: "Predictive Deviation",
                                   reasoning: warning.proposed_change,
                                   status: 'Unresolved'
                                 });
                                 toast.success("Signal promoted to active conflict ledger.");
                                 router.push("/dashboard/amendment-workbench");
                               }}
                               className="flex-1 flex items-center justify-center bg-primary py-3 text-[10px] font-mono font-bold text-white hover:bg-amber-900 transition-all gap-2"
                             >
                               <AlertCircle size={12} />
                               MITIGATE RISK
                             </button>
                           )}
                        </div>
                     </div>
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
