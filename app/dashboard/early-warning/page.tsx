"use client";

import { useState, useEffect } from "react";
import { Radar, Globe, Loader2, Plus, Brain } from "lucide-react";
import apiClient from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/lib/store/workflowStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function EarlyWarningPage() {
  const router = useRouter();
  const addConflictToWorkbench = useWorkflowStore((state) => state.addConflictToWorkbench);
  const [activeAnalysis, setActiveAnalysis] = useState<number | null>(null);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    async function fetchWarnings() {
      try {
        const response = await apiClient.get('/api/early-warnings');
        setWarnings(response.data.warnings || []);
      } catch (error) {
        console.error("Failed to fetch early warnings", error);
        toast.error("Failed to sync radar signals.");
      } finally {
        setLoading(false);
      }
    }
    fetchWarnings();
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-surface font-body p-8 lg:p-12 animate-in fade-in duration-1000">
      {/* Page Header */}
      <header className="mb-12">
        <h2 className="text-5xl font-headline font-bold text-on-surface mb-2 tracking-tight italic">Early Warning Radar</h2>
        <p className="text-stone-500 font-serif text-lg max-w-2xl opacity-70">
          Predictive surveillance of draft circulars and consultation papers. Identify regulatory shifts before they become mandates.
        </p>
      </header>

      {/* Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="glass-panel p-6 border-l-2 border-primary amber-glow relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-label text-primary uppercase tracking-widest font-bold">Drafts Tracked</span>
            <span className="material-symbols-outlined text-primary/40">analytics</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-label font-bold text-on-surface">{warnings.length}</span>
            <span className="text-xs text-tertiary font-label font-bold">+12% vs LW</span>
          </div>
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
             <Radar className="h-12 w-12" />
          </div>
        </div>

        <div className="glass-panel p-6 border-l-2 border-error amber-glow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-label text-error uppercase tracking-widest font-bold">Days to Nearest Enforcement</span>
            <span className="material-symbols-outlined text-error/40">timer</span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-label font-bold text-error">08</span>
            <span className="text-xs text-stone-500 font-label font-bold uppercase">Days Remaining</span>
          </div>
          <div className="h-1.5 w-full bg-surface-container-high relative">
            <div className="absolute top-0 left-0 h-full bg-error w-[15%]"></div>
          </div>
        </div>

        <div className="glass-panel p-6 border-l-2 border-secondary amber-glow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-label text-secondary uppercase tracking-widest font-bold">Regulations Going Live</span>
            <span className="material-symbols-outlined text-secondary/40">broadcast_on_home</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-label font-bold text-on-surface">06</span>
            <span className="text-xs text-stone-500 font-label font-bold uppercase">This Quarter</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-6">
          <Loader2 className="h-12 w-12 text-amber-primary animate-spin" />
          <p className="text-[10px] font-label text-stone-500 uppercase tracking-widest">Synchronizing Neural Radar...</p>
        </div>
      ) : warnings.length === 0 ? (
        <div className="glass-panel p-24 text-center border-dashed border-stone-300">
          <Globe className="h-16 w-16 text-stone-200 mx-auto mb-6" />
          <h3 className="text-2xl font-headline font-bold mb-2 italic">Zero Signal Detected</h3>
          <p className="text-stone-500 font-serif max-w-md mx-auto">
            The surveillance pipeline is active but no high-risk shifts have been detected in the recent draft noise.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
          {warnings.map((warning, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={warning.id || index}
              className={cn(
                "glass-panel relative amber-glow transition-all",
                activeAnalysis === index ? "lg:col-span-2" : ""
              )}
            >
              <div className={cn(
                "h-1 w-full",
                warning.urgency === 'High' ? 'bg-error' : 'bg-primary'
              )} />
              
              <div className={cn("p-6", activeAnalysis === index ? "lg:p-8" : "")}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-surface-container-high text-[10px] font-label text-on-surface-variant uppercase tracking-wider font-bold">
                      {warning.issuing_body}/{new Date().getFullYear()}/{Math.floor(100 + Math.random() * 900)}
                    </span>
                    {activeAnalysis === index && (
                       <span className="text-xs font-bold text-primary font-label flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm leading-none">bolt</span>
                        PREDICTIVE ANALYSIS ACTIVE
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "material-symbols-outlined",
                    warning.urgency === 'High' ? 'text-error' : 'text-primary'
                  )}>
                    {warning.urgency === 'High' ? 'warning' : 'notifications_active'}
                  </span>
                </div>

                <h3 className={cn(
                  "font-headline font-bold leading-tight mb-4",
                  activeAnalysis === index ? "text-3xl max-w-xl" : "text-xl"
                )}>
                  {warning.title}
                </h3>

                {activeAnalysis === index ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8"
                  >
                    {/* Comparison Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="p-5 bg-surface-container-low border border-stone-200/50">
                        <p className="text-[10px] font-label text-stone-500 uppercase mb-3 font-bold">Current Framework</p>
                        <p className="text-sm font-serif leading-relaxed text-on-surface-variant">
                          Legacy standard focusing on retrospective reporting with qualitative disclosure requirements.
                        </p>
                      </div>
                      <div className="p-5 bg-primary/5 border border-primary/20">
                        <p className="text-[10px] font-label text-primary uppercase mb-3 font-bold">Proposed Rule (Predictive)</p>
                        <p className="text-sm font-serif leading-relaxed text-on-surface italic">
                          {warning.proposed_change}
                        </p>
                      </div>
                    </div>

                    {/* Impact Section */}
                    <div className="bg-surface-container-lowest p-6 border-t-[0.5px] border-stone-200">
                      <h4 className="text-xs font-label font-bold uppercase tracking-widest text-on-surface mb-4">Actions Your Team Should Start Now</h4>
                      <ul className="space-y-4">
                        <li className="flex gap-4 items-start">
                          <span className="h-5 w-5 flex items-center justify-center bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold">01</span>
                          <p className="text-sm text-on-surface-variant font-serif italic text-foreground opacity-80">Initial briefing with the senior legal counsel regarding the proposed scope of {warning.issuing_body} changes.</p>
                        </li>
                        <li className="flex gap-4 items-start">
                          <span className="h-5 w-5 flex items-center justify-center bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold">02</span>
                          <p className="text-sm text-on-surface-variant font-serif italic text-foreground opacity-80">Conduct gap analysis between current internal policy vectors and the predictive draft mandate.</p>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <div className="flex -space-x-2">
                         {[1, 2, 3].map(i => (
                           <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-stone-200 flex items-center justify-center overflow-hidden">
                              <img src={`https://i.pravatar.cc/150?u=${warning.id}-${i}`} alt="Collaborator" className="h-full w-full object-cover grayscale opacity-80" />
                           </div>
                         ))}
                        <div className="h-8 w-8 bg-surface-container-highest flex items-center justify-center text-[10px] font-label text-stone-500 border-2 border-background">+4</div>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setActiveAnalysis(null)}
                          className="text-stone-400 text-[10px] font-label font-bold uppercase tracking-widest hover:text-stone-600 transition-colors"
                        >
                          Minimize
                        </button>
                        <button 
                          onClick={() => {
                            addConflictToWorkbench({
                              id: `WARN-${warning.id || index}`,
                              source: { id: warning.issuing_body, title: warning.title },
                              target: { id: "INTERNAL", title: "Institutional Policy Vector" },
                              severity: warning.urgency,
                              type: "Predictive Deviation",
                              reasoning: warning.proposed_change,
                              status: 'Unresolved'
                            });
                            toast.success("Signal promoted to active remediation workbench.");
                            router.push("/dashboard/amendment-workbench");
                          }}
                          className="text-primary text-[10px] font-label font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                        >
                          Mitigate Risk
                          <span className="material-symbols-outlined text-sm leading-none">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center gap-1 mb-8">
                      <div className={cn("flex-1 h-[2px]", warning.urgency === 'High' ? 'bg-error' : 'bg-tertiary')} />
                      <div className={cn("flex-1 h-[2px]", warning.urgency === 'High' ? 'bg-error' : 'bg-tertiary')} />
                      <div className={cn("flex-1 h-[2px]", warning.urgency === 'High' ? 'bg-tertiary' : 'bg-primary')} />
                      <div className="flex-1 h-[2px] bg-surface-container-high" />
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-label text-stone-500 uppercase mb-1 font-bold">Status</p>
                        <p className={cn("text-xs font-bold", warning.urgency === 'High' ? 'text-error' : 'text-primary')}>
                          {warning.urgency === 'High' ? 'Critical Surveillance' : 'Active Monitoring'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-label text-stone-500 uppercase mb-1 font-bold">Enforcement</p>
                        <p className="text-3xl font-label font-bold text-on-surface leading-none">14d</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveAnalysis(index)}
                      className="mt-6 w-full py-2 bg-surface-container-high group-hover:bg-primary-container group-hover:text-on-primary-container text-[10px] font-label uppercase tracking-widest font-bold transition-all text-stone-600 flex items-center justify-center gap-2"
                    >
                      Expand Intelligence
                      <span className="material-symbols-outlined text-sm leading-none">expand_more</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}

          {/* New Entry Placeholder */}
          <div className="glass-panel relative amber-glow transition-all hover:border-primary border border-dashed border-stone-300 bg-transparent min-h-[300px] flex items-center justify-center">
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 bg-surface-container flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/10">
                <Plus className="text-stone-400 group-hover:text-primary" />
              </div>
              <p className="font-label text-xs uppercase tracking-widest text-stone-500 font-bold">Track New Draft Regulation</p>
              <p className="text-[10px] text-stone-400 mt-2 font-serif italic text-foreground opacity-60">Upload PDF or paste URL to initiate predictive impact analysis</p>
            </div>
          </div>
        </div>
      )}

      {/* Regulatory Timeline Visualizer */}
      <div className="glass-panel p-8 amber-glow mt-8">
        <div className="flex justify-between items-center mb-10">
          <h4 className="text-2xl font-headline font-bold italic">Horizon Scanning: Enforcement Timeline</h4>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-error" />
              <span className="text-[10px] font-label text-stone-500 font-bold tracking-widest">CRITICAL</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-tertiary" />
              <span className="text-[10px] font-label text-stone-500 font-bold tracking-widest">ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="pb-4 text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">Regulatory Body</th>
                <th className="pb-4 text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">Circular ID</th>
                <th className="pb-4 text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">Target Vector</th>
                <th className="pb-4 text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">Deadline</th>
                <th className="pb-4 text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 italic font-serif">
              {warnings.map((w, idx) => (
                <tr key={idx} className="group hover:bg-surface-container-low transition-colors">
                  <td className="py-6 font-label text-xs font-bold text-foreground opacity-80">{w.issuing_body}</td>
                  <td className="py-6 font-label text-xs text-stone-400">{w.issuing_body}/2024/{Math.floor(100 + Math.random() * 900)}</td>
                  <td className="py-6 text-sm font-bold text-on-surface">{w.title}</td>
                  <td className="py-6 font-label text-xs text-error font-bold tracking-widest">Q4 2024</td>
                  <td className="py-6">
                    <span className={cn(
                      "px-3 py-1 text-[10px] font-label font-bold tracking-widest",
                      w.urgency === 'High' ? 'bg-error/10 text-error' : 'bg-tertiary/10 text-tertiary'
                    )}>
                      {w.urgency === 'High' ? 'ESCALATED' : 'STABLE'}
                    </span>
                  </td>
                </tr>
              ))}
              {/* Mock fallback row */}
              <tr className="group hover:bg-surface-container-low transition-colors">
                  <td className="py-6 font-label text-xs font-bold text-foreground opacity-80">SEBI</td>
                  <td className="py-6 font-label text-xs text-stone-400">SEBI/2024/772</td>
                  <td className="py-6 text-sm font-bold text-on-surface">ESG Assurance Norms (BRSR Core)</td>
                  <td className="py-6 font-label text-xs text-error font-bold tracking-widest">OCT 01, 2024</td>
                  <td className="py-6">
                    <span className="px-3 py-1 bg-error/10 text-error text-[10px] font-label font-bold tracking-widest">CRITICAL</span>
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Intelligence Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-12 right-12 w-80 glass-elevation border border-primary/20 p-8 z-50 amber-glow"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary flex items-center justify-center">
                  <Brain className="text-white h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">Neural Intel</p>
                  <h5 className="text-sm font-bold font-headline">Radar Insights</h5>
                </div>
              </div>
              <button 
                onClick={() => setShowOverlay(false)}
                className="text-stone-300 hover:text-stone-600 transition-colors"
              >
                <Plus className="rotate-45 h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-on-surface-variant font-serif italic text-foreground leading-relaxed mb-6 opacity-80">
              Analysis suggests a 74% probability of the current Digital Lending draft becoming a strict mandate by Q4. Budgeting for additional technical implementation is recommended.
            </p>
            <button 
              onClick={() => setShowOverlay(false)}
              className="w-full py-3 bg-primary text-on-primary text-[10px] font-label uppercase tracking-widest font-bold hover:bg-primary-container transition-all"
            >
              Dismiss Intelligence
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
