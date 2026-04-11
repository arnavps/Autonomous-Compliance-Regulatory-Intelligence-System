"use client";

import React, { useEffect } from "react";
import { usePipelineStore } from "@/lib/store/pipelineStore";
import { AgentStepper } from "./AgentStepper";
import { AgentTerminal } from "./AgentTerminal";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, ShieldCheck, Activity } from "lucide-react";

export function PipelinePanel() {
  const { steps, logs, status, isActive, advanceStep, addLog } = usePipelineStore();

  // Simulation effect
  useEffect(() => {
    if (status === 'RUNNING') {
      const timer = setInterval(() => {
        advanceStep();
        
        // Add random log when step advances
        const currentStep = steps.find(s => s.status === 'RUNNING');
        if (currentStep) {
          addLog(currentStep.label.split(' ')[0], `Initiating ${currentStep.id} sequence... Match probability confirmed.`);
        }
      }, 3500); // 3.5 seconds per step
      
      return () => clearInterval(timer);
    }
  }, [status, advanceStep, addLog, steps]);

  if (!isActive) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full space-y-8"
    >
      <div className="flex items-center justify-between pb-6 border-b-[0.5px] border-border/10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-amber-primary/5 border border-amber-primary/10 flex items-center justify-center text-amber-primary shadow-sm">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-foreground">Agent Pipeline</h3>
            <span className="text-[9px] text-muted-foreground/50 font-mono tracking-widest font-bold">ORCHESTRATOR ID: V-901-X</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <span className="h-2 w-2 rounded-full bg-amber-primary animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
           <span className="text-[9px] font-mono text-amber-primary uppercase font-bold tracking-widest">Neural Link Active</span>
        </div>
      </div>

      <div className="flex-1 grid grid-rows-2 gap-8 min-h-0">
        {/* Stepper Scroll Area */}
        <div className="bg-white border-[0.5px] border-border/20 p-8 overflow-y-auto custom-scrollbar shadow-sm">
          <AgentStepper steps={steps} />
        </div>

        {/* Terminal Area */}
        <AgentTerminal logs={logs} className="h-full border-[0.5px] border-border/20 shadow-2xl" />
      </div>

      <AnimatePresence>
        {status === 'COMPLETED' && (
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="p-6 bg-emerald-500/[0.03] border-[0.5px] border-emerald-500/20 flex flex-col gap-3 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700">Verification Success</span>
            </div>
            <p className="text-[12px] font-serif italic text-emerald-900 opacity-70 leading-relaxed">
              Institutional ledger updated. New regulatory vectors successfully mapped without collision detected.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
