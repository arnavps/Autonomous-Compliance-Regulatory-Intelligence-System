"use client";

import { 
  LayoutGrid, 
  Search, 
  ChevronRight, 
  ShieldAlert, 
  Info,
  Maximize2,
  FileText,
  Activity,
  Layers,
  Globe,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/lib/store/workflowStore";

export default function ExposureMatrixPage() {
  const { riskScores } = useWorkflowStore();
  const [view, setView] = useState<'grid' | 'spatial'>('grid');

  const getDynamicRisk = (score: number) => {
    if (score > 80) return { label: "Critical", color: "bg-error text-on-error border-red-900", glow: "shadow-error/20" };
    if (score > 60) return { label: "Elevated", color: "bg-primary text-on-primary border-primary", glow: "shadow-primary/20" };
    if (score > 30) return { label: "Nominal", color: "bg-surface-container-high text-on-surface border-outline-variant/30", glow: "" };
    return { label: "Negligible", color: "bg-surface-container-low text-stone-400 border-outline-variant/10", glow: "" };
  };

  const matrixData = [
    { region: "EU", category: "Data Privacy", impact: riskScores['EU-Data Privacy'] || 92, probability: 40, trend: 'up' },
    { region: "US", category: "Securities", impact: riskScores['US-Securities'] || 65, probability: 80, trend: 'stable' },
    { region: "IN", category: "Digital Lending", impact: riskScores['IN-Digital Lending'] || 88, probability: 90, trend: 'up' },
    { region: "SG", category: "Fintech Licensing", impact: 30, probability: 20, trend: 'down' },
    { region: "EU", category: "AML/KYC", impact: 55, probability: 60, trend: 'up' },
    { region: "UK", category: "Consumer Credit", impact: 40, probability: 30, trend: 'stable' },
    { region: "IN", category: "Crypto Taxation", impact: 70, probability: 10, trend: 'up' },
    { region: "US", category: "Privacy Act", impact: 85, probability: 55, trend: 'down' },
    { region: "GLOBAL", category: "Sustainability", impact: 20, probability: 85, trend: 'up' }
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-body p-8 lg:p-12 animate-in fade-in duration-1000">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12 pb-8 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-label font-bold uppercase tracking-widest border border-primary/20">
              Multidimensional Exposure Mapping
            </span>
            <span className="h-[1px] w-8 bg-outline-variant/30" />
            <div className="flex items-center gap-2 px-2 py-0.5 bg-surface-container-high rounded-full border border-outline-variant/30">
              <Globe size={10} className="text-stone-400" />
              <span className="text-[9px] font-label font-bold uppercase text-stone-500">Global Coverage Active</span>
            </div>
          </div>
          <h1 className="font-headline text-5xl font-bold tracking-tight mb-2 italic">Intelligence Lattice</h1>
          <p className="text-stone-500 font-serif text-lg max-w-2xl opacity-70">
            Correlating regulatory probability against institutional impact across cross-border jurisdictions.
          </p>
        </div>
        
        <div className="flex bg-surface-container-high p-1 border border-outline-variant/30">
          <button 
            onClick={() => setView('grid')}
            className={cn(
              "px-6 py-2 text-[10px] font-label font-bold uppercase tracking-widest transition-all",
              view === 'grid' ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "text-stone-500 hover:text-on-surface"
            )}
          >
            Tactical Grid
          </button>
          <button 
            onClick={() => setView('spatial')}
            className={cn(
              "px-6 py-2 text-[10px] font-label font-bold uppercase tracking-widest transition-all",
              view === 'spatial' ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "text-stone-500 hover:text-on-surface"
            )}
          >
            Spatial Lattice
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Visualization */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          <div className="flex justify-between items-center px-2">
            <div className="flex gap-8">
              {['Critical', 'Elevated', 'Nominal'].map((l, i) => (
                <div key={l} className="flex items-center gap-2">
                  <div className={cn("h-2 w-2", i === 0 ? 'bg-error' : i === 1 ? 'bg-primary' : 'bg-stone-300')} />
                  <span className="text-[10px] font-label text-stone-500 font-bold tracking-widest uppercase">{l}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-primary" />
              <span className="font-label text-[10px] text-stone-400 font-bold uppercase tracking-wider">Layer: Institutional Entropy</span>
            </div>
          </div>

          <div className={cn(
            "grid gap-2 transition-all duration-700 p-2 border border-outline-variant/20 bg-surface-container-low/30 backdrop-blur-xl amber-glow",
            view === 'grid' ? "grid-cols-1 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4"
          )}>
            <AnimatePresence mode="popLayout">
              {matrixData.map((item, i) => {
                const risk = getDynamicRisk(item.impact);
                return (
                  <motion.div
                    key={`${item.region}-${item.category}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4, brightness: 1.1 }}
                    className={cn(
                      "group relative p-8 h-64 flex flex-col justify-between border-l-2 transition-all cursor-crosshair overflow-hidden",
                      risk.color,
                      risk.glow
                    )}
                  >
                    {/* Glass Overlay */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <p className="text-[10px] font-label font-bold uppercase tracking-widest opacity-60">
                          {item.region} // {item.category}
                        </p>
                        <Maximize2 size={12} className="opacity-40 group-hover:opacity-100 transition-all rotate-45 group-hover:rotate-0" />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <h3 className="font-headline text-2xl font-bold italic tracking-tight">{risk.label}</h3>
                        <div className="h-[1px] w-full bg-current opacity-20" />
                      </div>
                    </div>

                    <div className="relative z-10 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-label font-bold uppercase tracking-widest opacity-50">Impact Score</span>
                          <span className="text-lg font-headline font-bold">{item.impact}%</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] font-label font-bold uppercase tracking-widest opacity-50">Probability</span>
                          <span className="text-lg font-headline font-bold">{item.probability}%</span>
                        </div>
                      </div>
                      
                      {item.trend === 'up' && (
                        <div className="flex items-center gap-2 py-1 px-2 bg-black/10 rounded-sm w-fit">
                          <Activity size={10} className="animate-pulse" />
                          <span className="text-[8px] font-label font-bold uppercase tracking-tighter">Accelerating Entropy</span>
                        </div>
                      )}
                    </div>

                    {/* Technical Backing */}
                    <Zap size={140} className="absolute -right-10 -bottom-10 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Detail Panel */}
        <aside className="col-span-1 lg:col-span-4 flex flex-col gap-8">
          <section className="glass-panel p-8 amber-glow border-l-2 border-primary">
            <div className="flex items-center gap-3 text-primary mb-8">
              <ShieldAlert size={18} />
              <h2 className="font-headline text-2xl font-bold italic text-on-surface">Primary Risk Vector</h2>
            </div>
            
            <div className="space-y-8">
              <div className="bg-surface-container/50 p-6 border border-outline-variant/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Globe size={40} />
                </div>
                <h4 className="text-[10px] font-label text-primary font-bold uppercase tracking-[0.2em] mb-4">India // Digital Lending</h4>
                <p className="font-serif text-lg leading-snug mb-4 italic">"Structural shift in first-loss default guarantees impacting NBFC leverage models."</p>
                <div className="flex items-center gap-3 text-rose-500">
                  <Activity size={14} className="animate-ping" />
                  <span className="text-[10px] font-label font-bold uppercase tracking-widest">Immediate Policy Remediation Required</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-5 bg-surface-container-highest/20 text-center">
                  <p className="text-[9px] font-label text-stone-400 font-bold uppercase tracking-widest mb-1">Exposure</p>
                  <p className="font-headline text-2xl font-bold font-serif">$4.2M</p>
                </div>
                <div className="glass-panel p-5 bg-surface-container-highest/20 text-center">
                  <p className="text-[9px] font-label text-stone-400 font-bold uppercase tracking-widest mb-1">Linear Risk</p>
                  <p className="font-headline text-2xl font-bold font-serif">Critical</p>
                </div>
              </div>

              <button className="w-full py-4 bg-primary text-on-primary text-[10px] font-label font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
                <FileText size={14} />
                Generate Core Defense Memo
              </button>
            </div>
          </section>

          <section className="p-8 border border-dashed border-outline-variant/40 bg-transparent rounded-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-stone-400">
              <Info size={14} />
              <span className="text-[10px] font-label font-bold uppercase tracking-widest">Heuristic Synthesis</span>
            </div>
            <p className="text-xs text-stone-500 font-serif leading-relaxed italic opacity-70">
              "Systemic correlation detected between EU Data Privacy re-classification and UK Consumer Credit vectors. Neural mapping suggests 12% shared overhead potential."
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="h-[2px] flex-1 bg-outline-variant/20 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-primary" />
              </div>
              <span className="text-[9px] font-label text-primary font-bold">67% Conf.</span>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

import { useState } from "react";
