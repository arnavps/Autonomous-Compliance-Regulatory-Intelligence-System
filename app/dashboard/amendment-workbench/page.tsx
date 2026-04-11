"use client";

import { 
  FileEdit, 
  Save, 
  RotateCcw, 
  History, 
  GitCommit,
  CheckCircle2,
  AlertCircle,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/lib/store/workflowStore";

export default function AmendmentWorkbenchPage() {
  const { amendments: diffs, approveAmendment, revertAll } = useWorkflowStore();

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-[0.5px] border-border/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="tech-label px-2 py-0.5 bg-blue-600/10 text-blue-600">CONTRACTUAL REMEDIATION</span>
            <span className="h-[1px] w-12 bg-border/30" />
          </div>
          <h1 className="text-4xl font-serif tracking-tight text-foreground">
            Amendment Workbench
          </h1>
          <p className="text-muted-foreground font-sans text-sm mt-2 max-w-xl">
            Clause-level remediation engine. Map regulatory changes directly into institutional drafting.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => revertAll()}
            className="flex items-center gap-3 px-6 py-2.5 bg-surface-container-low border-[0.5px] border-border/30 text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-high transition-all">
             <RotateCcw className="h-4 w-4" />
             Cleanup Workbench
          </button>
          <button 
            className="flex items-center gap-3 px-8 py-3 bg-foreground text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all opacity-30 cursor-not-allowed">
             <Save className="h-4 w-4" />
             Institutional Commit
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        {/* Left: Active Drafts */}
        <div className="lg:col-span-8 flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
           {diffs.map((diff) => (
             <div key={diff.id} className="bg-surface-container-low border-[0.5px] border-border/20 p-8 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-white border-[0.5px] border-border/20 flex items-center justify-center text-primary">
                       <FileEdit className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{diff.clause}</h4>
                      <span className="font-mono text-[9px] text-muted-foreground">ID: {diff.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "tech-label px-2 py-0.5",
                      diff.status === "Approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    )}>
                      {diff.status}
                    </span>
                    {diff.status === "Proposed" && (
                      <button 
                        onClick={() => {
                          approveAmendment(diff.id);
                          toast.success("Amendment applied to Institutional Ledger.");
                        }}
                        className="px-4 py-1.5 bg-foreground text-white text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-all">
                        Approve
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <span className="tech-label text-muted-foreground">Original Text</span>
                      <div className="p-4 bg-red-50/30 border-l-2 border-red-200 text-xs text-muted-foreground font-sans line-through decoration-red-300">
                        {diff.oldText}
                      </div>
                   </div>
                   <div className="space-y-3">
                      <span className="tech-label text-primary">Proposed Amendment</span>
                      <div className="p-4 bg-emerald-50/30 border-l-2 border-emerald-400 text-xs text-foreground font-sans bg-white italic">
                        {diff.newText}
                      </div>
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t-[0.5px] border-border/10 flex items-center gap-4">
                   <AlertCircle className="h-4 w-4 text-amber-primary" />
                   <p className="text-[10px] font-mono text-muted-foreground italic">
                     REASON: {diff.reason}
                   </p>
                </div>
             </div>
           ))}
        </div>

        {/* Right: Version Control & Logs */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
           <div className="p-8 bg-surface-container-low border-[0.5px] border-border/20">
              <div className="flex items-center gap-3 mb-6">
                 <History className="h-5 w-5 text-primary" />
                 <h3 className="tech-label">Version History</h3>
              </div>
              <div className="space-y-6 relative ml-2">
                 <div className="absolute left-[-9px] top-2 bottom-2 w-[1px] bg-border/20" />
                 {[
                   { user: "Legal Counsel", event: "Approved Section 9.1", time: "2h ago" },
                   { user: "ACRIS Agent", event: "Drafted Section 4.2", time: "5h ago" },
                   { user: "System", event: "Triggered Auto-Audit", time: "1d ago" }
                 ].map((log, i) => (
                   <div key={i} className="relative flex items-center gap-4">
                      <div className="h-2 w-2 rounded-full bg-border border-2 border-background ring-4 ring-background" />
                      <div className="flex-1">
                        <p className="text-[11px] font-bold">{log.event}</p>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                           <span>{log.user}</span>
                           <span>{log.time}</span>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 bg-surface-container-low border-[0.2px] border-amber-primary/20 bg-amber-primary/[0.02] flex flex-col items-center justify-center text-center">
               <div className="h-12 w-12 bg-white flex items-center justify-center mb-4 shadow-sm border-[0.5px] border-border/10 text-amber-primary">
                 <GitCommit className="h-6 w-6" />
               </div>
               <span className="tech-label text-foreground mb-2">Pending Final Ledger Sync</span>
               <p className="text-[10px] text-muted-foreground">Ensure all clauses are vetted before institutional deployment.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
