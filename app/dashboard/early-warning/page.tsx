"use client";

import { useState, useEffect } from "react";
import { Radar, Zap, X, AlertTriangle } from "lucide-react";
import apiClient from "@/lib/axios";

export default function EarlyWarningPage() {
  const [activeAnalysis, setActiveAnalysis] = useState<number | null>(null);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWarnings() {
      try {
        const response = await apiClient.get('/early-warnings');
        setWarnings(response.data.warnings || []);
      } catch (error) {
        console.error("Failed to fetch early warnings", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWarnings();
  }, []);

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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      ) : warnings.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center">
          <Radar className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No Active Warnings</h3>
          <p className="text-slate-500 max-w-md">Our intelligence pipeline is continually monitoring for new draft regulations and consultation papers. At this moment, no high-risk drafts have been detected.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {warnings.map((warning, i) => (
            <div key={warning.id || i} className={`bg-white p-6 rounded-3xl border ${warning.urgency === 'High' ? 'border-amber-200 shadow-amber-500/10' : 'border-slate-200'} shadow-sm hover:shadow-md transition-all flex flex-col`}>
              <div className="h-2 w-full bg-slate-100 rounded-full mb-6 overflow-hidden">
                <div className={`h-full ${warning.urgency === 'High' ? 'bg-amber-500 w-3/4' : warning.urgency === 'Medium' ? 'bg-amber-300 w-1/2' : 'bg-teal-500 w-1/3'}`} />
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-600">DRAFT STAGE • {warning.issuing_body}</span>
                {warning.urgency === 'High' ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                ) : (
                  <Radar className="h-4 w-4 text-teal-500" />
                )}
              </div>
              <h4 className="font-bold mb-2 line-clamp-2" title={warning.title}>{warning.title}</h4>
              <p className="text-sm text-slate-500 mb-4 line-clamp-3" title={warning.proposed_change}>{warning.proposed_change}</p>

              <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{warning.probability} Probability</span>
                <button
                  onClick={() => setActiveAnalysis(activeAnalysis === i ? null : i)}
                  className="text-xs font-bold text-indigo-600 hover:underline">
                  {activeAnalysis === i ? "Hide Analysis" : "View Analysis"}
                </button>
              </div>

              {/* Expanded Analysis View */}
              {activeAnalysis === i && (
                <div className="mt-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
                  <h5 className="text-sm font-bold text-indigo-900 mb-2 border-b border-indigo-100 pb-2">AI Impact Analysis</h5>
                  <ul className="text-xs text-indigo-800 space-y-2 list-disc pl-4">
                    <li><strong>Urgency Level:</strong> <span className={warning.urgency === 'High' ? 'text-amber-600 font-bold' : ''}>{warning.urgency}</span></li>
                    <li><strong>Affected Entities:</strong> {warning.affected_entities}</li>
                    <li><strong>Source:</strong> <a href={warning.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-600">View Original Draft</a></li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
