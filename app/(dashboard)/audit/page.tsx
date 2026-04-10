"use client";

import { History, Search, Filter, ShieldCheck, Download, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AuditPage() {
  const auditLogs = [
    { event: "Policy Amendment Created", user: "Advocate Singh", timestamp: "2024-10-06 14:22:10", entity: "AMD-104", status: "Commited" },
    { event: "Regulatory Vector Sync", user: "System (ACRIS)", timestamp: "2024-10-06 12:00:00", entity: "RBI-KYC-VECTOR", status: "Success" },
    { event: "Document Analysis Triggered", user: "Officer Mehra", timestamp: "2024-10-05 18:45:12", entity: "NBFC-GUIDE-V4", status: "Verified" }
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-end justify-between pb-4 border-b border-amber-primary/10">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <History className="h-4 w-4 text-amber-primary fill-amber-primary/20" />
            <span className="text-[10px] font-mono font-bold text-amber-primary uppercase tracking-[0.2em]">Immutable Record Ledger</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Audit Trail</h1>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
               type="text" 
               placeholder="Search ledger by transaction ID, user or vector..."
               className="w-full bg-white/40 border border-white/60 py-2.5 pl-10 pr-4 rounded-xl text-xs outline-none focus:border-amber-primary/30"
            />
         </div>
         <button className="px-4 py-2.5 glass-standard text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-2">
            <Filter className="h-3.5 w-3.5" />
            Filter
         </button>
      </div>

      <GlassCard variant="standard" padding={false} className="flex-1 overflow-hidden border-amber-primary/5 flex flex-col">
         <div className="grid grid-cols-5 bg-slate-50/20 border-b border-slate-100 p-4">
            {["Event Description", "Authority/User", "Timestamp", "Linked Entity", "Registry Status"].map((h, i) => (
              <span key={i} className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">{h}</span>
            ))}
         </div>
         <div className="flex-1 overflow-y-auto no-scrollbar">
            {auditLogs.map((log, i) => (
              <div key={i} className="grid grid-cols-5 p-4 border-b border-slate-50 hover:bg-white/40 transition-colors items-center">
                 <span className="text-xs font-bold text-slate-900">{log.event}</span>
                 <span className="text-xs text-slate-500 italic font-serif">{log.user}</span>
                 <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                 <span className="text-[10px] font-mono font-bold text-amber-primary">{log.entity}</span>
                 <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-bold text-green-600 uppercase">{log.status}</span>
                 </div>
              </div>
            ))}
         </div>
         <div className="p-4 bg-slate-50/20 border-t border-slate-100 flex justify-center">
            <button className="text-[9px] font-bold text-slate-400 hover:text-amber-primary uppercase tracking-widest flex items-center gap-2">
               Load More Sequences <ExternalLink className="h-3 w-3" />
            </button>
         </div>
      </GlassCard>
    </div>
  );
}
