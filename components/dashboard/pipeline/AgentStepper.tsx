"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, X, Circle } from "lucide-react";
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
      <div className="absolute left-[11px] top-4 bottom-4 w-[0.5px] bg-border/20 z-0" />

      {steps.map((step, index) => {
        const isWaiting = step.status === 'WAITING';
        const isRunning = step.status === 'RUNNING';
        const isCompleted = step.status === 'COMPLETED';
        const isFailed = step.status === 'FAILED';

        return (
          <div key={step.id} className="relative z-10 flex items-start gap-4 pb-8 group last:pb-0">
            {/* Status Icon */}
            <div className="flex-shrink-0 mt-1">
              <div className="relative h-6 w-6 flex items-center justify-center bg-background">
                {isCompleted && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }}
                    className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white"
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </motion.div>
                )}

                {isRunning && (
                  <div className="relative">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-2 border-amber-primary"
                    />
                    <div className="h-5 w-5 rounded-full bg-white border-2 border-amber-primary flex items-center justify-center">
                      <Loader2 className="h-3 w-3 text-amber-primary animate-spin" />
                    </div>
                  </div>
                )}

                {isWaiting && (
                  <div className="h-5 w-5 rounded-full border-[0.5px] border-border/40 bg-white flex items-center justify-center">
                    <div className="h-1 w-1 rounded-full bg-border/20" />
                  </div>
                )}

                {isFailed && (
                  <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white">
                    <X className="h-3 w-3" strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>

            {/* Label & Details */}
            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-[11px] font-mono font-bold uppercase tracking-wider transition-colors",
                  isRunning ? "text-amber-primary" : isCompleted ? "text-foreground" : "text-muted-foreground/40"
                )}>
                  {step.label}
                </span>
                {isRunning && (
                  <span className="text-[9px] font-mono text-amber-primary/60 animate-pulse">Running</span>
                )}
              </div>
              
              <AnimatePresence>
                {step.output && (
                  <motion.p 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="text-[10px] text-muted-foreground mt-1 font-serif italic"
                  >
                    {step.output}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
