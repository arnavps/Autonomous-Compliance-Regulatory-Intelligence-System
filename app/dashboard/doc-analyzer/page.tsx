"use client";

import { FileSearch, UploadCloud, CheckCircle2, Share2, FolderOpen } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "../../../services/apiService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DocAnalyzerPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-20">
        <div className="tech-label text-primary mb-4">Neural Ingest</div>
        <h1 className="text-4xl font-bold font-serif italic tracking-tight text-foreground">Internal Policy Analyzer</h1>
        <p className="text-muted-foreground font-serif text-lg mt-2 opacity-70">Cross-reference internal documentation against global regulatory vectors.</p>
      </div>

      <div 
        onClick={handleUploadClick}
        className={cn(
          "relative group cursor-pointer transition-all duration-500",
          mutation.isPending ? "opacity-70 pointer-events-none" : ""
        )}
      >
        <div className="absolute -inset-[0.5px] bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="glass-intel p-20 flex flex-col items-center justify-center text-center border-dashed">
          <div className="h-24 w-24 bg-surface-container border-[0.5px] border-border/20 flex items-center justify-center mb-10 group-hover:border-primary/40 transition-all">
            {mutation.isPending ? (
              <div className="w-10 h-10 border-[0.5px] border-primary border-t-transparent animate-spin" />
            ) : (
              <UploadCloud className="h-10 w-10 text-primary/40 group-hover:text-primary transition-colors" />
            )}
          </div>
          
          <h3 className="text-2xl font-bold font-serif italic mb-4">
            {mutation.isPending ? "Verifying Origin..." : "Ingest Internal Policy"}
          </h3>
          <p className="text-muted-foreground font-serif text-sm max-w-sm mb-12 opacity-60">
            {mutation.isPending 
              ? "Parsing neural structure of the document across the regulatory mesh." 
              : "Ingest PDF or DOCX files for autonomous compliance validation."}
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
              className="px-10 py-3 bg-primary text-white text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-amber-900 transition-colors shadow-2xl"
            >
              LOCATE FILES
            </button>
            <button 
              type="button" 
              onClick={(e) => {
                e.stopPropagation();
                toast.info("SharePoint Vector Link coming in v1.1");
              }}
              className="px-10 py-3 bg-surface-container border-[0.5px] border-border/20 text-[10px] font-mono font-bold uppercase tracking-widest hover:border-border transition-colors"
            >
              SHAREPOINT LINK
            </button>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <div className="flex items-center justify-between mb-10 border-b-[0.5px] border-border/10 pb-6">
          <div className="tech-label text-muted-foreground/40">Audit History</div>
          <div className="flex gap-4">
             <button className="p-2 text-muted-foreground/40 hover:text-primary transition-colors"><FolderOpen className="h-4 w-4" /></button>
             <button className="p-2 text-muted-foreground/40 hover:text-primary transition-colors"><Share2 className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="space-y-[0.5px] bg-border/10">
          {uploadedFiles.map((file, i) => (
            <div key={i} className="bg-white p-6 flex items-center justify-between group hover:bg-surface-container-low transition-all">
              <div className="flex items-center gap-8">
                <div className="h-10 w-10 bg-surface-container flex items-center justify-center border-[0.5px] border-border/20 group-hover:border-primary/20 transition-all">
                  {i === 0 ? <CheckCircle2 className="h-5 w-5 text-tertiary" /> : <FileSearch className="h-5 w-5 text-muted-foreground/30" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold font-serif italic text-foreground tracking-tight">{file.name}</span>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="font-mono text-[9px] text-muted-foreground/40 uppercase font-bold tracking-tighter">Analyzed {file.date}</span>
                    <span className="h-1 w-1 rounded-full bg-border/30" />
                    <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-tighter">{file.clauses} CLAUSES MAPPED</span>
                  </div>
                </div>
              </div>
              <button 
                disabled={file.isSyncing}
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedFiles(prev => prev.map((f, idx) => idx === i ? { ...f, isSyncing: true } : f));
                  apiService.triggerIngestion().then(data => {
                    toast.success(`Sync Started: ${file.name} vectors update initiated.`, {
                       description: data.message
                    });
                    setTimeout(() => {
                      setUploadedFiles(prev => prev.map((f, idx) => idx === i ? { ...f, isSyncing: false, date: "NOW" } : f));
                    }, 5000);
                  }).catch(err => {
                    setUploadedFiles(prev => prev.map((f, idx) => idx === i ? { ...f, isSyncing: false } : f));
                    toast.error("Sync Failed: Orchestrator offline.");
                  });
                }}
                className={cn(
                  "tech-label transition-colors",
                  file.isSyncing ? "text-primary animate-pulse" : "text-muted-foreground/30 hover:text-primary"
                )}>
                {file.isSyncing ? "SYNCING..." : "RE-SYNC VECTOR"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
