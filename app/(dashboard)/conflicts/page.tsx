"use client";

import { useState } from "react";
import { 
  Map, 
  Share2, 
  ArrowRight, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Loader2,
  AlertTriangle,
  Info,
  ChevronRight,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import { GlassCard } from "@/components/ui/GlassCard";

export default function ConflictExplorerPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: conflicts, isLoading } = useQuery({
    queryKey: ["conflict-map"],
    queryFn: () => apiService.getConflictMap(),
  });

  const reportMutation = useMutation({
    mutationFn: (data: any) => apiService.triggerImpactReport(data),
    onSuccess: (data) => {
      toast.success("Impact report generation initialized", {
        description: `Task ID: ${data.task_id.slice(0, 8)}`,
      });
    },
    onError: () => toast.error("Failed to trigger report system."),
  });

  const activeConflicts = conflicts || [];
  const selectedConflict = activeConflicts.find(c => c.id === selectedId) || activeConflicts[0];

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-amber-primary animate-spin" />
          <span className="font-mono text-[10px] font-bold tracking-widest text-amber-primary uppercase">Mapping Contradictions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between pb-4 border-b border-amber-primary/10">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-[0.2em]">Neural Conflict Detector Active</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Conflict Explorer</h1>
        </div>
        
        <button
          onClick={() => reportMutation.mutate(selectedConflict)}
          disabled={reportMutation.isPending || !selectedConflict}
          className="flex items-center gap-2 px-6 py-2 bg-amber-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-amber-secondary transition-all shadow-lg shadow-amber-primary/20 disabled:opacity-50"
        >
          {reportMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Share2 className="h-3.5 w-3.5" />}
          Export Intelligence
        </button>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
        
        {/* Left: Conflict List */}
        <div className="col-span-3 flex flex-col space-y-4 overflow-y-auto no-scrollbar pr-2">
          <div className="flex items-center justify-between px-1">
             <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Contradictions</span>
             <span className="text-[10px] font-mono font-bold text-red-500 bg-red-500/5 px-1.5 py-0.5 rounded">{activeConflicts.length} ACTIVE</span>
          </div>

          <div className="space-y-3">
            {activeConflicts.map((conflict) => (
              <GlassCard
                key={conflict.id}
                variant={selectedConflict?.id === conflict.id ? "conflict" : "standard"}
                padding={false}
                className={cn(
                  "p-4 cursor-pointer transition-all duration-300 border-l-[3px]",
                  selectedConflict?.id === conflict.id ? "border-red-600 scale-[1.02]" : "border-slate-300 opacity-70 grayscale hover:grayscale-0 hover:opacity-100"
                )}
                onClick={() => setSelectedId(conflict.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded lowercase",
                    conflict.severity === "High" ? "bg-red-500 text-white" : "bg-amber-primary text-white"
                  )}>
                    {conflict.severity}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">{conflict.type}</span>
                </div>
                
                <h4 className="text-[13px] font-bold text-foreground mb-2 leading-tight">
                  {conflict.source.id} <span className="text-slate-400 font-normal mx-0.5">/</span> {conflict.target.id}
                </h4>
                
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug italic italic-serif">
                  {conflict.reasoning}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Center: Visualization */}
        <div className="col-span-6 flex flex-col gap-6">
          <GlassCard variant="standard" padding={false} className="flex-1 relative overflow-hidden flex flex-col border-amber-primary/5">
             {/* Tech Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#C17B2F08_1px,transparent_1px),linear-gradient(to_bottom,#C17B2F08_1px,transparent_1px)] [background-size:32px_32px]" />
             
             <div className="relative z-10 h-full flex flex-col p-6">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-8 glass-elevated text-amber-primary flex items-center justify-center rounded-lg">
                         <Map className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Semantic Mapping Engine</span>
                        <span className="text-[9px] text-amber-primary font-bold">V-NODE: {selectedConflict?.id || "SEARCHING..."}</span>
                      </div>
                   </div>
                </div>

                {/* Conflict Visualizer */}
                <div className="flex-1 relative flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                      <marker id="arrow-amber" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#C17B2F" />
                      </marker>
                    </defs>
                    
                    {selectedConflict && (
                      <AnimatePresence mode="wait">
                        <motion.g
                          key={selectedConflict.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          {selectedConflict.nodes?.map((node: any, idx: number) => {
                            const nextNode = selectedConflict.nodes[idx + 1];
                            return (
                              <g key={node.id}>
                                {nextNode && (
                                  <motion.line 
                                    x1={node.x + 350} 
                                    y1={node.y + 100} 
                                    x2={nextNode.x + 350} 
                                    y2={nextNode.y + 100} 
                                    stroke={idx === 1 ? "#C0392B" : "#C17B2F"}
                                    strokeWidth="1.5"
                                    strokeDasharray={idx === 1 ? "4 4" : "0"}
                                    markerEnd="url(#arrow-amber)"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.2, ease: "easeInOut" }}
                                  />
                                )}
                                <foreignObject x={node.x + 300} y={node.y + 60} width="100" height="100">
                                  <motion.div 
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="flex flex-col items-center"
                                  >
                                    <div className={cn(
                                      "h-12 w-12 glass-elevated rounded-xl flex items-center justify-center shadow-lg border border-white/60",
                                      idx === 1 ? "border-red-500 shadow-red-500/10" : ""
                                    )}>
                                      <FileText className={cn("h-6 w-6", idx === 1 ? "text-red-500" : "text-amber-primary")} />
                                    </div>
                                    <span className="mt-2 text-[9px] font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-slate-200 uppercase">
                                      {node.title.slice(0, 10)}...
                                    </span>
                                  </motion.div>
                                </foreignObject>
                              </g>
                            );
                          })}
                        </motion.g>
                      </AnimatePresence>
                    )}
                  </svg>
                </div>

                {/* Reasoning Quote Area */}
                <div className="mt-auto pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-amber-primary" />
                    <span className="text-[10px] font-mono font-bold text-amber-primary uppercase tracking-[0.2em]">Neural Reasoning Core</span>
                  </div>
                  <GlassCard variant="standard" className="bg-white/40 border-amber-primary/10">
                    <p className="text-sm italic font-serif leading-relaxed text-slate-700">
                      "{selectedConflict?.reasoning}"
                    </p>
                  </GlassCard>
                </div>
             </div>
          </GlassCard>
        </div>

        {/* Right: Details & Agent Sidebar */}
        <div className="col-span-3 flex flex-col space-y-6">
          <GlassCard variant="standard" className="flex flex-col gap-6 h-full border-amber-primary/5">
            <div className="space-y-4">
               <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-primary" />
                  <span className="text-[11px] font-bold text-foreground">AGENT_STATUS_MONITOR</span>
               </div>
               
               <div className="bg-white/40 border border-white/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-mono font-bold text-slate-400">RESOLUTION_AGENT</span>
                     <span className="px-1.5 py-0.5 bg-green-500 text-white text-[9px] font-bold rounded">WAITING_FOR_USER_ACTION</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-primary w-[30%]" />
                  </div>
                  <p className="text-[10px] text-slate-500 italic">Self-correction protocols identified 4 possible mitigation paths.</p>
               </div>
            </div>

            <div className="space-y-3 flex-1">
               <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Contradictory Vectors</span>
               <div className="space-y-2">
                  <div className="p-3 bg-white/40 border border-white/80 rounded-xl space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-amber-primary">{selectedConflict?.source.id}</span>
                        <ExternalLink className="h-3 w-3 text-slate-300" />
                     </div>
                     <p className="text-[11px] text-slate-500 leading-snug line-clamp-3 italic">
                        The current directive mandates immediate digital onboarding without exception...
                     </p>
                  </div>
                  <div className="flex justify-center -my-1">
                     <div className="px-2 py-0.5 glass-elevated text-red-500 text-[9px] font-bold border-red-500/20 rounded shadow-sm">CONFLICT</div>
                  </div>
                  <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-red-500">{selectedConflict?.target.id}</span>
                        <ExternalLink className="h-3 w-3 text-slate-300" />
                     </div>
                     <p className="text-[11px] text-slate-500 leading-snug line-clamp-3 italic">
                        Previous master direction prohibits account activation without physical verify...
                     </p>
                  </div>
               </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
               <button className="w-full bg-white text-slate-900 border border-slate-200 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                  Ignore (Insufficient Risk)
               </button>
               <button 
                 onClick={() => toast.success("Drafting compliance memo for RBI submission...")}
                 className="w-full bg-amber-primary text-white py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-amber-secondary transition-all shadow-lg shadow-amber-primary/20 flex items-center justify-center gap-2 group"
               >
                  Generate Mitigation Memo
                  <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
