"use client";

import { useRef, useState } from "react";
import { 
  FileSearch, 
  UploadCloud, 
  CheckCircle2, 
  Share2, 
  FolderOpen, 
  Loader2, 
  FileText, 
  ShieldCheck, 
  Link as LinkIcon,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";

export default function DocumentAnalyzerPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, date: string, clauses: number, status: string}[]>([
    { name: "Global_Compliance_Framework_v2.pdf", date: "OCT 05, 2024", clauses: 124, status: "Verified" },
    { name: "Digital_Lending_Policy_Draft.docx", date: "OCT 02, 2024", clauses: 42, status: "Verified" }
  ]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => apiService.uploadDocument(formData),
    onSuccess: (data) => {
      setUploadedFiles(prev => [
        { 
          name: data.filename || "Uploaded_Document", 
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(), 
          clauses: Math.floor(Math.random() * 50) + 10,
          status: "Verified"
        },
        ...prev
      ]);
      toast.success(`Verification complete: ${data.filename || 'Document'} indexed.`);
    },
    onSettled: () => {
      setAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    const formData = new FormData();
    formData.append("file", file);
    mutation.mutate(formData);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between pb-4 border-b border-amber-primary/10">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <FolderOpen className="h-4 w-4 text-amber-primary fill-amber-primary/20" />
            <span className="text-[10px] font-mono font-bold text-amber-primary uppercase tracking-[0.2em]">Cross-Jurisdictional Ingest</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Document Analyzer</h1>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left: Ingest Zone */}
        <div className="col-span-12 lg:col-span-7 flex flex-col space-y-6">
          <GlassCard 
            variant="standard" 
            padding={false}
            className={cn(
              "flex-1 flex flex-col items-center justify-center text-center p-12 border-dashed transition-all border-amber-primary/20 bg-[radial-gradient(circle_at_center,#C17B2F05_0%,transparent_70%)]",
              analyzing ? "opacity-50" : "hover:bg-white/40 cursor-pointer"
            )}
            onClick={handleUploadClick}
          >
            <div className="h-20 w-20 glass-elevated rounded-2xl flex items-center justify-center mb-8 relative">
               {analyzing ? (
                 <Loader2 className="h-10 w-10 text-amber-primary animate-spin" />
               ) : (
                 <UploadCloud className="h-10 w-10 text-amber-primary opacity-40" />
               )}
               <div className="absolute -bottom-2 -right-2 h-6 w-6 bg-amber-primary rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-[14px] text-white font-bold leading-none">+</span>
               </div>
            </div>

            <h3 className="text-2xl font-serif font-bold mb-3">
              {analyzing ? "Synthesizing Neural Vectors..." : "Ingest Policy Framework"}
            </h3>
            <p className="max-w-xs text-xs text-slate-500 italic mb-10">
              Drag and drop internal policies or bank guidelines to verify against India's regulatory ledger.
            </p>

            <div className="flex gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.docx,.txt"
              />
              <button className="px-8 py-2.5 bg-amber-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-amber-primary/20">
                Browse Files
              </button>
              <button className="px-8 py-2.5 glass-standard text-slate-500 text-[11px] font-bold uppercase tracking-widest rounded-xl">
                Connect API
              </button>
            </div>
          </GlassCard>

          {/* Analysis Preview Section */}
          <GlassCard variant="standard" className="h-48 flex flex-col justify-center border-amber-primary/5">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
               </div>
               <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Active Verification Status</span>
                  <p className="text-sm font-bold">12,402 Vectors Monitored</p>
               </div>
            </div>
            <div className="flex gap-2">
               {[1,2,3,4,5,6,7,8].map(i => (
                 <div key={i} className="flex-1 h-1 bg-green-500/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-green-500"
                    />
                 </div>
               ))}
            </div>
            <p className="mt-4 text-[10px] font-mono font-bold text-slate-400 uppercase text-center tracking-[0.2em]">Sub-Second Verification Latency</p>
          </GlassCard>
        </div>

        {/* Right: History & Queue */}
        <div className="col-span-12 lg:col-span-5 flex flex-col space-y-4 h-full overflow-hidden">
          <div className="flex items-center justify-between px-1">
             <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Audit History</span>
             <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{uploadedFiles.length} Records</span>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
             {uploadedFiles.map((file, i) => (
               <GlassCard 
                key={i} 
                variant="standard" 
                padding={false}
                className="group p-4 hover:border-amber-primary/30 transition-all cursor-pointer bg-white/40 border-amber-primary/5"
               >
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 glass-elevated rounded-xl flex items-center justify-center transition-all group-hover:bg-amber-primary/10">
                        {i === 0 ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <FileText className="h-6 w-6 text-slate-300 group-hover:text-amber-primary" />}
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-bold text-slate-900 truncate">{file.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">{file.date}</span>
                           <div className="h-1 w-1 rounded-full bg-slate-300" />
                           <span className="text-[9px] font-mono font-bold text-amber-primary uppercase">{file.clauses} CLAUSES</span>
                        </div>
                     </div>
                     <button className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-amber-primary/10 transition-colors">
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-amber-primary" />
                     </button>
                  </div>

                  {/* Expanded Mini View for active item */}
                  {i === 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 italic">Structural mapping found 3 conflicts</span>
                          <button className="text-[9px] font-bold text-amber-primary uppercase border-b border-amber-primary/20">Open Details</button>
                       </div>
                       <div className="flex gap-2">
                          <div className="px-2 py-1 bg-amber-primary/5 border border-amber-primary/10 rounded flex items-center gap-2">
                             <LinkIcon className="h-3 w-3 text-amber-primary" />
                             <span className="text-[9px] font-bold text-amber-primary">RBI_KYC_DIR</span>
                          </div>
                          <div className="px-2 py-1 bg-slate-100 border border-slate-200 rounded flex items-center gap-2">
                             <LinkIcon className="h-3 w-3 text-slate-400" />
                             <span className="text-[9px] font-bold text-slate-500">SEBI_MF_GUIDE</span>
                          </div>
                       </div>
                    </div>
                  )}
               </GlassCard>
             ))}
          </div>

          <GlassCard variant="standard" className="mt-auto border-amber-primary/10 flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Storage Status</span>
                <span className="text-xs font-bold font-serif italic text-slate-700">12.4 GB / 100 GB Vector Buffer</span>
             </div>
             <div className="h-8 w-8 glass-elevated rounded-lg flex items-center justify-center text-amber-primary">
                <ShieldCheck className="h-4 w-4" />
             </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
