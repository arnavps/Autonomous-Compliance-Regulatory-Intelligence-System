"use client";

import React, { useEffect } from "react";
import { usePipelineStore } from "@/lib/store/pipelineStore";
import { AgentStepper } from "./AgentStepper";
import { AgentTerminal } from "./AgentTerminal";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, ShieldCheck } from "lucide-react";

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
          addLog(currentStep.label.split(' ')[0], `Initiating ${currentStep.id} sequence...`);
        }
      }, 3000); // 3 seconds per step
      
      return () => clearInterval(timer);
    }
  }, [status, advanceStep, addLog, steps]);

  if (!isActive) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-amber-primary/10 border border-amber-primary/20 flex items-center justify-center text-amber-primary">
            <PlayCircle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest">Agent Pipeline — Live</h3>
            <span className="text-[10px] text-muted-foreground font-mono">ID: TASK-672901-X</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="h-1.5 w-1.5 rounded-full bg-amber-primary animate-pulse" />
           <span className="text-[9px] font-mono text-amber-primary uppercase">Syncing Vector</span>
        </div>
      </div>

      <div className="flex-1 grid grid-rows-2 gap-6 min-h-0">
        {/* Stepper Scroll Area */}
        <div className="bg-surface-container-low border-[0.5px] border-border/20 p-6 overflow-y-auto custom-scrollbar">
          <AgentStepper steps={steps} />
        </div>

        {/* Terminal Area */}
        <AgentTerminal logs={logs} className="h-full" />
      </div>

      {status === 'COMPLETED' && (
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="p-4 bg-emerald-500/10 border-[0.5px] border-emerald-500/20 flex items-center gap-3"
        >
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <p className="text-[11px] font-serif italic text-emerald-700">
            Institutional ledger updated. New regulatory vectors successfully mapped.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
