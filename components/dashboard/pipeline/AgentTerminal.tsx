"use client";

import React, { useEffect, useRef } from "react";
import { PipelineLog } from "@/lib/store/pipelineStore";
import { cn } from "@/lib/utils";

interface AgentTerminalProps {
  logs: PipelineLog[];
  className?: string;
}

export function AgentTerminal({ logs, className }: AgentTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={cn(
      "bg-[#0a0a0a] border-[0.5px] border-white/10 rounded-lg overflow-hidden flex flex-col",
      className
    )}>
      <div className="flex items-center justify-between px-3 py-2 border-b-[0.5px] border-white/5 bg-white/5">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-amber-500/50" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
        </div>
        <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">Agent Orchestration Log</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-[10px] overflow-y-auto scrollbar-hide space-y-1"
      >
        {logs.length === 0 && (
          <div className="text-white/10 italic">Initializing neural link...</div>
        )}
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-1 duration-300">
            <span className="text-white/20 shrink-0">[{log.timestamp}]</span>
            <span className={cn(
               "shrink-0 font-bold",
               log.agent === 'Error' ? "text-red-400" : "text-amber-primary/60"
            )}>{log.agent} Agent —</span>
            <span className="text-white/60">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
