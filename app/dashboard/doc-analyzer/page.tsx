import { FileSearch, UploadCloud } from "lucide-react";

export default function DocAnalyzerPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold font-aventa tracking-tight">Internal Policy Analyzer</h1>
        <p className="text-slate-500 font-garamond italic">Upload your internal policies (DOCX/PDF) to map them against the latest regulations.</p>
      </div>

      <div className="bg-white p-12 rounded-[3rem] border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50 transition-all group flex flex-col items-center justify-center text-center cursor-pointer">
        <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <UploadCloud className="h-10 w-10 text-indigo-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Upload Internal Documentation</h3>
        <p className="text-slate-400 max-w-sm mb-8">Drag and drop your policy files here, or browse your files. We support PDF, DOCX, and TXT.</p>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100">Browse Files</button>
          <button className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold">Connect SharePoint</button>
        </div>
      </div>

      <div className="mt-12">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Recently Analyzed</h4>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <FileSearch className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">Indian_Bank_KYC_Policy_v4.2.pdf</div>
                  <div className="text-xs text-slate-400">Analyzed Sep 28, 2024 • 42 Clauses Mapped</div>
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
