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
      "bg-[#0f172a] border-[1px] border-white/5 overflow-hidden flex flex-col shadow-2xl",
      className
    )}>
      <div className="flex items-center justify-between px-5 py-3 border-b-[0.5px] border-white/5 bg-white/[0.02]">
        <div className="flex gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/10 uppercase tracking-[0.3em] font-bold">Neural Orchestration Shell</span>
          <span className="h-[0.5px] w-8 bg-white/5" />
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-6 font-mono text-[11px] overflow-y-auto custom-scrollbar-terminal space-y-2"
      >
        {logs.length === 0 && (
          <div className="text-white/10 italic animate-pulse">Establishing secure neural handshake...</div>
        )}
        {logs.map((log, i) => (
          <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-500 group">
            <span className="text-white/10 shrink-0 font-bold">[{log.timestamp}]</span>
            <div className="flex-1 flex gap-2">
              <span className={cn(
                "shrink-0 font-bold tracking-wider",
                log.agent === 'Error' ? "text-red-400" : "text-amber-primary/80"
              )}>{log.agent.toUpperCase()} AGENT</span>
              <span className="text-white/20 font-bold">—</span>
              <span className="text-white/60 leading-relaxed font-medium group-hover:text-white/90 transition-colors">{log.message}</span>
            </div>
          </div>
        ))}
        <div className="h-4" />
      </div>

      <div className="px-5 py-2 border-t-[0.5px] border-white/5 bg-black/20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-primary animate-pulse" />
          <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest font-bold">Encrypted Stream</span>
        </div>
        <span className="text-[8px] font-mono text-white/10 uppercase font-bold tracking-[0.4em]">ACRIS_OS v4.0</span>
      </div>
    </div>
  );
}
