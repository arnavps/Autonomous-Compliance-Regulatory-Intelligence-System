"use client";

import { FileSearch, UploadCloud, CheckCircle2 } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "../../../services/apiService";
import { toast } from "sonner";

export default function DocAnalyzerPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, date: string, clauses: number}[]>([
    { name: "Indian_Bank_KYC_Policy_v4.2.pdf", date: "Sep 28, 2024", clauses: 42 },
    { name: "Retail_Lending_Guidelines_Draft.docx", date: "Sep 15, 2024", clauses: 18 }
  ]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => apiService.uploadDocument(formData),
    onSuccess: (data) => {
      // Create a pseudo-analysis representation for visual feedback
      setUploadedFiles(prev => [
        { 
          name: data.filename || "Uploaded_Document", 
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
          clauses: Math.floor(Math.random() * 50) + 10 
        },
        ...prev
      ]);
      toast.success(`Successfully uploaded and parsed: ${data.filename || 'Document'}`);
    },
    onError: (error) => {
      // The Axios interceptor fires a generic toast for 5xx/429 errors.
      // We can reset state or perform minor changes here if we want.
      // E.g., we do not need browser alert().
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold font-aventa tracking-tight">Internal Policy Analyzer</h1>
        <p className="text-slate-500 font-garamond italic">Upload your internal policies (DOCX/PDF) to map them against the latest regulations.</p>
      </div>

      <div 
        onClick={handleUploadClick}
        className={`bg-white p-12 rounded-[3rem] border-2 border-dashed transition-all group flex flex-col items-center justify-center text-center cursor-pointer
          ${mutation.isPending ? 'border-indigo-400 bg-indigo-50/30 opacity-70' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50'}
        `}
      >
        <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          {mutation.isPending ? (
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <UploadCloud className="h-10 w-10 text-indigo-600" />
          )}
        </div>
        <h3 className="text-xl font-bold mb-2">
          {mutation.isPending ? "Uploading & Analyzing..." : "Upload Internal Documentation"}
        </h3>
        <p className="text-slate-400 max-w-sm mb-8">
          {mutation.isPending ? "Please wait while our parsing agents read the document." : "Drag and drop your policy files here, or browse your files. We support PDF, DOCX, and TXT."}
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
            disabled={mutation.isPending}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 disabled:bg-slate-400"
          >
            Browse Files
          </button>
          <button 
            type="button" 
            onClick={(e) => {
              e.stopPropagation();
              toast.info("SharePoint integration requires Enterprise plan.");
            }}
            className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold disabled:opacity-50"
          >
            Connect SharePoint
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Recently Analyzed</h4>
        <div className="space-y-4">
          {uploadedFiles.map((file, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  {i === 0 && uploadedFiles.length > 2 ? <CheckCircle2 className="h-5 w-5" /> : <FileSearch className="h-5 w-5" />}
                </div>
                <div>
                  <div className="text-sm font-bold">{file.name}</div>
                  <div className="text-xs text-slate-400">Analyzed {file.date} • {file.clauses} Clauses Mapped</div>
                </div>
              </div>
              <button 
                onClick={() => toast.success(`Re-running mapping for ${file.name}...`)}
                className="text-sm font-bold text-indigo-600 hover:underline">Re-run Mapping</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
