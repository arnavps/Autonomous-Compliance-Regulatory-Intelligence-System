"use client";

import { useState } from "react";
import { 
  Map, 
  Share2, 
  AlertTriangle, 
  ArrowRight, 
  Info, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock High-Fidelity Data
const MOCK_CONFLICTS = [
  {
    id: "C-1",
    severity: "High",
    type: "Contradiction",
    source: {
      id: "RBI/2024/73",
      title: "Master Direction – KYC (Updated Aug 2024)",
      body: "Reserve Bank of India"
    },
    target: {
      id: "RBI/DLG/2024",
      title: "Draft Digital Lending Guidelines",
      body: "RBI (Consultation Paper)"
    },
    reasoning: "Section 14(a) of the KYC Master Direction mandates in-person verification for high-risk accounts, while the Draft Digital Lending paper proposes fully automated video-KYC without human oversight. This creates a compliance gap for NBFCs adopting pure-digital onboarding.",
    nodes: [
      { id: "src", x: 100, y: 150, title: "KYC MD 2024" },
      { id: "tgt", x: 400, y: 150, title: "Draft DLG" }
    ]
  },
  {
    id: "C-2",
    severity: "Medium",
    type: "Supersession",
    source: {
      id: "SEBI/HO/AUM/22",
      title: "Reporting Norms for Asset Management",
      body: "SEBI"
    },
    target: {
      id: "SEBI/CIRC/2019/11",
      title: "Legacy reporting template v2.1",
      body: "SEBI"
    },
    reasoning: "The 2022 directive introduces a consolidated XBRL format which fully supersedes the manual Excel-based reporting required in circular 2019/11. Firms must transition all reporting modules by Q4 2024.",
    nodes: [
      { id: "src-2", x: 150, y: 350, title: "SEBI 2022 AUM" },
      { id: "tgt-2", x: 350, y: 350, title: "SEBI 2019 Legacy" }
    ]
  }
];

export default function ConflictMapPage() {
  const [selectedConflict, setSelectedConflict] = useState(MOCK_CONFLICTS[0]);
  const [viewMode, setViewMode] = useState<"graph" | "list">("graph");

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-aventa tracking-tight flex items-center gap-3">
            Conflict Explorer
            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] rounded-full uppercase tracking-tighter shadow-sm border border-amber-200">
              Live Semantic Engine
            </span>
          </h1>
          <p className="text-slate-500 font-garamond italic text-lg mt-1">
            Analyzing contradictory mandates across 2,400+ regulatory vectors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button 
              onClick={() => setViewMode("graph")}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                viewMode === "graph" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Network View
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                viewMode === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Conflict List
            </button>
          </div>
          <button
            onClick={() => toast.success("Graph successfully exported as high-res PDF.")}
            className="flex items-center gap-2 px-4 py-2 bg-brand-slate text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-100"
          >
            <Share2 className="h-4 w-4" />
            Export Intelligence
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Sidebar: Active Conflicts */}
        <div className="lg:col-span-4 flex flex-col space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Detected Contradictions</h3>
          {MOCK_CONFLICTS.map((conflict) => (
            <motion.div
              key={conflict.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedConflict(conflict)}
              className={cn(
                "p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group",
                selectedConflict.id === conflict.id 
                  ? "bg-white border-indigo-500 shadow-xl shadow-indigo-50/50" 
                  : "bg-white/50 border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider",
                  conflict.severity === "High" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                )}>
                  {conflict.severity} Impact
                </span>
                <span className="text-[10px] text-slate-400 font-bold">{conflict.type}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-2 leading-tight">
                {conflict.source.id} spans {conflict.target.id}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {conflict.reasoning}
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-1.5">
                   <div className="h-6 w-6 rounded-full bg-indigo-50 flex items-center justify-center border border-white text-indigo-600">
                     <ShieldCheck className="h-3 w-3" />
                   </div>
                   <div className="h-6 w-6 rounded-full bg-amber-50 flex items-center justify-center border border-white text-amber-600">
                     <Zap className="h-3 w-3" />
                   </div>
                </div>
                <ArrowRight className={cn(
                  "h-4 w-4 transition-transform group-hover:translate-x-1",
                  selectedConflict.id === conflict.id ? "text-indigo-600" : "text-slate-300"
                )} />
              </div>
            </motion.div>
          ))}
          
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl border-dashed flex flex-col items-center justify-center text-center">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs font-bold text-slate-500">All other vectors verified compliant.</p>
          </div>
        </div>

        {/* Main Area: Interactive Graph Engine */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden flex flex-col p-8">
           <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1.5px,transparent_1px)] [background-size:32px_32px] opacity-40" />
           
           <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                       <Map className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold tracking-tight">Relational Knowledge Graph</span>
                 </div>
                 <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                       <div className="h-2 w-2 rounded-full bg-indigo-500" /> Circular
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                       <div className="h-2 w-2 rounded-full bg-red-500" /> Conflict
                    </span>
                 </div>
              </div>

              {/* SVG Graph Canvas */}
              <div className="flex-1 relative flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
                    </marker>
                    <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  
                  <AnimatePresence mode="wait">
                    <motion.g
                      key={selectedConflict.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Connection Line */}
                      <motion.line 
                        x1={selectedConflict.nodes[0].x} 
                        y1={selectedConflict.nodes[0].y} 
                        x2={selectedConflict.nodes[1].x} 
                        y2={selectedConflict.nodes[1].y} 
                        stroke="url(#edgeGradient)"
                        strokeWidth="3"
                        strokeDasharray="8 4"
                        markerEnd="url(#arrow)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      />
                      
                      {/* Interaction Nodes */}
                      {selectedConflict.nodes.map((node) => (
                        <foreignObject 
                          key={node.id} 
                          x={node.x - 70} 
                          y={node.y - 45} 
                          width="140" 
                          height="90"
                          className="pointer-events-auto"
                        >
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                            className="w-full h-full flex flex-col items-center justify-center"
                          >
                            <div className={cn(
                              "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg border-2 mb-2",
                              node.id === "src" || node.id === "src-2" ? "bg-white border-indigo-200 text-indigo-600" : "bg-white border-slate-200 text-slate-700"
                            )}>
                              <FileText className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-black text-center text-slate-600 px-2 line-clamp-1 bg-white/80 backdrop-blur rounded p-0.5 border border-slate-100 uppercase tracking-tighter">
                              {node.title}
                            </span>
                          </motion.div>
                        </foreignObject>
                      ))}
                    </motion.g>
                  </AnimatePresence>
                </svg>
                
                {/* Floating Detail Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/70 backdrop-blur-xl border border-white p-6 rounded-[2rem] shadow-2xl flex flex-col md:flex-row gap-6">
                   <div className="flex-1">
                      <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">
                         <Info className="h-4 w-4" />
                         Engine Reasoning
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-garamond italic text-lg">
                        "{selectedConflict.reasoning}"
                      </p>
                   </div>
                   <div className="flex flex-col justify-between gap-3 min-w-[140px]">
                      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all">
                        <ExternalLink className="h-3 w-3" />
                        Source Link
                      </button>
                      <button 
                        onClick={() => toast.info("Drafting resolution memo...")}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-slate text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                        Generate Fix
                      </button>
                   </div>
                </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
