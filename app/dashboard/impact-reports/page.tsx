"use client";

import { 
  FileCheck, 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Clock,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const reports = [
  {
    id: "REP-2026-001",
    title: "Q1 Regulatory Compliance Summary",
    status: "Finalized",
    date: "2026-04-01",
    impactScore: 84,
    trend: "up",
    author: "ACRIS Intelligence Agent"
  },
  {
    id: "REP-2026-002",
    title: "RBI Digital Lending Circular Analysis",
    status: "Review Required",
    date: "2026-04-08",
    impactScore: 92,
    trend: "up",
    author: "ACRIS Neural Ledger"
  },
  {
    id: "REP-2026-003",
    title: "Monthly Conflict Mitigation Audit",
    status: "Finalized",
    date: "2026-03-31",
    impactScore: 12,
    trend: "down",
    author: "Compliance Protocol VII"
  }
];

export default function ImpactReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportList, setReportList] = useState(reports);

  const handleGenerate = () => {
    setIsGenerating(true);
    toast.info("Synthesizing multi-modal impact data...", { duration: 3000 });
    
    setTimeout(() => {
      setIsGenerating(false);
      const newReport = {
        id: `REP-2026-${Math.floor(Math.random() * 900) + 100}`,
        title: "Dynamic Regulatory Impact Report",
        status: "Finalized",
        date: new Date().toISOString().split('T')[0],
        impactScore: 78,
        trend: "up",
        author: "ACRIS Neural Engine"
      };
      setReportList([newReport, ...reportList]);
      toast.success("Executive report finalized and cryptographically signed.");
    }, 4000);
  };

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-[0.5px] border-border/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="tech-label px-2 py-0.5 bg-amber-primary/10 text-amber-primary">EXECUTIVE INTELLIGENCE</span>
            <span className="h-[1px] w-12 bg-border/30" />
          </div>
          <h1 className="text-4xl font-serif tracking-tight text-foreground">
            Impact Reports
          </h1>
          <p className="text-muted-foreground font-sans text-sm mt-2 max-w-xl">
            Synthesized regulatory summaries and long-term compliance health tracking.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-3 px-6 py-2.5 bg-surface-container-low border-[0.5px] border-border/30 text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-high transition-all">
            <Filter className="h-4 w-4" />
            Filter Archive
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-3 px-8 py-3 metallic-gold text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl shadow-amber-primary/20 disabled:opacity-50">
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck className="h-4 w-4" />}
            {isGenerating ? "GENERATING..." : "Generate New"}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Quarterly Health Score", value: "94.2", trend: "+2.4%", icon: TrendingUp, color: "text-emerald-600" },
          { label: "Active Mandates", value: "2,408", trend: "12 New", icon: Clock, color: "text-amber-600" },
          { label: "Pending Reviews", value: "03", trend: "High Priority", icon: AlertCircle, color: "text-destructive" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-surface-container-low border-[0.5px] border-border/20 p-6 relative overflow-hidden group">
            <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
              <stat.icon size={80} />
            </div>
            <span className="tech-label text-muted-foreground block mb-2">{stat.label}</span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-serif font-bold text-foreground">{stat.value}</span>
              <span className={cn("text-[10px] font-mono font-bold", stat.color)}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Reports Table */}
      <div className="flex-1 bg-surface-container-low border-[0.5px] border-border/20 flex flex-col overflow-hidden">
        <div className="grid grid-cols-12 px-8 py-4 border-b-[0.5px] border-border/10 bg-surface-container-lowest/50">
          <div className="col-span-1 tech-label text-muted-foreground">ID</div>
          <div className="col-span-5 tech-label text-muted-foreground">REPORT TITLE</div>
          <div className="col-span-2 tech-label text-muted-foreground">STATUS</div>
          <div className="col-span-2 tech-label text-muted-foreground">IMPACT</div>
          <div className="col-span-2 tech-label text-muted-foreground text-right">DATE</div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {reportList.map((report) => (
            <motion.div 
              key={report.id}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.4)" }}
              className="grid grid-cols-12 px-8 py-6 border-b-[0.5px] border-border/5 items-center cursor-pointer group"
            >
              <div className="col-span-1 font-mono text-[11px] text-muted-foreground">{report.id}</div>
              <div className="col-span-5 pr-8">
                <h4 className="text-sm font-bold text-foreground group-hover:text-amber-primary transition-colors">{report.title}</h4>
                <p className="text-[10px] text-muted-foreground font-sans mt-1">Authored by {report.author}</p>
              </div>
              <div className="col-span-2">
                <span className={cn(
                  "tech-label px-2 py-0.5 inline-block",
                  report.status === "Finalized" ? "bg-emerald-50 text-emerald-700" : "bg-primary/10 text-primary"
                )}>
                  {report.status}
                </span>
              </div>
              <div className="col-span-2 flex items-center gap-3">
                 <div className="h-1.5 w-16 bg-border/20 relative overflow-hidden">
                   <div 
                    className={cn("absolute left-0 top-0 h-full", 
                      report.impactScore > 50 ? "bg-destructive" : "bg-amber-primary"
                    )} 
                    style={{ width: `${report.impactScore}%` }} 
                   />
                 </div>
                 <span className="font-mono text-[11px]">{report.impactScore}</span>
              </div>
              <div className="col-span-2 text-right flex items-center justify-end gap-3 text-muted-foreground">
                <span className="font-mono text-[11px]">{report.date}</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t-[0.5px] border-border/10 flex justify-end gap-4 bg-surface-container-lowest/30">
           <button className="flex items-center gap-2 px-4 py-2 hover:bg-surface-container-high transition-all text-muted-foreground">
             <Download className="h-4 w-4" />
             <span className="tech-label">BATCH EXPORT</span>
           </button>
        </div>
      </div>
    </div>
  );
}
