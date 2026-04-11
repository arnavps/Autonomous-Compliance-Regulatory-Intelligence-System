"use client";

import { 
  LayoutGrid, 
  Search, 
  ChevronRight, 
  ShieldAlert, 
  Info,
  Maximize2,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/lib/store/workflowStore";

export default function ExposureMatrixPage() {
  const { riskScores } = useWorkflowStore();

  const getDynamicRisk = (score: number) => {
    if (score > 80) return { label: "Critical", color: "bg-rose-700" };
    if (score > 60) return { label: "High", color: "bg-rose-500" };
    if (score > 30) return { label: "Medium", color: "bg-amber-500" };
    return { label: "Nominal", color: "bg-emerald-500" };
  };

  const matrixData = [
    { region: "EU", category: "Data Privacy", impact: riskScores['EU-Data Privacy'] || 92, probability: 40 },
    { region: "US", category: "Securities", impact: riskScores['US-Securities'] || 65, probability: 80 },
    { region: "IN", category: "Digital Lending", impact: riskScores['IN-Digital Lending'] || 88, probability: 90 },
    { region: "SG", category: "Fintech Licensing", impact: 30, probability: 20 },
    { region: "EU", category: "AML/KYC", impact: 55, probability: 60 },
    { region: "UK", category: "Consumer Credit", impact: 40, probability: 30 },
    { region: "IN", category: "Crypto Taxation", impact: 70, probability: 10 },
    { region: "US", category: "Privacy Act", impact: 85, probability: 55 },
    { region: "GLOBAL", category: "Sustainability", impact: 20, probability: 85 }
  ];
  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-[0.5px] border-border/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="tech-label px-2 py-0.5 bg-slate-100 text-slate-600">MULTIDIMENSIONAL RISK MAPPING</span>
            <span className="h-[1px] w-12 bg-border/30" />
          </div>
          <h1 className="text-4xl font-serif tracking-tight text-foreground">
            Exposure Matrix
          </h1>
          <p className="text-muted-foreground font-sans text-sm mt-2 max-w-xl">
            Correlating regulatory probability against institutional impact across all jurisdictions.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-surface-container-low p-0.5 border-[0.5px] border-border/30">
            <button className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest bg-white text-primary shadow-sm">Grid View</button>
            <button className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Spatial View</button>
          </div>
        </div>
      </div>

      {/* Matrix Visualization */}
      <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">
         
         {/* Main Heatmap Grid */}
         <div className="col-span-12 lg:col-span-8 flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
               <div className="flex gap-8">
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 bg-rose-600" />
                     <span className="tech-label text-muted-foreground">CRITICAL</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 bg-amber-500" />
                     <span className="tech-label text-muted-foreground">MODERATE</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 bg-emerald-500" />
                     <span className="tech-label text-muted-foreground">NOMINAL</span>
                  </div>
               </div>
               <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">N=1,402 VECTORS</span>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-1 bg-border/5 p-1 border-[0.5px] border-border/10">
               {matrixData.map((item, i) => {
                 const risk = getDynamicRisk(item.impact);
                 return (
                   <motion.div 
                     key={i}
                     layout
                     whileHover={{ scale: 0.99, brightness: 1.1 }}
                     className={cn(
                       "relative p-8 flex flex-col justify-between overflow-hidden group cursor-pointer transition-colors duration-1000",
                       risk.color
                     )}
                   >
                      {/* Background Overlay */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative z-10 flex flex-col h-full">
                         <div className="flex justify-between items-start mb-4">
                            <span className="font-mono text-[10px] text-white/60 tracking-tighter">{item.region} // {item.category}</span>
                            <Maximize2 size={12} className="text-white/40 group-hover:text-white transition-colors" />
                         </div>
                         
                         <div className="mt-auto">
                            <span className="text-2xl font-serif font-bold text-white block mb-1">{risk.label}</span>
                            <div className="flex items-center gap-2">
                               <span className="text-[9px] font-mono text-white/70 uppercase">Impact: {item.impact}%</span>
                               <span className="text-white/20">|</span>
                               <span className="text-[9px] font-mono text-white/70 uppercase">Prob: {item.probability}%</span>
                            </div>
                         </div>
                      </div>

                      {/* Technical Decals */}
                      <div className="absolute right-[-20px] bottom-[-20px] text-white/[0.05] pointer-events-none">
                         <LayoutGrid size={120} />
                      </div>
                   </motion.div>
                 );
               })}
            </div>
         </div>

         {/* Sidebar: Detail Panel */}
         <div className="col-span-12 lg:col-span-4 flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            <div className="p-8 bg-surface-container-low border-[0.5px] border-border/20">
               <div className="flex items-center gap-3 text-rose-500 mb-6">
                  <ShieldAlert className="h-5 w-5" />
                  <h3 className="tech-label">Primary Risk Focus</h3>
               </div>
               <div className="space-y-6">
                  <div className="border-l-2 border-rose-500 pl-4 py-1">
                     <h4 className="text-sm font-bold font-serif italic mb-2">Digital Lending Mandates (IN)</h4>
                     <p className="text-xs text-muted-foreground leading-relaxed">
                        Probability has shifted to 90% following the RBI's latest notification. Immediate remediation required.
                     </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white border-[0.5px] border-border/10">
                        <span className="tech-label text-muted-foreground block mb-1">Exposure</span>
                        <span className="text-lg font-serif">$4.2M</span>
                     </div>
                     <div className="p-4 bg-white border-[0.5px] border-border/10">
                        <span className="tech-label text-muted-foreground block mb-1">Vectors</span>
                        <span className="text-lg font-serif">12 Active</span>
                     </div>
                  </div>
                  
                  <button className="w-full py-4 bg-foreground text-white tech-label hover:opacity-90 transition-all flex items-center justify-center gap-3">
                     <FileText size={14} />
                     Generate Defense Memo
                  </button>
               </div>
            </div>

            <div className="p-8 border-[0.5px] border-dashed border-border/40 bg-surface-container-lowest/50">
               <div className="flex items-center gap-3 text-muted-foreground mb-4">
                  <Info className="h-4 w-4" />
                  <span className="tech-label">Heuristic Analysis</span>
               </div>
               <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                 "Engine suggests systemic correlation between US Securities changes and SG Fintech licensing models. Cross-referencing Neural Ledger for arbitrage opportunities."
               </p>
            </div>
         </div>

      </div>
    </div>
  );
}
