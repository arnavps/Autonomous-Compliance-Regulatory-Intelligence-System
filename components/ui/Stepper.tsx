import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number; // 0-indexed
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-between w-full max-w-4xl mx-auto py-8", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isPending = index > currentStep;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center relative group min-w-[80px]">
              {/* Step Circle */}
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300",
                  isCompleted && "bg-amber-primary text-white",
                  isActive && "border-2 border-amber-primary text-amber-primary bg-white shadow-[0_0_15px_rgba(193,123,47,0.2)]",
                  isPending && "border-2 border-slate-300 text-slate-400 bg-white"
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
              </div>

              {/* Step Label */}
              <span
                className={cn(
                  "mt-3 text-[11px] font-medium tracking-wide whitespace-nowrap",
                  isCompleted || isActive ? "text-amber-primary" : "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 -mt-6">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    isCompleted ? "bg-amber-primary" : "bg-slate-200 border-t-2 border-dashed border-slate-300 bg-transparent"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
