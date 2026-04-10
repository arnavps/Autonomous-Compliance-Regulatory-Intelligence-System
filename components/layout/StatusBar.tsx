"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/axios";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

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
    <div className="fixed bottom-6 right-6 w-80 z-50 flex flex-col gap-3">
      {tasks.map((task) => (
        <div key={task.task_id} className="bg-white rounded-xl border border-slate-200 shadow-xl p-4 animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              {task.status === 'completed' ? 'Processed' : 'Orchestrating Agent'}
            </span>
            {task.status === 'completed' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : task.status === 'failed' ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
              <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
            )}
          </div>
          
          <h4 className="text-sm font-semibold text-slate-800 truncate mb-1">
            Doc: {task.document_id}
          </h4>
          <p className="text-[11px] text-slate-500 mb-2 truncate">
            {task.current_step}
          </p>
          
          <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${task.progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
             <span className="text-[10px] text-slate-400">Task #{task.task_id.slice(0, 8)}</span>
             <span className="text-[10px] font-bold text-indigo-600">{task.progress}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
