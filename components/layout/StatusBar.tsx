"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/axios";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  task_id: string;
  status: string;
  progress: number;
  current_step: string;
  document_id: string;
}

export function StatusBar() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const pollTasks = async () => {
      try {
        const response = await apiClient.get("/api/tasks");
        if (response.data && Array.isArray(response.data)) {
          setTasks(response.data);
        }
      } catch (error) {
        console.error("Failed to poll tasks:", error);
      }
    };

    const interval = setInterval(pollTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  if (tasks.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 w-80 z-50 flex flex-col gap-4">
      {tasks.map((task) => (
        <div key={task.task_id} className="bg-white border-[0.5px] border-border/40 shadow-2xl p-5 animate-in slide-in-from-right duration-500">
          <div className="flex items-center justify-between mb-4">
            <span className="tech-label text-primary">
              {task.status === 'completed' ? 'LEDGER VERIFIED' : 'AGENT ORCHESTRATION'}
            </span>
            {task.status === 'completed' ? (
              <CheckCircle2 className="h-4 w-4 text-tertiary" />
            ) : task.status === 'failed' ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            )}
          </div>
          
          <h4 className="text-sm font-bold text-foreground truncate mb-1 font-serif italic">
            Regulation: {task.document_id}
          </h4>
          <p className="text-[10px] text-muted-foreground mb-4 truncate font-mono uppercase tracking-tighter">
            {task.current_step}
          </p>
          
          <div className="relative h-[2px] w-full bg-muted overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-in-out"
              style={{ width: `${task.progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
             <span className="font-mono text-[9px] text-muted-foreground/40">VECTOR #{task.task_id.slice(0, 8)}</span>
             <span className="font-mono text-[9px] font-bold text-primary">{task.progress}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
