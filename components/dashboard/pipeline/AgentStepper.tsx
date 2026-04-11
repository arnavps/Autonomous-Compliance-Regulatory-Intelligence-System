"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, X, Circle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { PipelineStep, StepStatus } from "@/lib/store/pipelineStore";

interface AgentStepperProps {
  steps: PipelineStep[];
  className?: string;
}

export function AgentStepper({ steps, className }: AgentStepperProps) {
  return (
    <div className={cn("flex flex-col space-y-0 relative", className)}>
      {/* Connecting Line */}
      <div className="absolute left-[13px] top-6 bottom-6 w-[1px] bg-border/20 z-0" />

      {steps.map((step, index) => {
        const isWaiting = step.status === 'WAITING';
        const isRunning = step.status === 'RUNNING';
        const isCompleted = step.status === 'COMPLETED';
        const isFailed = step.status === 'FAILED';

        return (
          <div key={step.id} className="relative z-10 flex items-start gap-6 pb-10 group last:pb-0">
            {/* Status Icon */}
            <div className="flex-shrink-0 mt-1">
              <div className="relative h-7 w-7 flex items-center justify-center bg-white ring-8 ring-white">
                {isCompleted && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }}
                    className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </motion.div>
                )}

                {isRunning && (
                  <div className="relative">
                    <motion.div 
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full border-[1.5px] border-amber-primary"
                    />
                    <div className="h-6 w-6 rounded-full bg-white border border-amber-primary flex items-center justify-center shadow-sm">
                      <Loader2 className="h-3.5 w-3.5 text-amber-primary animate-spin" strokeWidth={3} />
                    </div>
                  </div>
                )}

                {isWaiting && (
                  <div className="h-6 w-6 rounded-full border-[0.5px] border-border/40 bg-white flex items-center justify-center group-hover:border-amber-primary/30 transition-colors shadow-inner">
                    <div className="h-1.5 w-1.5 rounded-full bg-border/10" />
                  </div>
                )}

                {isFailed && (
                  <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                    <X className="h-3.5 w-3.5" strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>

            {/* Label & Details */}
            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all",
                  isRunning ? "text-amber-primary" : isCompleted ? "text-foreground" : "text-muted-foreground/30"
                )}>
                  {step.label}
                </span>
                {isRunning && (
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono font-bold text-amber-primary/40 uppercase tracking-[0.2em] animate-pulse">Syncing...</span>
                  </div>
                )}
              </div>
              
              <AnimatePresence mode="wait">
                {step.output && (
                  <motion.div 
                    key={step.id + "_output"}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="overflow-hidden"
                  >
                    <p className="text-[12px] text-muted-foreground/60 font-serif italic leading-relaxed mt-1">
                      {step.output}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
