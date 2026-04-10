"use client";

import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldCheck, 
  Globe, 
  Zap,
  Activity,
  Layers,
  LayoutGrid,
  ChevronRight,
  Target
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function RiskPage() {
  const matrixData = [
    { name: "Digital Lending", impact: "High", trend: "up", probability: 85, color: "bg-red-500" },
    { name: "AML/KYC", impact: "Medium", trend: "down", probability: 40, color: "bg-amber-primary" },
    { name: "Cloud Security", impact: "High", trend: "stable", probability: 70, color: "bg-amber-primary" },
    { name: "Foreign Exchange", impact: "Low", trend: "up", probability: 25, color: "bg-green-500" },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between pb-4 border-b border-amber-primary/10">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <LayoutGrid className="h-4 w-4 text-amber-primary fill-amber-primary/20" />
            <span className="text-[10px] font-mono font-bold text-amber-primary uppercase tracking-[0.2em]">Institutional Risk Posture</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Risk Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
           <div className="px-3 py-1.5 glass-standard text-[10px] font-mono font-bold text-green-600 uppercase flex items-center gap-2">
              <Activity className="h-3 w-3" />
              Real-time Analysis
           </div>
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <GlassCard variant="standard" className="space-y-4">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Aggregate Exposure Score</span>
            <div className="flex items-end justify-between">
               <span className="text-4xl font-serif font-bold">782</span>
               <div className="flex items-center gap-1 text-red-500 text-[11px] font-bold">
                  <TrendingUp className="h-3 w-3" /> 
                  +12.4%
               </div>
            </div>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-red-500 w-[78%]" />
            </div>
         </GlassCard>

         <GlassCard variant="standard" className="space-y-4">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Active Anomalies</span>
            <div className="flex items-end justify-between">
               <span className="text-4xl font-serif font-bold">14</span>
               <div className="flex items-center gap-1 text-green-500 text-[11px] font-bold">
                  <TrendingDown className="h-3 w-3" /> 
                  -2
               </div>
            </div>
            <div className="flex gap-1.5">
               {[1,2,3,4,5,6,7].map(i => (
                 <div key={i} className={cn("h-4 w-1.5 rounded-sm", i > 5 ? "bg-amber-primary" : "bg-red-500")} />
               ))}
            </div>
         </GlassCard>

         <GlassCard variant="standard" className="space-y-4">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Mitigation Status</span>
            <div className="flex items-end justify-between">
               <span className="text-4xl font-serif font-bold text-green-600">62%</span>
               <span className="text-[11px] font-bold text-slate-400">ACTIVE</span>
            </div>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-green-500 w-[62%]" />
            </div>
         </GlassCard>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
         {/* Exposure Matrix */}
         <div className="col-span-12 lg:col-span-8 flex flex-col space-y-4">
            <div className="flex items-center justify-between px-1">
               <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Regulatory Exposure Matrix</span>
               <button className="text-[9px] font-bold text-amber-primary uppercase tracking-widest underline underline-offset-4">Full Modeling</button>
            </div>
            
            <GlassCard variant="standard" padding={false} className="flex-1 overflow-hidden flex flex-col border-amber-primary/5">
                <div className="grid grid-cols-4 border-b border-slate-100/50 bg-slate-50/20">
                   {["Compliance Vector", "Impact Level", "Trend", "Risk Probability"].map((h, i) => (
                     <div key={i} className="p-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{h}</div>
                   ))}
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                   {matrixData.map((row, i) => (
                     <div key={i} className="grid grid-cols-4 border-b border-slate-50 items-center hover:bg-white/40 transition-colors group">
                        <div className="p-4">
                           <div className="flex items-center gap-3">
                              <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-white", row.color)}>
                                 <Layers className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-bold text-slate-900">{row.name}</span>
                           </div>
                        </div>
                        <div className="p-4">
                           <span className={cn(
                             "text-[10px] font-bold px-2 py-0.5 rounded",
                             row.impact === "High" ? "bg-red-500/10 text-red-600" : "bg-amber-primary/10 text-amber-primary"
                           )}>
                              {row.impact}
                           </span>
                        </div>
                        <div className="p-4">
                           {row.trend === "up" ? (
                             <div className="flex items-center gap-1 text-red-500">
                                <TrendingUp className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold">ASCENDING</span>
                             </div>
                           ) : row.trend === "down" ? (
                             <div className="flex items-center gap-1 text-green-500">
                                <TrendingDown className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold">REDUCING</span>
                             </div>
                           ) : (
                             <div className="flex items-center gap-1 text-slate-400">
                                <Activity className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold">STABLE</span>
                             </div>
                           )}
                        </div>
                        <div className="p-4">
                           <div className="flex items-center gap-4">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                                 <div className={cn("h-full", row.color)} style={{ width: `${row.probability}%` }} />
                              </div>
                              <span className="text-sm font-serif font-bold">{row.probability}%</span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="p-4 bg-slate-50/20 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-amber-primary" />
                      <span className="text-[10px] font-mono font-bold text-slate-400">VECTOR_MATCHING: OCR_STABLE</span>
                   </div>
                   <button className="flex items-center gap-2 text-[10px] font-bold text-amber-primary uppercase tracking-widest group">
                      Run Impact Modeling <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
            </GlassCard>
         </div>

         {/* Sidebar: Threats & Insights */}
         <div className="col-span-12 lg:col-span-4 flex flex-col space-y-6">
            <div className="flex items-center justify-between px-1">
               <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Active Threats</span>
               <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
            </div>

            <div className="flex-1 space-y-4">
               {[
                 { title: "NBFC Liquidity Stress", desc: "RBI predictive modeling suggests tightening liquidity norms for micro-finance vectors.", risk: "Critical" },
                 { title: "Digital Lending Breach", desc: "Non-compliance detected in Clause 4.2 of the latest policy draft regarding user consent.", risk: "High" }
               ].map((threat, i) => (
                 <GlassCard 
                  key={i} 
                  variant={threat.risk === "Critical" ? "amber" : "standard"}
                  className={cn(
                    "border-amber-primary/5",
                    threat.risk === "Critical" && "border-red-500/20"
                  )}
                 >
                    <div className="flex items-start justify-between mb-3">
                       <h4 className="text-sm font-bold text-foreground">{threat.title}</h4>
                       <span className={cn(
                         "text-[9px] font-bold px-1.5 py-0.5 rounded",
                         threat.risk === "Critical" ? "bg-red-500 text-white" : "bg-amber-primary text-white"
                       )}>
                          {threat.risk}
                       </span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic font-serif leading-relaxed line-clamp-2">
                       "{threat.desc}"
                    </p>
                    <button className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-amber-primary transition-colors group">
                       ANALYZE IN RADAR <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                 </GlassCard>
               ))}
            </div>

            <GlassCard variant="standard" className="bg-sand-light border-amber-primary/10">
               <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 glass-elevated rounded-lg flex items-center justify-center text-amber-primary">
                     <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold">Compliance Posture Sturdy</span>
               </div>
               <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  Overall institutional risk remains within the "Optimized" quadrant. ACRIS Agents have pre-emptively addressed 4 potential violations this week.
               </p>
            </GlassCard>
         </div>
      </div>
    </div>
  );
}
