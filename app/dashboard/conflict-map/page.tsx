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
  Loader2,
  X,
  Maximize2,
  Minimize2,
  Search,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import { useAuth } from "@/lib/auth-context";
import { useWorkflowStore } from "@/lib/store/workflowStore";
import { useRouter } from "next/navigation";

export default function ConflictMapPage() {
  const router = useRouter();
  const { role } = useAuth();
  const addConflictToWorkbench = useWorkflowStore((state) => state.addConflictToWorkbench);
  const isReadOnly = role !== "COMPLIANCE";
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"graph" | "list">("graph");

  // Live Data Fetching
  const { data: conflictsRes, isLoading } = useQuery({
    queryKey: ["conflict-map"],
    queryFn: () => apiService.getConflictMap(),
  });

  // Report Generation Mutation
  const reportMutation = useMutation({
    mutationFn: (data: any) => apiService.triggerImpactReport(data),
    onSuccess: (data) => {
      toast.success("Regulatory Impact Report generation started.", {
        description: `Task ID: ${data.task_id?.slice(0, 8)}`,
      });
    },
    onError: () => toast.error("Failed to trigger impact report."),
  });

  const conflicts = Array.isArray(conflictsRes) ? conflictsRes : (conflictsRes as any)?.conflicts || [];
  const selectedConflict = conflicts.find((c: any) => c.id === selectedId) || (conflicts.length > 0 ? conflicts[0] : null);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="font-label text-xs uppercase tracking-widest text-muted-foreground">Initializing Neural Semantic Engine...</p>
      </div>
    );
  }

  const handleSelectConflict = (id: string) => {
    setSelectedId(id);
    setIsDrawerOpen(true);
  };

  return (
    <div className="fixed inset-0 top-16 left-64 bg-background flex flex-col overflow-hidden animate-in fade-in duration-700">
      {/* View Header & Filters */}
      <header className="p-6 bg-surface flex flex-col gap-4 border-b border-outline-variant/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">Conflict Explorer</h1>
            <span className="bg-primary-fixed text-primary px-3 py-1 font-label text-[10px] font-bold tracking-widest uppercase">LIVE SEMANTIC ENGINE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-surface-container rounded-none p-1 border border-outline-variant/20">
              <button 
                onClick={() => setViewMode("graph")}
                className={cn(
                  "px-4 py-1.5 font-label text-[11px] font-bold uppercase tracking-tight transition-all",
                  viewMode === "graph" ? "bg-surface text-primary" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                Network
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={cn(
                  "px-4 py-1.5 font-label text-[11px] font-bold uppercase tracking-tight transition-all",
                  viewMode === "list" ? "bg-surface text-primary" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                List
              </button>
            </div>
            {!isReadOnly && (
              <button 
                onClick={() => reportMutation.mutate(selectedConflict)}
                disabled={reportMutation.isPending}
                className="flex items-center gap-2 border border-primary text-primary px-5 py-2 font-label text-[11px] font-bold uppercase tracking-widest hover:bg-primary-fixed transition-all disabled:opacity-50"
              >
                {reportMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                Export Intelligence
              </button>
            )}
          </div>
        </div>
        
        {/* Filter Chips */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <span className="font-label text-[11px] font-bold uppercase text-outline mr-2 tracking-tighter">Filter by:</span>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant/30 text-on-surface-variant font-label text-[10px] font-bold uppercase hover:bg-surface-container-low transition-colors">
            Topic: KYC <ChevronDown className="h-3 w-3" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant/30 text-on-surface-variant font-label text-[10px] font-bold uppercase hover:bg-surface-container-low transition-colors">
            Regulator: All <ChevronDown className="h-3 w-3" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant/30 text-error font-label text-[10px] font-bold uppercase hover:bg-error/5 transition-colors">
            Severity: High <X className="h-3 w-3" />
          </button>
          <div className="h-4 w-[1px] bg-outline-variant/30 mx-1"></div>
          <button className="text-primary font-label text-[10px] font-bold uppercase hover:underline">Clear All</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Panel: Detected Contradictions (35%) */}
        <section className="w-[35%] flex flex-col bg-surface-container-low border-r border-outline-variant/10">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-end">
            <div>
              <p className="font-label text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Status Report</p>
              <h2 className="font-headline text-xl font-bold text-on-surface">{conflicts.length} Detected Contradictions</h2>
            </div>
            <span className="font-label text-[10px] font-bold text-on-surface-variant">SORT BY: RECENT</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-20">
            {conflicts.map((conflict: any) => (
              <motion.div
                key={conflict.id}
                onClick={() => handleSelectConflict(conflict.id)}
                whileHover={{ x: 4 }}
                className={cn(
                  "group relative bg-surface-container-lowest p-5 border-l-2 transition-all cursor-pointer",
                  conflict.severity === "High" ? "border-error" : "border-primary-container",
                  selectedId === conflict.id ? "ring-1 ring-primary-fixed-dim shadow-lg" : "hover:shadow-md"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={cn(
                    "px-2 py-0.5 font-label text-[9px] font-bold uppercase",
                    conflict.severity === "High" ? "bg-error/10 text-error" : "bg-primary-container/10 text-primary-container"
                  )}>
                    {conflict.severity} Severity
                  </span>
                  <span className="font-label text-[11px] font-mono text-outline uppercase tracking-tight">#{conflict.id?.slice(-8)}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-secondary-container/20 text-on-secondary-container px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider">
                    {conflict.source?.id || "N/A"}
                  </span>
                  <span className="text-on-surface-variant font-black">≠</span>
                  <span className="bg-tertiary-container/10 text-tertiary-container px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider">
                    {conflict.target?.id || "N/A"}
                  </span>
                </div>
                <h3 className="font-headline text-lg font-bold text-on-surface mb-2 leading-snug">
                  {conflict.title || "Regulatory Contradiction Detected"}
                </h3>
                <p className="text-sm text-on-surface-variant line-clamp-2 font-body leading-relaxed italic">
                  {conflict.reasoning}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Right Panel: Network Graph (65%) */}
        <section className="flex-1 p-6 relative bg-surface flex flex-col overflow-hidden">
          <div className="glass-panel flex-1 border border-outline-variant/20 flex flex-col shadow-[0_24px_48px_-12px_rgba(82,68,56,0.06)] relative">
            {/* Graph Toolbar */}
            <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="font-label text-[9px] font-bold uppercase">Banking Sector</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                  <span className="font-label text-[9px] font-bold uppercase">Markets & Securities</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                  <span className="font-label text-[9px] font-bold uppercase">Active Conflict Bridge</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-stone-200/50 transition-all"><span className="material-symbols-outlined text-lg">zoom_in</span></button>
                <button className="p-1.5 hover:bg-stone-200/50 transition-all"><span className="material-symbols-outlined text-lg">zoom_out</span></button>
                <button className="p-1.5 hover:bg-stone-200/50 transition-all ml-2"><span className="material-symbols-outlined text-lg">filter_center_focus</span></button>
              </div>
            </div>

            {/* Graph Workspace Area */}
            <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#d7c3b3_0.5px,transparent_0.5px)] [background-size:16px_16px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-[800px] max-h-[600px]">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#ba1a1a" />
                      </marker>
                    </defs>
                    
                    {selectedConflict && selectedConflict.nodes?.map((node: any, idx: number) => {
                      const nextNode = selectedConflict.nodes[idx + 1];
                      if (!nextNode) return null;
                      return (
                        <motion.line 
                          key={`edge-${idx}`}
                          x1={`${node.x + 50}%`}
                          y1={`${node.y + 50}%`}
                          x2={`${nextNode.x + 50}%`}
                          y2={`${nextNode.y + 50}%`}
                          stroke="#ba1a1a"
                          strokeWidth="1.5"
                          strokeDasharray="6 4"
                          markerEnd="url(#arrow)"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.4 }}
                          transition={{ duration: 1, delay: idx * 0.2 }}
                        />
                      );
                    })}
                  </svg>

                  {/* Central Node Visual */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="w-48 h-48 rounded-full border border-error/20 flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full border border-error/10 animate-[ping_3s_ease-in-out_infinite]" />
                      <div className="w-32 h-32 rounded-full bg-error/5 flex flex-col items-center justify-center text-center p-4 border border-error/5 group hover:bg-error/10 transition-all">
                        <span className="font-label text-[10px] font-bold text-error uppercase mb-1">Impact Event</span>
                        <span className="font-headline text-lg font-bold text-on-surface tracking-tight">
                          {selectedId ? `#${selectedId.slice(-4)}` : "SEM-09"}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Peripheral Nodes Mapping */}
                  {selectedConflict?.nodes?.map((node: any, idx: number) => (
                    <motion.div
                      key={node.id || idx}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      style={{ left: `${node.x + 50}%`, top: `${node.y + 50}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="bg-surface border border-outline-variant/30 p-2 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                        <div className={cn(
                          "w-10 h-10 flex items-center justify-center text-white font-black text-xs",
                          idx % 2 === 0 ? "bg-secondary" : "bg-tertiary"
                        )}>
                          {node.title?.split(" ")[0]?.slice(0, 4)?.toUpperCase() || "REG"}
                        </div>
                        <span className="block font-label text-[8px] mt-1 font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
                          {node.title || "Vector-X"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating Legend Overlay */}
              <div className="absolute bottom-6 right-6 p-4 glass-panel border border-outline-variant/20 max-w-xs shadow-xl">
                <h4 className="font-label text-[10px] font-bold uppercase mb-3 text-primary">Semantic Proximity Analysis</h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-on-surface-variant uppercase tracking-widest">Similarity Score</span>
                      <span className="text-primary font-mono text-[12px]">0.922</span>
                    </div>
                    <div className="w-full bg-stone-200 h-1 relative overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "92.2%" }}
                        className="bg-primary h-full" 
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-body italic leading-relaxed">
                    Overlapping operational mandates detected in the vector space with 92% semantic alignment but contradictory specific requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intelligence Drawer (Detail View) */}
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              {/* Overlay Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-stone-900/20 backdrop-blur-[2px] z-[60] left-64"
              />
              
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full w-[540px] bg-[#F7F5F0] z-[70] shadow-[-32px_0_64px_-20px_rgba(82,68,56,0.15)] flex flex-col border-l border-outline-variant/20"
              >
                {/* Drawer Header */}
                <div className="p-8 pb-4">
                  <div className="flex justify-between items-center mb-8">
                    <button 
                      onClick={() => setIsDrawerOpen(false)}
                      className="group p-2 hover:bg-stone-100 transition-all rounded-full"
                    >
                      <X className="h-5 w-5 text-on-surface-variant group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                    <div className="flex gap-3">
                      <button className="text-[10px] font-label font-bold uppercase px-4 py-1.5 border border-outline-variant hover:bg-stone-200/50 transition-all">Audit JSON</button>
                      <button className="text-[10px] font-label font-bold uppercase px-4 py-1.5 bg-on-surface text-surface hover:opacity-90 transition-all">Share Insight</button>
                    </div>
                  </div>
                  <p className="font-label text-[11px] text-error font-bold tracking-[0.2em] uppercase mb-2">Critical Contradiction Detected</p>
                  <h2 className="font-headline text-3xl font-extrabold text-on-surface leading-tight tracking-tight">
                    {selectedConflict?.title || "Divergence in Jurisdictional Compliance"}
                  </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-12 no-scrollbar pb-10">
                  {/* Detection Pipeline Stepper */}
                  <section>
                    <h3 className="font-label text-[10px] font-bold uppercase text-outline mb-8 tracking-widest border-b border-outline-variant/10 pb-2">Detection Pipeline</h3>
                    <div className="flex flex-col gap-8 relative">
                      <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-outline-variant/40"></div>
                      
                      {[
                        { label: "Topic Identification", desc: "Categorized as: Financial Crime > AML Thresholds", icon: <ShieldCheck className="h-3 w-3" />, status: "success" },
                        { label: "Semantic Corelation", desc: "Cross-Reg correlation score: 0.941", icon: <ShieldCheck className="h-3 w-3" />, status: "success" },
                        { label: "Neural Inference Check", desc: "Result: DETECTED CONTRADICTION", icon: <Zap className="h-3 w-3" />, status: "warning" },
                        { label: "Knowledge Graph Indexing", desc: "Graph update pending human verification", icon: <span className="text-[8px] font-bold">4</span>, status: "pending" }
                      ].map((step, idx) => (
                        <div key={idx} className={cn("flex gap-6 items-start relative z-10", step.status === "pending" && "opacity-50")}>
                          <div className={cn(
                            "w-4 h-4 flex items-center justify-center text-white mt-1 shrink-0",
                            step.status === "success" ? "bg-tertiary" : step.status === "warning" ? "bg-amber-600" : "bg-surface border border-outline text-on-surface"
                          )}>
                            {step.icon}
                          </div>
                          <div className="space-y-1">
                            <p className="font-label text-[11px] font-bold text-on-surface uppercase tracking-tight">{step.label}</p>
                            <p className="text-[10px] text-on-surface-variant font-body leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Side-by-Side Comparison */}
                  <section>
                    <h3 className="font-label text-[10px] font-bold uppercase text-outline mb-6 tracking-widest border-b border-outline-variant/10 pb-2">Comparative Analysis</h3>
                    <div className="space-y-4">
                      <div className="bg-secondary/5 border-l-2 border-secondary p-5">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-label text-[10px] font-bold text-secondary uppercase tracking-widest">{selectedConflict?.source?.id || "REG-A"}</span>
                          <span className="font-label text-[9px] text-outline font-bold">MANDATE-01</span>
                        </div>
                        <p className="text-sm text-on-secondary-container leading-relaxed italic font-body">
                          {selectedConflict?.source?.text || "The primary regulator establishes a standard for aggregate volume monitoring at a higher threshold."}
                        </p>
                      </div>
                      <div className="flex justify-center py-2">
                        <span className="font-headline text-5xl font-extrabold text-error opacity-20">≠</span>
                      </div>
                      <div className="bg-tertiary/5 border-l-2 border-tertiary p-5">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-label text-[10px] font-bold text-tertiary uppercase tracking-widest">{selectedConflict?.target?.id || "REG-B"}</span>
                          <span className="font-label text-[9px] text-outline font-bold">MANDATE-22</span>
                        </div>
                        <p className="text-sm text-on-tertiary-container leading-relaxed italic font-body">
                          {selectedConflict?.target?.text || "The sector-specific authority imposes a more restrictive reporting criterion for the same activity."}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Engine Reasoning */}
                  <section>
                    <h3 className="font-label text-[10px] font-bold uppercase text-outline mb-4 tracking-widest">Procedural Reasoning</h3>
                    <div className="bg-surface-container p-6 border border-outline-variant/10 shadow-inner">
                      <p className="text-xs text-on-surface-variant font-body leading-loose">
                        {selectedConflict?.reasoning}. The divergence creates an <span className="text-error font-bold italic">operational dead-zone</span> where reporting under one mandate triggers a compliance gap in the other, necessitating a unified reconciliation policy.
                      </p>
                    </div>
                  </section>

                  {/* Affected Entities */}
                  <section className="pb-8">
                    <h3 className="font-label text-[10px] font-bold uppercase text-outline mb-4 tracking-widest text-primary">Target Asset Classes</h3>
                    <div className="flex flex-wrap gap-2">
                      {["Foreign Intermediaries", "Category-II FPIs", "NBFC-D Carriers", "Global Custodians"].map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-stone-200/50 text-stone-700 font-label text-[9px] font-bold uppercase border border-stone-300/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Drawer Footer Actions */}
                <div className="p-8 border-t border-outline-variant/20 bg-surface-container-low flex gap-4">
                  {!isReadOnly && (
                    <button 
                      onClick={() => {
                        addConflictToWorkbench(selectedConflict);
                        toast.success("Conflict queued for legal mitigation.");
                        router.push("/dashboard/amendment-workbench");
                      }}
                      className="flex-1 bg-primary text-on-primary py-4 font-label text-[11px] font-bold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                      Mitigate Risk
                    </button>
                  )}
                  <button className="flex-1 border border-on-surface text-on-surface py-4 font-label text-[11px] font-bold uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-all active:scale-95">
                    Stage Report
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .font-headline { font-family: 'Newsreader', serif; }
        .font-label { font-family: 'Space Grotesk', monospace; }
        .glass-panel {
          background: rgba(247, 245, 240, 0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
