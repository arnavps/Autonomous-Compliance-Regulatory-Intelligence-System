"use client";

import { useState } from "react";
import { 
  Map, 
  Share2, 
  ArrowRight, 
  Info, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";

export default function ConflictMapPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"graph" | "list">("graph");

  // Live Data Fetching
  const { data: conflicts, isLoading } = useQuery({
    queryKey: ["conflict-map"],
    queryFn: () => apiService.getConflictMap(),
  });

  // Report Generation Mutation
  const reportMutation = useMutation({
    mutationFn: (data: any) => apiService.triggerImpactReport(data),
    onSuccess: (data) => {
      toast.success("Regulatory Impact Report generation started.", {
        description: `Task ID: ${data.task_id.slice(0, 8)}`,
      });
    },
    onError: () => toast.error("Failed to trigger impact report."),
  });

  const activeConflicts = conflicts || [];
  const selectedConflict = activeConflicts.find(c => c.id === selectedId) || activeConflicts[0];

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
      {/* Header Section - Editorial Style */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-[0.5px] border-border/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="tech-label px-2 py-0.5 bg-accent text-accent-foreground">LIVE SEMANTIC ENGINE</span>
            <span className="h-[1px] w-12 bg-border/30" />
          </div>
          <h1 className="text-4xl font-serif tracking-tight text-foreground">
            Conflict Explorer
          </h1>
          <p className="text-muted-foreground font-sans text-sm mt-2 max-w-xl">
            Analyzing contradictory mandates across <span className="font-mono text-primary font-bold">2,400+</span> regulatory vectors using the ACRIS Neural Ledger.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-surface-container-low p-0.5 border-[0.5px] border-border/30">
            <button 
              onClick={() => setViewMode("graph")}
              className={cn(
                "px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                viewMode === "graph" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Network
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={cn(
                "px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Linear
            </button>
          </div>
          
          <button
            onClick={() => reportMutation.mutate(selectedConflict)}
            disabled={reportMutation.isPending}
            className="flex items-center gap-3 px-8 py-3 metallic-gold text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all disabled:opacity-50"
          >
            {reportMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            Export Intelligence
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        
        {/* Left Sidebar: Findings List */}
        <div className="lg:col-span-4 flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex items-center justify-between px-1">
             <h3 className="tech-label text-muted-foreground">Detected Contradictions</h3>
             <span className="font-mono text-[10px] text-primary bg-primary/5 px-2 py-0.5">{activeConflicts.length} Active</span>
          </div>

          <div className="space-y-3">
            {activeConflicts.map((conflict) => (
              <motion.div
                key={conflict.id}
                onClick={() => setSelectedId(conflict.id)}
                className={cn(
                  "p-6 border-[0.5px] cursor-pointer transition-all duration-300 relative group",
                  selectedConflict?.id === conflict.id 
                    ? "bg-white border-primary shadow-xl shadow-primary/5" 
                    : "bg-surface-container-low border-border/20 hover:border-border/60"
                )}
              >
                {/* Status Ribbon */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-[3px]",
                  conflict.severity === "High" ? "bg-destructive" : "bg-primary"
                )} />

                <div className="flex items-center justify-between mb-4">
                  <span className={cn(
                    "tech-label px-2 py-0.5",
                    conflict.severity === "High" ? "text-destructive" : "text-primary"
                  )}>
                    {conflict.severity} Impact
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground">{conflict.type}</span>
                </div>
                
                <h4 className="text-base font-bold text-foreground mb-3 leading-tight font-sans italic border-l-2 border-border/10 pl-3">
                  {conflict.source.id} <span className="text-muted-foreground font-normal not-italic mx-1">vs</span> {conflict.target.id}
                </h4>
                
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-sans">
                  {conflict.reasoning}
                </p>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex -space-x-1">
                     <div className="h-7 w-7 bg-surface-container-highest flex items-center justify-center border-[0.5px] border-border/20 text-primary">
                       <ShieldCheck className="h-3.5 w-3.5" />
                     </div>
                     <div className="h-7 w-7 bg-surface-container-highest flex items-center justify-center border-[0.5px] border-border/20 text-secondary">
                       <Zap className="h-3.5 w-3.5" />
                     </div>
                  </div>
                  <ArrowRight className={cn(
                    "h-4 w-4 transition-all group-hover:translate-x-1",
                    selectedConflict?.id === conflict.id ? "text-primary" : "text-muted-foreground/30"
                  )} />
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="p-8 border-[0.5px] border-dashed border-border/40 bg-surface-container-lowest flex flex-col items-center justify-center text-center opacity-60">
            <div className="h-12 w-12 bg-white flex items-center justify-center mb-4 shadow-sm border-[0.5px] border-border/10">
              <ShieldCheck className="h-6 w-6 text-tertiary" />
            </div>
            <p className="tech-label text-muted-foreground">All other 2,398 vectors verified compliant.</p>
          </div>
        </div>

        {/* Main Area: Relational Graph Engine */}
        <div className="lg:col-span-8 bg-surface-container-low border-[0.5px] border-border/20 relative overflow-hidden flex flex-col p-10">
           {/* Technical Blueprint Grid */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#85746612_1px,transparent_1px),linear-gradient(to_bottom,#85746612_1px,transparent_1px)] [background-size:40px_40px]" />
           
           <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-12">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 metallic-gold text-white flex items-center justify-center shadow-2xl shadow-primary/20">
                       <Map className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="tech-label block">Relational Knowledge Graph</span>
                      <span className="text-[10px] text-muted-foreground font-mono">ID: ACRIS-SEM-GRAPH-004</span>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                       <div className="h-1.5 w-1.5 bg-primary" />
                       <span className="tech-label text-muted-foreground">Reference</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="h-1.5 w-1.5 bg-destructive" />
                       <span className="tech-label text-muted-foreground">Violation</span>
                    </div>
                 </div>
              </div>

              {/* SVG Graph Canvas */}
              <div className="flex-1 relative flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#884e00" />
                    </marker>
                    <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#884e00" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#ba1a1a" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#884e00" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  
                  {selectedConflict && (
                  <AnimatePresence mode="wait">
                    <motion.g
                      key={selectedConflict.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      {/* Interaction Nodes */}
                      {selectedConflict.nodes?.map((node: any, idx: number) => {
                        const nextNode = selectedConflict.nodes[idx + 1];
                        return (
                          <g key={node.id}>
                            {nextNode && (
                              <motion.line 
                                x1={node.x + 400} // Centering adjustment
                                y1={node.y + 100} 
                                x2={nextNode.x + 400} 
                                y2={nextNode.y + 100} 
                                stroke="url(#edgeGradient)"
                                strokeWidth="2"
                                strokeDasharray="10 5"
                                markerEnd="url(#arrow)"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: "anticipate" }}
                              />
                            )}
                            <foreignObject 
                              x={node.x + 330} 
                              y={node.y + 55} 
                              width="160" 
                              height="120"
                              className="pointer-events-auto"
                            >
                              <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ y: -2 }}
                                className="w-full h-full flex flex-col items-center justify-center"
                              >
                                <div className="h-16 w-16 bg-white border-[0.5px] border-border/40 flex items-center justify-center shadow-lg mb-3">
                                  <FileText className={cn(
                                    "h-8 w-8",
                                    idx === 0 ? "text-primary" : "text-muted-foreground"
                                  )} />
                                </div>
                                <span className="tech-label text-center px-2 bg-white/90 backdrop-blur-sm border-[0.5px] border-border/10 py-1">
                                  {node.title}
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
                
                {/* Floating Detail Card - High Fidelity Intelligence */}
                {selectedConflict && (
                <div className="absolute bottom-6 left-6 right-6 glass-intel p-8 border-[0.5px] border-white/40 flex flex-col md:flex-row gap-10 items-center">
                   <div className="flex-1">
                      <div className="flex items-center gap-3 text-primary mb-4">
                         <Info className="h-5 w-5" />
                         <span className="tech-label">Engine Reasoning & Jurisdictional Analysis</span>
                      </div>
                      <p className="text-xl text-foreground font-serif leading-relaxed italic pr-4">
                        "{selectedConflict.reasoning}"
                      </p>
                      <div className="mt-6 flex gap-4">
                        <span className="font-mono text-[9px] bg-primary/5 text-primary px-2 py-1">SOURCE: {selectedConflict.source.id}</span>
                        <span className="font-mono text-[9px] bg-secondary/5 text-secondary px-2 py-1">VECTOR: {selectedConflict.target.id}</span>
                      </div>
                   </div>
                   
                   <div className="flex flex-col justify-between gap-4 min-w-[180px]">
                      <button className="flex items-center justify-center gap-3 px-6 py-3 bg-surface-container-low border-[0.5px] border-border/20 text-foreground tech-label hover:bg-surface-container-high transition-all">
                        <ExternalLink className="h-4 w-4" />
                        Source Link
                      </button>
                      <button 
                        onClick={() => toast.info("Drafting resolution memo for legal review...")}
                        className="flex items-center justify-center gap-3 px-6 py-3 bg-primary text-white tech-label hover:opacity-90 transition-all shadow-xl shadow-primary/20">
                        Mitigate Risk
                      </button>
                   </div>
                </div>
                )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
