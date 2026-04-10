"use client";

import { useEffect, useState } from "react";
import { Bell, Search, UserCircle, Database, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/axios";

export function Header() {
  const [stats, setStats] = useState({ total_circulars: 0, total_conflicts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get("/api/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-20 border-b-[0.5px] border-border/20 bg-background/80 backdrop-blur-xl sticky top-0 z-20">
      <div className="h-full px-10 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
            <input 
              type="text" 
              placeholder="Search Regulatory Knowledge Ledger..." 
              className="w-full bg-transparent border-b-[0.5px] border-border/10 py-2 pl-8 pr-4 text-xs font-serif italic focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground/30"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  toast.success(`Querying vector database for "${e.currentTarget.value}"...`);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Database className="h-4 w-4 text-primary opacity-50" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold text-foreground">{stats.total_circulars}</span>
                <span className="tech-label text-muted-foreground/40">Circulars Index</span>
              </div>
            </div>
            <div className="h-6 w-[0.5px] bg-border/20" />
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-4 w-4 text-primary opacity-50" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold text-foreground">{stats.total_conflicts}</span>
                <span className="tech-label text-muted-foreground/40">Conflicts Active</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => toast.info("No active ledger alerts.")}
              className="relative p-1 text-muted-foreground hover:text-primary transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-primary" />
            </button>
            
            <button 
              onClick={() => toast.info("User preferences restricted in demo v1.0")}
              className="flex items-center gap-4 pl-6 border-l-[0.5px] border-border/20 group">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground font-mono">Arnav Shirwadkar</span>
                <span className="text-[9px] text-primary/60 font-serif italic">Chief Compliance Officer</span>
              </div>
              <div className="h-10 w-10 bg-surface-container border-[0.5px] border-border/40 flex items-center justify-center text-muted-foreground group-hover:border-primary/50 transition-all">
                <UserCircle className="h-7 w-7 opacity-30" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
