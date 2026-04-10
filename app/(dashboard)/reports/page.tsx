"use client";

import { FileCheck, Download, ExternalLink, Filter, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";

export default function ReportsPage() {
  const reports = [
    { title: "Quarterly Compliance Synthesis", type: "Full Audit", date: "SEP 2024", severity: "Low Risk", status: "Generated" },
    { title: "RBI Master Direction Impact", type: "Specific Vector", date: "AUG 2024", severity: "High Impact", status: "Signed" },
    { title: "Digital Lending Posture Report", type: "Early Warning", date: "JUL 2024", severity: "Optimized", status: "Generated" }
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between pb-4 border-b border-amber-primary/10">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <FileCheck className="h-4 w-4 text-amber-primary fill-amber-primary/20" />
            <span className="text-[10px] font-mono font-bold text-amber-primary uppercase tracking-[0.2em]">Institutional Certifications</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Impact Reports</h1>
        </div>

        <button 
          onClick={() => toast.success("Scheduling new impact report generation...")}
          className="flex items-center gap-2 px-6 py-2 bg-amber-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-amber-secondary transition-all shadow-lg shadow-amber-primary/20"
        >
          Schedule Batch Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {reports.map((report, i) => (
           <GlassCard 
            key={i} 
            variant="standard" 
            className="flex flex-col h-64 border-amber-primary/5 hover:border-amber-primary/20 transition-all group cursor-pointer"
           >
              <div className="flex items-center justify-between mb-4">
                 <div className="h-10 w-10 glass-elevated rounded-xl flex items-center justify-center text-amber-primary group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5" />
                 </div>
                 <span className={cn(
                   "text-[9px] font-bold px-1.5 py-0.5 rounded",
                   report.severity.includes("High") ? "bg-red-500 text-white" : "bg-green-500/10 text-green-600"
                 )}>
                    {report.severity.toUpperCase()}
                 </span>
              </div>
              
              <h3 className="text-[15px] font-bold text-slate-900 mb-1 group-hover:text-amber-primary transition-colors">{report.title}</h3>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-auto">{report.type}</p>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-300" />
                    <span className="text-[10px] font-mono font-bold text-slate-400">{report.date}</span>
                 </div>
                 <div className="flex gap-2">
                    <button className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400">
                       <Download className="h-4 w-4" />
                    </button>
                    <button className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-amber-primary/10 transition-colors text-amber-primary">
                       <ExternalLink className="h-4 w-4" />
                    </button>
                 </div>
              </div>
           </GlassCard>
         ))}
      </div>

      <GlassCard variant="standard" className="flex-1 border-amber-primary/5 flex flex-col items-center justify-center text-center opacity-40">
         <div className="h-16 w-16 glass-elevated rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-amber-primary/40" />
         </div>
         <h3 className="text-xl font-serif font-bold mb-2">Reports Repository Sturdy</h3>
         <p className="max-w-xs text-xs text-slate-500 italic">No pending report generations in the queue. All institutional vectors are currently certified.</p>
      </GlassCard>
    </div>
  );
}
