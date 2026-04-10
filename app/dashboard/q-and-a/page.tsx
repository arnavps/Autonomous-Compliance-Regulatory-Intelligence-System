import { MessageSquareLock, ShieldEllipsis } from "lucide-react";

export default function QnAPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-aventa tracking-tight">Regulatory Q&A</h1>
          <p className="text-slate-500 font-garamond italic">Ask any regulatory question grounded in verified India FinReg sources.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg">
          <ShieldEllipsis className="h-5 w-5 text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-700">Enterprise Guardrails Active</span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
          <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <MessageSquareLock className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold mb-2">Initialize Compliance Query</h3>
          <p className="text-slate-400 max-w-sm">Type your query below to start a verified search across RBI and SEBI databases.</p>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-[2rem]">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="e.g., What are the latest KYC norms for Digital Lending as per RBI August 2024 circular?"
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none shadow-sm"
            />
            <button className="absolute right-3 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Ask RegIntel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
