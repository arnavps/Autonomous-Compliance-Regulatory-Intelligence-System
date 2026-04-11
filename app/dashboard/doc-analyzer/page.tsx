"use client";

import { FileSearch, UploadCloud, CheckCircle2, Share2, FolderOpen, PanelRightClose, ShieldAlert } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "../../../services/apiService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { usePipelineStore } from "@/lib/store/pipelineStore";
import { PipelinePanel } from "@/components/dashboard/pipeline/PipelinePanel";
import { motion, AnimatePresence } from "framer-motion";

export default function DocAnalyzerPage() {
  const { role } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startIngestionPipeline, isActive, resetPipeline } = usePipelineStore();
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, date: string, clauses: number, status: 'VERIFIED' | 'SYNCING' | 'PENDING'}[]>([
    { name: "Indian_Bank_KYC_Policy_v4.2.pdf", date: "SEP 28, 2024", clauses: 42, status: 'VERIFIED' },
    { name: "Retail_Lending_Guidelines_Draft.docx", date: "SEP 15, 2024", clauses: 18, status: 'VERIFIED' }
  ]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => apiService.uploadDocument(formData),
    onSuccess: (data) => {
      setUploadedFiles(prev => [
        { 
          name: data.filename || "Uploaded_Document", 
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(), 
          clauses: Math.floor(Math.random() * 50) + 10,
          status: 'VERIFIED'
        },
        ...prev
      ]);
      
      if (role === 'COMPLIANCE') {
        startIngestionPipeline(data.filename || "Document Analysis");
      }
      
      toast.success(`Verified: ${data.filename || 'Document'} is now indexed.`);
    },
    onSettled: () => {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    mutation.mutate(formData);
  };

  return (
    <div className={cn(
      "h-full grid gap-10 transition-all duration-1000 p-8 lg:p-12",
      isActive && role === 'COMPLIANCE' ? "lg:grid-cols-12" : "grid-cols-1"
    )}>
      {/* Main Content Area */}
      <div className={cn(
        "flex flex-col min-h-0",
        isActive && role === 'COMPLIANCE' ? "lg:col-span-7" : "max-w-6xl mx-auto w-full"
      )}>
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="tech-label text-amber-primary bg-amber-primary/5 px-3 py-1 border border-amber-primary/10">Neural Ingest</span>
              <span className="h-[0.5px] w-12 bg-border/20" />
            </div>
            {isActive && role === 'COMPLIANCE' && (
              <button 
                onClick={resetPipeline}
                className="flex items-center gap-2 text-[10px] font-mono font-bold text-muted-foreground/60 hover:text-amber-primary transition-all group"
              >
                <PanelRightClose className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                DOCK PIPELINE
              </button>
            )}
          </div>
          <h1 className="text-5xl font-extrabold font-serif italic tracking-tight text-foreground">
            Policy <span className="text-amber-primary">Analyzer</span>
          </h1>
          <p className="max-w-xl text-muted-foreground font-serif text-xl mt-4 leading-relaxed opacity-80">
            Cross-reference internal documentation against the global regulatory mesh with autonomous verification.
          </p>
        </motion.div>

        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-16">
          {/* Upload Zone */}
          <motion.div 
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            onClick={handleUploadClick}
            className={cn(
              "relative group cursor-pointer transition-all duration-500",
              mutation.isPending ? "opacity-70 pointer-events-none" : ""
            )}
          >
            <div className="absolute -inset-[0.5px] bg-gradient-to-br from-amber-primary/10 via-transparent to-amber-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm" />
            <div className="glass-intel p-16 flex flex-col items-center justify-center text-center border-[0.5px] border-border/20 group-hover:border-amber-primary/30 shadow-sm group-hover:shadow-2xl transition-all">
              <div className="h-20 w-20 bg-surface-container-low border-[0.5px] border-border/20 flex items-center justify-center mb-8 group-hover:border-amber-primary/40 group-hover:bg-white transition-all shadow-inner">
                {mutation.isPending ? (
                  <div className="w-10 h-10 border-[1px] border-amber-primary border-t-transparent animate-spin" />
                ) : (
                  <UploadCloud className="h-10 w-10 text-amber-primary/30 group-hover:text-amber-primary transition-all" />
                )}
              </div>
              
              <h3 className="text-2xl font-bold font-serif italic mb-3 text-foreground">
                {mutation.isPending ? "Decrypting Neural Structure..." : "Ingest Internal Policy"}
              </h3>
              <p className="text-muted-foreground font-serif text-sm max-w-sm mb-10 opacity-70 italic leading-relaxed">
                {mutation.isPending 
                  ? "Mapping clauses across active regulatory vectors in the institutional ledger." 
                  : "Drop PDF or DOCX files here for autonomous compliance stress-testing."}
              </p>

              <div className="flex gap-6">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,.docx,.txt"
                />
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadClick();
                  }}
                  className="px-10 py-3.5 bg-foreground text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-amber-primary transition-all"
                >
                  LOCATE SOURCE FILES
                </button>
              </div>
            </div>
          </motion.div>

          {/* History Ledger */}
          <div className="pb-12">
            <div className="flex items-center justify-between mb-10 border-b-[0.5px] border-border/20 pb-6">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-amber-primary shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                <div className="tech-label text-foreground/80">Institutional Audit Ledger</div>
              </div>
              <div className="flex gap-4">
                 <button className="p-2.5 text-muted-foreground/40 hover:text-amber-primary hover:bg-amber-primary/5 rounded-full transition-all border border-transparent hover:border-amber-primary/10"><FolderOpen className="h-4 w-4" /></button>
                 <button className="p-2.5 text-muted-foreground/40 hover:text-amber-primary hover:bg-amber-primary/5 rounded-full transition-all border border-transparent hover:border-amber-primary/10"><Share2 className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="space-y-[1px] bg-border/10 overflow-hidden shadow-2xl border-[0.5px] border-border/10">
              <AnimatePresence>
                {uploadedFiles.map((file, i) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={file.name} 
                    className="bg-white p-7 flex items-center justify-between group hover:bg-amber-primary/[0.02] transition-all relative"
                  >
                    <div className="flex items-center gap-8">
                      <div className="h-10 w-10 bg-surface-container-low flex items-center justify-center border-[0.5px] border-border/20 group-hover:border-amber-primary/20 group-hover:bg-white transition-all shadow-sm">
                        {file.status === 'VERIFIED' ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <FileSearch className="h-5 w-5 text-amber-primary animate-pulse" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-bold font-serif italic text-foreground tracking-tight group-hover:text-amber-primary transition-colors">{file.name}</span>
                        <div className="flex items-center gap-4 mt-1.5">
                          <span className="font-mono text-[9px] text-muted-foreground/50 uppercase font-bold tracking-widest">{file.date}</span>
                          <span className="h-1 w-1 rounded-full bg-border/40" />
                          <span className="flex items-center gap-1.5 font-mono text-[9px] text-amber-primary font-bold uppercase tracking-widest">
                            <ShieldAlert className="h-3 w-3" />
                            {file.clauses} Neural Vectors
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      disabled={isActive && role === 'COMPLIANCE'}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (role === 'COMPLIANCE') {
                          startIngestionPipeline(file.name);
                        } else {
                          toast.info("Synchronization managed by Compliance Agent.");
                        }
                      }}
                      className={cn(
                        "tech-label px-4 py-1.5 border-[0.5px] transition-all",
                        isActive && role === 'COMPLIANCE' && i === 0 
                          ? "bg-amber-primary/10 border-amber-primary/30 text-amber-primary animate-pulse" 
                          : "bg-surface-container-low border-border/20 text-muted-foreground/40 hover:text-amber-primary hover:border-amber-primary/30 hover:bg-white"
                      )}>
                      {isActive && role === 'COMPLIANCE' && i === 0 ? "ANALYZING..." : "RE-SYNC"}
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Sidebar */}
      {isActive && role === 'COMPLIANCE' && (
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 h-[calc(100vh-160px)] min-h-0 border-l-[0.5px] border-border/10 pl-10 overflow-hidden sticky top-0"
        >
           <PipelinePanel />
        </motion.div>
      )}
    </div>
  );
}
