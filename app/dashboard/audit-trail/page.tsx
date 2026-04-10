"use client";

import { 
  History, 
  Search, 
  Download, 
  ShieldCheck, 
  User, 
  Fingerprint,
  Calendar,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const auditLogs = [
  {
    timestamp: "2026-04-10 14:22:01",
    action: "Policy Override",
    entity: "Section 4.2 Indemnification",
    user: "Senior Legal Counsel",
    id: "LOG-9921",
    status: "Verified",
    hash: "0x4f2...a1b2"
  },
  {
    timestamp: "2026-04-10 12:05:44",
    action: "Document Signature",
    entity: "Master Services Agreement - Alpha Corp",
    user: "System Agent (Auto-Sign)",
    id: "LOG-9920",
    status: "Verified",
    hash: "0x88d...ff34"
  },
  {
    timestamp: "2026-04-09 18:30:12",
    action: "Compliance Approval",
    entity: "Q1 Impact Statement",
    user: "Compliance Officer",
    id: "LOG-9919",
    status: "Flagged",
    hash: "0xcc4...9e10"
  }
];

export default function AuditTrailPage() {
  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-[0.5px] border-border/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="tech-label px-2 py-0.5 bg-slate-100 text-slate-600">IMMUTABLE EVIDENCE LOG</span>
            <span className="h-[1px] w-12 bg-border/30" />
          </div>
          <h1 className="text-4xl font-serif tracking-tight text-foreground">
            Audit Trail
          </h1>
          <p className="text-muted-foreground font-sans text-sm mt-2 max-w-xl">
            Cryptographically signed record of all regulatory actions, overrides, and legal decisions.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white border-[0.5px] border-border/30 px-4 py-2">
             <Search className="h-4 w-4 text-muted-foreground mr-3" />
             <input type="text" placeholder="Search by Hash or ID" className="bg-transparent outline-none text-xs w-48 font-mono" />
          </div>
          <button className="flex items-center gap-3 px-8 py-3 bg-foreground text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all">
             <Download className="h-4 w-4" />
             Export Ledger
          </button>
        </div>
      </div>

      {/* Audit Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
         {[
           { label: "Total Events", value: "12,408" },
           { label: "Verified Claims", value: "100%", color: "text-emerald-600" },
           { label: "Policy Overrides", value: "24" },
           { label: "Neural Attestations", value: "8,291" }
         ].map((stat, i) => (
           <div key={i} className="p-6 bg-surface-container-low border-[0.5px] border-border/20">
              <span className="tech-label text-muted-foreground block mb-2">{stat.label}</span>
              <span className={cn("text-2xl font-serif font-bold", stat.color)}>{stat.value}</span>
           </div>
         ))}
      </div>

      {/* Ledger Table */}
      <div className="flex-1 bg-surface-container-low border-[0.5px] border-border/20 flex flex-col overflow-hidden">
        <div className="grid grid-cols-12 px-8 py-4 border-b-[0.5px] border-border/10 bg-surface-container-lowest/50">
          <div className="col-span-2 tech-label text-muted-foreground">TIMESTAMP</div>
          <div className="col-span-2 tech-label text-muted-foreground">ACTION</div>
          <div className="col-span-3 tech-label text-muted-foreground">ENTITY / TARGET</div>
          <div className="col-span-2 tech-label text-muted-foreground">ACTOR</div>
          <div className="col-span-2 tech-label text-muted-foreground">CERTIFICATE</div>
          <div className="col-span-1 tech-label text-muted-foreground text-right">INFO</div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {auditLogs.map((log) => (
             <motion.div 
               key={log.id}
               whileHover={{ backgroundColor: "rgba(255,255,255,0.4)" }}
               className="grid grid-cols-12 px-8 py-6 border-b-[0.5px] border-border/5 items-center group cursor-pointer"
             >
                <div className="col-span-2 font-mono text-[10px] text-muted-foreground flex items-center gap-2">
                   <Calendar size={12} />
                   {log.timestamp}
                </div>
                <div className="col-span-2">
                   <span className="text-[11px] font-bold text-foreground">{log.action}</span>
                </div>
                <div className="col-span-3">
                   <span className="text-[11px] font-sans italic text-muted-foreground">{log.entity}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                   <User size={12} className="text-primary" />
                   <span className="text-[11px] font-sans">{log.user}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                   <Fingerprint size={12} className="text-emerald-500" />
                   <span className="font-mono text-[10px] opacity-40">{log.hash}</span>
                </div>
                <div className="col-span-1 text-right flex justify-end items-center gap-3">
                   <ExternalLink size={14} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
                   <ChevronRight size={14} className="text-muted-foreground/20" />
                </div>
             </motion.div>
           ))}
        </div>

        <div className="p-4 border-t-[0.5px] border-border/10 flex items-center justify-between bg-surface-container-lowest/30 px-8">
           <div className="flex items-center gap-4 text-[9px] font-mono text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              BLOCKCHAIN ATTESTATION: ACTIVE | NODE_COUNT: 12 | STATUS: SYNCED
           </div>
           <div className="flex gap-2">
              {[1, 2, 3, "...", 24].map((page, i) => (
                <button key={i} className="h-6 w-6 flex items-center justify-center border-[0.5px] border-border/20 text-[9px] font-mono hover:bg-white">
                  {page}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
