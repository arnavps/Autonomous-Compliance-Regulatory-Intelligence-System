"use client";

import { 
  Gauge, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Activity,
  BarChart3,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePipelineStore } from "@/lib/store/pipelineStore";

export default function RiskDashboardPage() {
  const { status, isActive } = usePipelineStore();

  const riskVectors = [
    { name: "Jurisdictional Overlap", score: 78, status: "Critical", trend: "up" },
    { name: "Data Residency Compliance", score: 12, status: "Secure", trend: "down" },
    { name: "Fiduciary Disclosure", score: 45, status: "Moderate", trend: "none" },
    { name: "Anti-Money Laundering", score: 4, status: "Secure", trend: "down" }
  ];

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-[0.5px] border-border/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="tech-label px-2 py-0.5 bg-rose-500/10 text-rose-500">PREDICTIVE STRESS ENGINE</span>
            <span className="h-[1px] w-12 bg-border/30" />
          </div>
          <h1 className="text-4xl font-serif tracking-tight text-foreground">
            Risk Dashboard
          </h1>
          <p className="text-muted-foreground font-sans text-sm mt-2 max-w-xl">
            Real-time aggregate risk modelling across all institutional vectors.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 px-8 py-3 bg-foreground text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all">
             Run Stress Test
          </button>
        </div>
      </div>

      {/* Main Grid: Analytical Layout */}
      <div className="flex-1 grid grid-cols-12 gap-8">
         
         {/* Top Left: Main Gauge */}
         <div className="col-span-12 lg:col-span-4 bg-surface-container-low border-[0.5px] border-border/20 p-8 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.05),transparent)] pointer-events-none" />
            <h3 className="tech-label text-muted-foreground mb-12 uppercase tracking-widest text-[10px]">Aggregate Institutional Risk</h3>
            
            <div className="relative h-48 w-48 flex items-center justify-center">
               <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                 <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-border/20" />
                 <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" 
                   strokeDasharray={2 * Math.PI * 88} 
                   strokeDashoffset={2 * Math.PI * 88 * (1 - 0.68)}
                   className="text-rose-500" 
                 />
               </svg>
               <div className="text-center">
                 <span className="text-6xl font-serif font-bold text-foreground transition-all group-hover:scale-110 duration-500 block">68</span>
                 <span className="block tech-label text-rose-500 mt-2">HIGH RISK</span>
               </div>
            </div>

            <div className="mt-12 w-full space-y-4">
               <div className="flex justify-between text-[10px] font-mono border-b border-border/10 pb-2">
                  <span className="text-muted-foreground uppercase">Stability Index</span>
                  <span className="text-foreground">84.2%</span>
               </div>
               <div className="flex justify-between text-[10px] font-mono border-b border-border/10 pb-2">
                  <span className="text-muted-foreground uppercase">Threat Level</span>
                  <span className="text-rose-500 font-bold">ALPHA-4</span>
               </div>
            </div>
         </div>

         {/* Top Right: Trend Grid + Pipeline Status */}
         <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              {riskVectors.map((v, i) => (
                <div key={i} className="bg-surface-container-low border-[0.5px] border-border/20 p-8 flex flex-col justify-between group hover:border-border/60 transition-all cursor-crosshair">
                  <div className="flex justify-between items-start mb-6">
                      <span className="tech-label text-muted-foreground uppercase leading-tight max-w-[120px]">{v.name}</span>
                      <div className={cn(
                        "h-8 w-8 flex items-center justify-center border-[0.5px] border-border/20 bg-white shadow-sm",
                        v.trend === "up" ? "text-rose-500" : "text-emerald-500"
                      )}>
                        {v.trend === "up" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      </div>
                  </div>
                  <div className="flex items-end justify-between">
                      <span className="text-4xl font-serif font-bold text-foreground">{v.score}</span>
                      <div className="text-right">
                        <span className={cn(
                          "text-[9px] font-mono font-bold uppercase tracking-widest",
                          v.status === "Critical" ? "text-rose-500" : "text-emerald-500"
                        )}>
                          Status: {v.status}
                        </span>
                        <div className="h-0.5 w-full bg-border/20 mt-1">
                          <div className={cn("h-full transition-all duration-1000", v.status === "Critical" ? "bg-rose-500" : "bg-emerald-500")} style={{ width: `${v.score}%` }} />
                        </div>
                      </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pipeline Status Summary Widget */}
            <div className="bg-foreground text-white border-[0.5px] border-white/10 p-8 flex items-center justify-between overflow-hidden relative">
               <div className="absolute top-0 right-0 p-2 opacity-5">
                 <ShieldCheck size={120} />
               </div>
               <div className="flex gap-10">
                 <div>
                   <span className="tech-label text-white/40 block mb-2 uppercase tracking-widest">Autonomous Loop Status</span>
                   <div className="flex items-center gap-3">
                     {isActive ? (
                       <Activity className="h-6 w-6 text-amber-primary animate-pulse" />
                     ) : (
                       <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                     )}
                     <span className="text-2xl font-serif">
                       {isActive ? "Orchestration Running..." : "Agents Healthy & Idle"}
                     </span>
                   </div>
                 </div>
                 <div className="h-12 w-[0.5px] bg-white/20 self-end mb-1" />
                 <div>
                   <span className="tech-label text-white/40 block mb-2 uppercase tracking-widest">Last Verified Ingress</span>
                   <div className="flex items-center gap-2">
                     <Clock className="h-4 w-4 text-white/60" />
                     <span className="font-mono text-sm">Today, 14:22:04</span>
                   </div>
                 </div>
               </div>
               <div className="flex flex-col items-end">
                 <span className="tech-label text-white/40 mb-1 uppercase tracking-widest text-[9px]">Ingestion Engine</span>
                 <span className="font-mono text-[10px] text-emerald-400 font-bold px-2 py-0.5 border border-emerald-400/30 rounded">STABLE</span>
               </div>
            </div>
         </div>

         {/* Bottom Full: Analytical Timeline */}
         <div className="col-span-12 bg-surface-container-low border-[0.5px] border-border/20 p-10 flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <Activity size={20} className="text-primary" />
                  <h3 className="tech-label uppercase tracking-widest text-[10px]">Temporal Variance Log</h3>
               </div>
               <div className="flex gap-4">
                  {["24H", "7D", "30D", "1Y"].map(t => (
                    <button key={t} className="text-[10px] font-mono text-muted-foreground hover:text-foreground px-2">{t}</button>
                  ))}
               </div>
            </div>
            
            <div className="h-48 w-full relative flex items-end gap-1">
               {Array.from({ length: 96 }).map((_, i) => (
                 <div 
                   key={i} 
                   className="flex-1 bg-border/20 hover:bg-primary/40 transition-all duration-300 relative group" 
                   style={{ height: `${Math.random() * 80 + 20}%` }}
                 >
                    <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 bg-foreground text-white px-1.5 py-0.5 text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      {Math.floor(Math.random() * 100)}%
                    </div>
                 </div>
               ))}
            </div>
            
            <div className="mt-6 flex justify-between text-[10px] font-mono text-muted-foreground border-t border-border/10 pt-4">
               <span>10 APR 2026, 00:00</span>
               <span>SYSTEM: CONTINUOUS_MONITORING_ENGINE</span>
               <span>10 APR 2026, 23:59</span>
            </div>
         </div>
      </div>
    </div>
  );
}
