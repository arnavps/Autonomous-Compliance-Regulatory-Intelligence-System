"use client";

import { FileSearch, UploadCloud, CheckCircle2 } from "lucide-react";
import { useRef, useState } from "react";

export default function DocAnalyzerPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, date: string, clauses: number}[]>([
    { name: "Indian_Bank_KYC_Policy_v4.2.pdf", date: "Sep 28, 2024", clauses: 42 },
    { name: "Retail_Lending_Guidelines_Draft.docx", date: "Sep 15, 2024", clauses: 18 }
  ]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Post to FastAPI backend running on port 8000
      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Add pseudo-analysis result to top of list
        setUploadedFiles(prev => [
          { name: data.filename, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), clauses: Math.floor(Math.random() * 50) + 10 },
          ...prev
        ]);
      } else {
        alert("Upload failed. Make sure the backend is running on port 8000.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Cannot connect to backend API.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
          ${isUploading ? 'border-indigo-400 bg-indigo-50/30 opacity-70' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50'}
        `}
      >
        <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          {isUploading ? (
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <UploadCloud className="h-10 w-10 text-indigo-600" />
          )}
        </div>
        <h3 className="text-xl font-bold mb-2">
          {isUploading ? "Uploading & Analyzing..." : "Upload Internal Documentation"}
        </h3>
        <p className="text-slate-400 max-w-sm mb-8">
          {isUploading ? "Please wait while our parsing agents read the document." : "Drag and drop your policy files here, or browse your files. We support PDF, DOCX, and TXT."}
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
            disabled={isUploading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 disabled:bg-slate-400"
          >
            Browse Files
          </button>
          <button 
            type="button" 
            onClick={(e) => e.stopPropagation()}
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
              <button className="text-sm font-bold text-indigo-600 hover:underline">Re-run Mapping</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
