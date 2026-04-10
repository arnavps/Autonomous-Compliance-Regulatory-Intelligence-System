"use client";

import { useState, useEffect } from "react";
import { 
  Radar, 
  Zap, 
  ShieldAlert, 
  ChevronRight, 
  AlertTriangle, 
  Timer, 
  BarChart3, 
  Globe,
  Loader2,
  ArrowUpRight,
  TrendingUp,
  Activity
} from "lucide-react";
import apiClient from "@/lib/axios";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";

export default function RadarPage() {
  const [activeAnalysis, setActiveAnalysis] = useState<number | null>(null);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWarnings() {
      try {
        const response = await apiClient.get('/api/early-warnings');
        setWarnings(response.data.warnings || [
          {
            id: "W-001",
            issuing_body: "RBI",
            urgency: "High",
            title: "Proposed Digital Asset Guidelines",
            proposed_change: "New restrictions on institutional holding of crypto-adjacent assets expected in Q3.",
            probability: "85%",
            affected_entities: "NBFCs, Commercial Banks",
            url: "#"
          },
          {
            id: "W-002",
            issuing_body: "SEBI",
            urgency: "Medium",
            title: "Mutual Fund Disclosure Norms",
            proposed_change: "Tighter ESG reporting requirements for large cap funds across primary markets.",
            probability: "60%",
            affected_entities: "Asset Management Companies",
            url: "#"
          }
        ]);
      } catch (error) {
        setWarnings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchWarnings();
  }, []);

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Area */}
      <div className="flex items-end justify-between pb-4 border-b border-amber-primary/10">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="h-4 w-4 text-amber-primary fill-amber-primary/20 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-amber-primary uppercase tracking-[0.2em]">Predictive Signal Intelligence</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Early Warning Radar</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 glass-standard text-[10px] font-mono font-bold text-slate-500 uppercase">
            <Globe className="h-3.5 w-3.5" />
            Global Monitoring
          </div>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Signal Strength", value: "98.2%", icon: Activity, color: "text-green-500" },
          { label: "Active Drafts", value: warnings.length.toString(), icon: BarChart3, color: "text-amber-primary" },
          { label: "High Risk Vectors", value: warnings.filter(w => w.urgency === 'High').length.toString(), icon: ShieldAlert, color: "text-red-500" },
          { label: "Next Review", value: "14m", icon: Timer, color: "text-blue-500" }
        ].map((stat, i) => (
          <GlassCard key={i} variant="standard" className="flex items-center gap-4 py-4">
            <div className={cn("h-10 w-10 glass-elevated rounded-xl flex items-center justify-center", stat.color.replace('text', 'bg').replace('-500', '/10'))}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <div>
              <span className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <span className="text-xl font-serif font-bold text-foreground">{stat.value}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Radar Main View */}
      <div className="grid grid-cols-12 gap-6 min-h-0 flex-1">
        
        {/* Radar Visualization Placeholder */}
        <div className="col-span-12 lg:col-span-4 h-full">
          <GlassCard variant="standard" padding={false} className="h-full relative overflow-hidden flex flex-col items-center justify-center border-amber-primary/5 bg-[radial-gradient(circle_at_center,#C17B2F11_0%,transparent_70%)]">
            <div className="absolute inset-0 opacity-10">
               <div className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_center,transparent_0,transparent_40px,#C17B2F_41px,#C17B2F_42px)] animate-ping-slow" />
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="h-48 w-48 rounded-full border border-amber-primary/20 flex items-center justify-center relative">
                 <div className="absolute h-full w-[1px] bg-amber-primary/10 rotate-45" />
                 <div className="absolute h-full w-[1px] bg-amber-primary/10 -rotate-45" />
                 <div className="absolute w-full h-[1px] bg-amber-primary/10" />
                 <div className="absolute w-[1px] h-full bg-amber-primary/10" />
                 
                 <div className="h-32 w-32 rounded-full border border-amber-primary/10" />
                 <div className="h-16 w-16 rounded-full border border-amber-primary/5 shadow-[inset_0_0_20px_rgba(193,123,47,0.1)]" />
                 
                 {/* Moving Radar Line */}
                 <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent to-amber-primary origin-left animate-radar-sweep shadow-[0_0_10px_rgba(193,123,47,0.5)]" />
                 
                 {/* Blips */}
                 <motion.div 
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-1/4 right-1/4 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                 />
                 <motion.div 
                    animate={{ opacity: [0.1, 0.8, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="absolute bottom-1/3 left-1/2 h-1.5 w-1.5 rounded-full bg-amber-primary shadow-[0_0_8px_rgba(193,123,47,0.8)]"
                 />
              </div>

              <div className="mt-8 text-center">
                 <h3 className="text-[11px] font-mono font-bold text-amber-primary uppercase tracking-[0.3em] mb-1">Analyzing Vectors</h3>
                 <p className="text-[9px] text-slate-400 font-mono">LAT: 18.9213 | LON: 72.8335</p>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-40">
               <span className="text-[8px] font-mono text-slate-400">FS-B1 // DOCKING</span>
               <TrendingUp className="h-3 w-3 text-green-500" />
            </div>
          </GlassCard>
        </div>

        {/* Threat Feed */}
        <div className="col-span-12 lg:col-span-8 flex flex-col space-y-4">
           {loading ? (
             <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-amber-primary animate-spin" />
             </div>
           ) : (
             <div className="space-y-4 overflow-y-auto no-scrollbar pb-6">
                <div className="flex items-center justify-between px-1 mb-2">
                   <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Active Surveillance Feed</span>
                   <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Updates every 60s</span>
                </div>

                {warnings.map((warning, i) => (
                  <GlassCard 
                    key={warning.id || i}
                    variant={warning.urgency === 'High' ? "amber" : "standard"}
                    className={cn(
                      "transition-all duration-300 relative group overflow-hidden border-amber-primary/5",
                      warning.urgency === 'High' && "shadow-lg shadow-amber-primary/5 border-amber-primary/20"
                    )}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                       <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                             <div className={cn(
                               "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                               warning.urgency === 'High' ? "bg-red-500 text-white" : "bg-slate-500/10 text-slate-500"
                             )}>
                                {warning.urgency} RISK
                             </div>
                             <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{warning.issuing_body} • REG-DRAFT</span>
                             <div className="flex items-center gap-1 ml-auto">
                                <span className="text-[10px] font-mono font-bold text-amber-primary">{warning.probability}</span>
                                <span className="text-[8px] font-mono text-slate-400">PROB</span>
                             </div>
                          </div>

                          <h3 className="text-xl font-serif font-bold text-foreground leading-tight group-hover:text-amber-primary transition-colors">
                             {warning.title}
                          </h3>
                          
                          <p className="text-sm text-slate-500 italic font-serif leading-relaxed line-clamp-2">
                             "{warning.proposed_change}"
                          </p>

                          <div className="flex items-center gap-4 pt-2">
                             <div className="flex items-center gap-1.5">
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-primary/50" />
                                <span className="text-[10px] font-medium text-slate-400">{warning.affected_entities}</span>
                             </div>
                             <button
                                onClick={() => setActiveAnalysis(activeAnalysis === i ? null : i)}
                                className="flex items-center gap-1 text-[10px] font-bold text-amber-primary uppercase tracking-widest ml-auto"
                             >
                                {activeAnalysis === i ? "Collapse" : "Intelligence Detail"}
                                <ChevronRight className={cn("h-3 w-3 transition-transform", activeAnalysis === i ? "rotate-90" : "")} />
                             </button>
                          </div>
                       </div>
                    </div>

                    <AnimatePresence>
                      {activeAnalysis === i && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                           <div className="mt-6 p-4 glass-elevated border border-amber-primary/10 rounded-xl space-y-4">
                              <h4 className="text-[10px] font-mono font-bold text-amber-primary uppercase tracking-[0.2em]">Detailed Neural Impact Analysis</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                    <span className="text-[9px] uppercase text-slate-400 font-mono block mb-1">Exposure Context</span>
                                    <p className="text-xs text-slate-600 leading-relaxed font-serif italic">
                                       Cross-referencing with SEBI Master Circular 24/X suggests a significant overlap in digital custody requirements. NBFCs with foreign equity may face accelerated audit cycles.
                                    </p>
                                 </div>
                                 <div className="space-y-3">
                                    <span className="text-[9px] uppercase text-slate-400 font-mono block mb-1">Recommended Posture</span>
                                    <div className="flex items-center gap-2 p-2 bg-amber-primary/5 rounded border border-amber-primary/10">
                                       <div className="h-1.5 w-1.5 rounded-full bg-amber-primary" />
                                       <span className="text-[10px] font-bold text-amber-primary">INITIATE_PROACTIVE_AUDIT</span>
                                    </div>
                                    <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-amber-primary transition-colors group">
                                       VIEW SOURCE REG-VECTOR <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
