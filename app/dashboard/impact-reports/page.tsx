"use client";

import { 
  FileCheck, 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Clock,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Brain,
  History,
  Activity,
  ArrowRight,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiService } from "@/services/apiService";
import { useAuth } from "@/lib/auth-context";

const reports = [
  {
    id: "REP-2026-001",
    title: "Q1 Regulatory Compliance Summary",
    status: "Finalized",
    date: "2026-04-01",
    impactScore: 84,
    trend: "up",
    author: "ACRIS Intelligence Agent",
    confidence: 0.98
  },
  {
    id: "REP-2026-002",
    title: "RBI Digital Lending Circular Analysis",
    status: "Review Required",
    date: "2026-04-08",
    impactScore: 92,
    trend: "up",
    author: "ACRIS Neural Ledger",
    confidence: 0.94
  },
  {
    id: "REP-2026-003",
    title: "Monthly Conflict Mitigation Audit",
    status: "Finalized",
    date: "2026-03-31",
    impactScore: 12,
    trend: "down",
    author: "Compliance Protocol VII",
    confidence: 0.99
  }
];

export default function ImpactReportsPage() {
  const { role } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportList, setReportList] = useState(reports);
  const [activeTab, setActiveTab] = useState("all");

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast.info("Synthesizing multi-modal impact data...", { 
      description: "Engaging Neural Orchestration Pipeline",
      duration: 3000 
    });
    
    try {
      const response = await apiService.triggerImpactReport({ type: "EXECUTIVE_SUMMARY" });
      const task_id = response.task_id;

      // Poll for completion
      await apiService.pollTaskStatus(task_id, (status) => {
        if (status.state === "SUCCESS") {
          setIsGenerating(false);
          const newReport = {
            id: `REP-${task_id.substring(0, 8).toUpperCase()}`,
            title: "Dynamic Regulatory Impact Report",
            status: "Finalized",
            date: new Date().toISOString().split('T')[0],
            impactScore: Math.floor(Math.random() * 30) + 60,
            trend: "up",
            author: "ACRIS Neural Engine",
            confidence: 0.97
          };
          setReportList(prev => [newReport, ...prev]);
          toast.success("Executive report finalized and cryptographically signed.");
        }
      });

    } catch (err: any) {
      setIsGenerating(false);
      toast.error("Synthesis Failed", { description: err.message || "Impact engine not responding." });
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body p-8 lg:p-12 animate-in fade-in duration-1000">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12 pb-8 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-label font-bold uppercase tracking-widest border border-primary/20">
              Executive Intelligence Hub
            </span>
            <span className="h-[1px] w-8 bg-outline-variant/30" />
            <div className="flex items-center gap-2">
               <Activity size={12} className={cn("text-primary", isGenerating && "animate-pulse")} />
               <span className="text-[9px] font-label font-bold uppercase tracking-wider text-stone-400">
                 {isGenerating ? "Synthesis in Progress" : "Archives Synced"}
               </span>
            </div>
          </div>
          <h1 className="font-headline text-5xl font-bold text-on-surface tracking-tight mb-2 italic">Impact Reports</h1>
          <p className="text-stone-500 font-serif text-lg max-w-2xl opacity-70">
            Synthesized regulatory summaries and institutional compliance health tracking generated via Neural Orchestration.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-surface-container-high border border-outline-variant/30 text-[10px] font-label font-bold uppercase tracking-widest flex items-center hover:bg-surface-container-highest transition-all group">
            <Filter size={14} className="mr-3 text-stone-400 group-hover:text-primary transition-colors" /> Filter Archive
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-8 py-3 bg-primary text-on-primary text-[10px] font-label font-bold uppercase tracking-widest flex items-center shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
          >
            {isGenerating ? (
              <Loader2 size={12} className="mr-3 animate-spin" />
            ) : (
              <Brain size={12} className="mr-3 fill-white" />
            )}
            {isGenerating ? "Synthesizing..." : "Generate Intelligence"}
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <ReportMetric 
          label="Quarterly Health Index" 
          value="94.2" 
          trend="+2.4%" 
          icon={<TrendingUp size={18} className="text-primary" />}
          footer="Institutional goal: 90.0"
        />
        <ReportMetric 
          label="Active Surveillance Mandates" 
          value="2,408" 
          trend="12 New" 
          icon={<Activity size={18} className="text-secondary" />}
          footer="Tracking across 4 regions"
        />
        <ReportMetric 
          label="Pending Neural Reviews" 
          value="03" 
          trend="Critical" 
          icon={<AlertCircle size={18} className="text-error" />}
          footer="Estimated review time: 4m"
          variant="error"
        />
      </div>

      {/* Main Table Content */}
      <div className="glass-panel amber-glow border-l-2 border-primary">
        <div className="flex border-b border-outline-variant/10">
          {["All Reports", "Drafts", "Archived", "Neural Signs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={cn(
                "px-8 py-4 text-[10px] font-label font-bold uppercase tracking-widest border-r border-outline-variant/10 transition-colors hover:bg-surface-container-low",
                activeTab === tab.toLowerCase() ? "bg-surface-container text-primary" : "text-stone-400"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-surface-container-lowest/50">
                <th className="px-8 py-5 text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">Identity</th>
                <th className="px-8 py-5 text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">Report Narrative</th>
                <th className="px-8 py-5 text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">Neural Status</th>
                <th className="px-8 py-5 text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold">Impact Mesh</th>
                <th className="px-8 py-5 text-[10px] font-label text-stone-500 uppercase tracking-widest font-bold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              <AnimatePresence mode="popLayout">
                {reportList.map((report, idx) => (
                  <motion.tr 
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-surface-container-low/50 transition-colors duration-300 cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-surface-container flex items-center justify-center border border-outline-variant/20 rounded-sm">
                          <FileText size={16} className="text-stone-400 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="font-mono text-[11px] text-stone-400 group-hover:text-primary transition-colors">{report.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <h4 className="font-headline font-bold text-lg text-on-surface mb-1 group-hover:text-primary transition-colors">
                          {report.title}
                        </h4>
                        <div className="flex items-center gap-2">
                           <Brain size={10} className="text-primary opacity-50" />
                           <span className="text-[10px] text-stone-400 font-serif italic tracking-tight">{report.author}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 text-[9px] font-label font-bold uppercase tracking-widest",
                          report.status === "Finalized" ? "bg-primary/10 text-primary border border-primary/20" : "bg-amber-100/50 text-amber-700 border border-amber-200"
                        )}>
                          {report.status}
                        </span>
                        {report.status === "Finalized" && <ShieldCheck size={12} className="text-primary" />}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-1.5 w-24 bg-surface-container-highest relative overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${report.impactScore}%` }}
                            className={cn(
                              "absolute left-0 top-0 h-full",
                              report.impactScore > 75 ? "bg-error" : "bg-primary"
                            )} 
                          />
                        </div>
                        <div className="flex flex-col">
                           <span className="font-mono text-[11px] font-bold text-on-surface">{report.impactScore}%</span>
                           <span className="text-[8px] font-label uppercase tracking-tighter opacity-50">Impact Factor</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-mono text-[11px] text-on-surface">{report.date}</span>
                        <div className="flex items-center gap-2 text-[10px] font-label font-bold text-stone-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                          Review Report <ChevronRight size={10} className="mt-[-1px]" />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Action Bar */}
        <div className="p-4 border-t border-outline-variant/10 bg-surface-container-lowest/30 flex justify-between items-center">
           <p className="text-[10px] font-label text-stone-400 uppercase tracking-widest font-bold px-4">
             {reportList.length} Intelligence Units Archived
           </p>
           <button className="flex items-center gap-3 px-6 py-2.5 bg-surface-container-high border border-outline-variant/30 text-[10px] font-label font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-all group">
             <Download size={14} className="text-stone-400 group-hover:text-primary" />
             Batch Export Archives
           </button>
        </div>
      </div>
    </div>
  );
}

function ReportMetric({ label, value, trend, icon, footer, variant }: any) {
  return (
    <div className={cn(
      "glass-panel p-8 border-l-2 amber-glow transition-all hover:-translate-y-1 group",
      variant === 'error' ? 'border-error' : 'border-primary'
    )}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-label uppercase tracking-widest text-stone-500 font-bold">{label}</p>
        <div className="opacity-40 group-hover:opacity-100 transition-opacity">{icon}</div>
      </div>
      
      <div className="flex items-baseline gap-3 mb-6">
        <h3 className="font-headline text-4xl font-bold tracking-tight">{value}</h3>
        <span className={cn(
          "text-[10px] font-label font-bold",
          variant === 'error' ? 'text-error' : 'text-primary'
        )}>{trend}</span>
      </div>

      <p className="text-[10px] font-label text-stone-400 uppercase tracking-widest font-bold pt-4 border-t border-outline-variant/10">
        {footer}
      </p>
    </div>
  );
}
