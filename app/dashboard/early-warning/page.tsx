import { Radar, Zap } from "lucide-react";

export default function EarlyWarningPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-aventa tracking-tight">Early Warning Radar</h1>
          <p className="text-slate-500 font-garamond italic">Predictive alerts based on draft papers and cross-jurisdictional shifts.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-teal-50 border border-teal-100 rounded-full">
          <Zap className="h-4 w-4 text-teal-600 filling-teal-600" />
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Predictive Mode On</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="h-2 w-full bg-slate-100 rounded-full mb-6 overflow-hidden">
               <div className="h-full bg-teal-500 w-1/3" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-600">DRAFT STAGE</span>
              <Radar className="h-4 w-4 text-teal-500" />
            </div>
            <h4 className="font-bold mb-2">Potential Shift in Digital Lending Cap</h4>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">Based on the SEBI Discussion Paper (Sept 2024), we foresee a 5% reduction in allowable cap for fintech partnerships.</p>
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">72% Probability</span>
              <button className="text-xs font-bold text-indigo-600 hover:underline">View Analysis</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
