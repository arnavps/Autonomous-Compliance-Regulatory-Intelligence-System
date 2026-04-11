"use client";

import { 
  FileEdit, 
  Save, 
  RotateCcw, 
  History, 
  GitCommit,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/lib/store/workflowStore";
import { toast } from "sonner";

export default function AmendmentWorkbenchPage() {
  const { amendments: diffs, approveAmendment, revertAll } = useWorkflowStore();

  return (
    <div className="h-full flex flex-col space-y-10 p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b-[0.5px] border-border/20">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span className="tech-label px-3 py-1 bg-amber-primary/5 text-amber-primary border border-amber-primary/10">Neural Remediation</span>
            <span className="h-[0.5px] w-16 bg-border/20" />
          </div>
          <h1 className="text-5xl font-extrabold font-serif italic tracking-tight text-foreground">
            Amendment <span className="text-amber-primary">Workbench</span>
          </h1>
          <p className="text-muted-foreground font-serif text-lg mt-4 max-w-2xl leading-relaxed opacity-70">
            Clause-level remediation engine. Map regulatory collisions directly into institutional drafting with precision.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => {
              revertAll();
              toast.info("Workbench cleared. Institutional state preserved.");
            }}
            className="flex items-center gap-3 px-8 py-3 bg-surface-container-low border-[0.5px] border-border/20 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:border-amber-primary/30 transition-all shadow-sm">
             <RotateCcw className="h-4 w-4 text-amber-primary" />
             Reset Workbench
          </button>
          <button 
            disabled={diffs.every(d => d.status === 'Approved') || diffs.length === 0}
            className="flex items-center gap-3 px-10 py-4 bg-foreground text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-amber-primary transition-all shadow-2xl disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed">
             <Save className="h-4 w-4" />
             Institutional Commit
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 min-h-0">
        {/* Left: Active Drafts */}
        <div className="lg:col-span-8 flex flex-col space-y-10 overflow-y-auto pr-4 custom-scrollbar">
           {diffs.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 border-[0.5px] border-dashed border-border/20 bg-surface-container-low/30">
               <Zap className="h-8 w-8 text-muted-foreground/20 mb-4" />
               <p className="text-muted-foreground font-serif italic text-sm">No active remediation tasks. Transfer a conflict from the Explorer to begin.</p>
             </div>
           ) : (
             <AnimatePresence>
               {diffs.map((diff, index) => (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.1 }}
                   key={diff.id} 
                   className="bg-white border-[0.5px] border-border/20 p-10 relative overflow-hidden shadow-sm hover:shadow-xl transition-all group"
                 >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <FileEdit className="h-24 w-24" />
                    </div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 bg-surface-container-low border-[0.5px] border-border/20 flex items-center justify-center text-amber-primary shadow-inner group-hover:bg-white transition-all">
                           <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold font-serif italic">{diff.clause}</h4>
                          <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest font-bold">Remediation ID: {diff.id}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={cn(
                          "tech-label px-4 py-1.5 border-[0.5px]",
                          diff.status === "Approved" 
                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600" 
                            : "bg-amber-primary/5 border-amber-primary/20 text-amber-primary"
                        )}>
                          {diff.status}
                        </span>
                        {diff.status === "Proposed" && (
                          <button 
                            onClick={() => {
                              approveAmendment(diff.id);
                              toast.success("Institutional draft updated.");
                            }}
                            className="px-6 py-2 bg-foreground text-white text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-amber-primary transition-all shadow-lg">
                            Apply Fix
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                       <div className="space-y-4">
                          <span className="tech-label text-muted-foreground/40 text-[9px]">Original Mandate</span>
                          <div className="p-6 bg-surface-container-low border-l-[0.5px] border-red-400/30 text-[13px] text-muted-foreground font-serif leading-relaxed opacity-60 line-through">
                            {diff.oldText}
                          </div>
                       </div>
                       <div className="space-y-4">
                          <span className="tech-label text-amber-primary/60 text-[9px]">Neural Remediation Alternative</span>
                          <div className="p-6 bg-white border-[0.5px] border-amber-primary/10 border-l-[3px] border-l-amber-primary text-[13px] text-foreground font-serif italic leading-relaxed shadow-sm">
                            {diff.newText}
                          </div>
                       </div>
                    </div>

                    <div className="mt-10 pt-8 border-t-[0.5px] border-border/10 flex items-center gap-5 relative z-10">
                       <ShieldCheck className="h-5 w-5 text-amber-primary/40" />
                       <p className="text-[11px] font-mono text-muted-foreground italic leading-relaxed">
                         <span className="font-bold text-foreground/40 tracking-widest">RATIONALE:</span> {diff.reason}
                       </p>
                    </div>
                 </motion.div>
               ))}
             </AnimatePresence>
           )}
        </div>

        {/* Right: Version Control & Logs */}
        <div className="lg:col-span-4 flex flex-col space-y-10">
           <div className="p-10 bg-white border-[0.5px] border-border/20 shadow-sm relative overflow-hidden">
              <div className="absolute -top-4 -right-4 h-24 w-24 bg-amber-primary/5 rounded-full blur-3xl" />
              <div className="flex items-center gap-4 mb-10 border-b-[0.5px] border-border/10 pb-6">
                 <History className="h-5 w-5 text-amber-primary" />
                 <h3 className="tech-label text-foreground/80">Institutional Lineage</h3>
              </div>
              <div className="space-y-10 relative ml-3">
                 <div className="absolute left-[-11px] top-2 bottom-2 w-[1.5px] bg-gradient-to-b from-amber-primary/40 via-border/20 to-transparent" />
                 {[
                   { user: "Legal Counsel", event: "Vetted Section 9.1", time: "2h ago", status: 'SUCCESS' },
                   { user: "Neural Agent", event: "Generated Draft 4.2", time: "5h ago", status: 'NEUTRAL' },
                   { user: "System", event: "Audit Integrity Check", time: "1d ago", status: 'NEUTRAL' }
                 ].map((log, i) => (
                   <div key={i} className="relative flex items-start gap-6 group">
                      <div className={cn(
                        "h-2 w-2 rounded-full mt-1.5 ring-4 ring-white relative z-10 transition-all group-hover:scale-125",
                        log.status === 'SUCCESS' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-border/60"
                      )} />
                      <div className="flex-1">
                        <p className="text-[12px] font-bold font-serif italic text-foreground leading-none">{log.event}</p>
                        <div className="flex items-center justify-between text-[9px] text-muted-foreground/60 font-mono mt-2 font-bold uppercase tracking-widest">
                           <span>{log.user}</span>
                           <span>{log.time}</span>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-10 bg-[#0f172a] text-white flex flex-col items-center justify-center text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-amber-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="h-16 w-16 bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl group-hover:bg-amber-primary/20 group-hover:border-amber-primary/40 transition-all">
                 <GitCommit className="h-8 w-8 text-white/40 group-hover:text-amber-primary" />
               </div>
               <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-amber-primary mb-4">Final Ledger Integration</span>
               <p className="text-[11px] text-white/40 font-serif italic leading-relaxed">
                 All amendments must be vetted by certified Counsel before permanent institutional sync.
               </p>
           </div>
        </div>
      </div>
    </div>
  );
}
