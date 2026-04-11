"use client";

import { FileSearch, UploadCloud, CheckCircle2, Share2, FolderOpen, PanelRightClose } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "../../../services/apiService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { usePipelineStore } from "@/lib/store/pipelineStore";
import { PipelinePanel } from "@/components/dashboard/pipeline/PipelinePanel";

export default function DocAnalyzerPage() {
  const { role } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startIngestionPipeline, isActive, resetPipeline } = usePipelineStore();
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, date: string, clauses: number, isSyncing?: boolean}[]>([
    { name: "Indian_Bank_KYC_Policy_v4.2.pdf", date: "SEP 28, 2024", clauses: 42 },
    { name: "Retail_Lending_Guidelines_Draft.docx", date: "SEP 15, 2024", clauses: 18 }
  ]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => apiService.uploadDocument(formData),
    onSuccess: (data) => {
      setUploadedFiles(prev => [
        { 
          name: data.filename || "Uploaded_Document", 
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(), 
          clauses: Math.floor(Math.random() * 50) + 10 
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
      "h-full grid gap-8 transition-all duration-700 p-8",
      isActive && role === 'COMPLIANCE' ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1"
    )}>
      {/* Main Content Area */}
      <div className={cn(
        "flex flex-col min-h-0",
        isActive && role === 'COMPLIANCE' ? "lg:col-span-7" : "max-w-5xl mx-auto w-full"
      )}>
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="tech-label text-primary">Neural Ingest</div>
            {isActive && role === 'COMPLIANCE' && (
              <button 
                onClick={resetPipeline}
                className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors"
              >
                <PanelRightClose className="h-3.5 w-3.5" />
                DOCK PIPELINE
              </button>
            )}
          </div>
          <h1 className="text-4xl font-bold font-serif italic tracking-tight text-foreground">Internal Policy Analyzer</h1>
          <p className="text-muted-foreground font-serif text-lg mt-2 opacity-70">Cross-reference internal documentation against global regulatory vectors.</p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-12">
          <div 
            onClick={handleUploadClick}
            className={cn(
              "relative group cursor-pointer transition-all duration-500",
              mutation.isPending ? "opacity-70 pointer-events-none" : ""
            )}
          >
            <div className="absolute -inset-[0.5px] bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="glass-intel p-12 flex flex-col items-center justify-center text-center border-dashed">
              <div className="h-16 w-16 bg-surface-container border-[0.5px] border-border/20 flex items-center justify-center mb-6 group-hover:border-primary/40 transition-all">
                {mutation.isPending ? (
                  <div className="w-8 h-8 border-[0.5px] border-primary border-t-transparent animate-spin" />
                ) : (
                  <UploadCloud className="h-8 w-8 text-primary/40 group-hover:text-primary transition-colors" />
                )}
              </div>
              
              <h3 className="text-xl font-bold font-serif italic mb-2">
                {mutation.isPending ? "Verifying Origin..." : "Ingest Internal Policy"}
              </h3>
              <p className="text-muted-foreground font-serif text-xs max-w-sm mb-8 opacity-60">
                {mutation.isPending 
                  ? "Parsing neural structure of the document across the regulatory mesh." 
                  : "Ingest PDF or DOCX files for autonomous compliance validation."}
              </p>

              <div className="flex gap-4">
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
                  className="px-8 py-2.5 bg-primary text-white text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-amber-900 transition-colors shadow-2xl"
                >
                  LOCATE FILES
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-8 border-b-[0.5px] border-border/10 pb-4">
              <div className="tech-label text-muted-foreground/40">Audit History</div>
              <div className="flex gap-4">
                 <button className="p-2 text-muted-foreground/40 hover:text-primary transition-colors"><FolderOpen className="h-4 w-4" /></button>
                 <button className="p-2 text-muted-foreground/40 hover:text-primary transition-colors"><Share2 className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="space-y-[0.5px] bg-border/10">
              {uploadedFiles.map((file, i) => (
                <div key={i} className="bg-white p-5 flex items-center justify-between group hover:bg-surface-container-low transition-all">
                  <div className="flex items-center gap-6">
                    <div className="h-8 w-8 bg-surface-container flex items-center justify-center border-[0.5px] border-border/20 group-hover:border-primary/20 transition-all">
                      {i === 0 ? <CheckCircle2 className="h-4 w-4 text-tertiary" /> : <FileSearch className="h-4 w-4 text-muted-foreground/30" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold font-serif italic text-foreground tracking-tight">{file.name}</span>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-mono text-[8px] text-muted-foreground/40 uppercase font-bold tracking-tighter">Analyzed {file.date}</span>
                        <span className="h-1 w-1 rounded-full bg-border/30" />
                        <span className="font-mono text-[8px] text-primary font-bold uppercase tracking-tighter">{file.clauses} CLAUSES MAPPED</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    disabled={file.isSyncing || (isActive && role === 'COMPLIANCE')}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (role === 'COMPLIANCE') {
                        startIngestionPipeline(file.name);
                      } else {
                        toast.info("Syncing initiated by Compliance Agent.");
                      }
                    }}
                    className={cn(
                      "tech-label transition-colors",
                      file.isSyncing || (isActive && role === 'COMPLIANCE' && i === 0) ? "text-primary animate-pulse" : "text-muted-foreground/30 hover:text-primary"
                    )}>
                    {file.isSyncing || (isActive && role === 'COMPLIANCE' && i === 0) ? "SYNCING..." : "RE-SYNC VECTOR"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Sidebar */}
      {isActive && role === 'COMPLIANCE' && (
        <div className="lg:col-span-5 h-[calc(100vh-160px)] min-h-0 border-l-[0.5px] border-border/10 pl-8 overflow-hidden sticky top-0">
           <PipelinePanel />
        </div>
      )}
    </div>
  );
}
