"use client";

import { useEffect, useState } from "react";
import { Bell, Search, Database, ShieldAlert, Shield, Search as SearchIcon } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export function Header() {
  const { role } = useAuth();
  const [stats, setStats] = useState({ total_circulars: 0, total_conflicts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get("/api/stats");
        setStats(response.data);
      } catch (error) {
        setStats({ total_circulars: 127, total_conflicts: 3 }); // Fallback for UI demo
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const getRoleColor = (r: typeof role) => {
    switch (r) {
      case "COMPLIANCE": return "bg-amber-primary/10 text-amber-primary border-amber-primary/20";
      case "LAWYER": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "RISK": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <header className="h-[56px] glass-topbar fixed top-0 left-0 right-0 z-50 flex items-center px-4">
      {/* Left Cluster */}
      <div className="flex items-center gap-2 w-[240px]">
        <Shield className="h-5 w-5 text-amber-primary fill-amber-primary/20" />
        <span className="font-serif text-lg font-bold tracking-tight text-foreground">ACRIS</span>
      </div>

      {/* Centered Search */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-[480px]">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search circulars, obligations, entities..." 
            className="w-full bg-white/40 border border-white/60 focus:border-amber-primary/40 focus:ring-2 focus:ring-amber-primary/5 py-1.5 pl-10 pr-16 text-sm rounded-lg transition-all outline-none backdrop-blur-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                toast.success(`Search initiated: ${e.currentTarget.value}`);
                e.currentTarget.value = "";
              }
            }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 border border-slate-200 rounded bg-slate-50/50 text-[10px] text-slate-400 font-mono">
            <span className="text-[8px]">CMD</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Cluster */}
      <div className="flex items-center gap-4 min-w-[240px] justify-end">
        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-slate-400">LIVE</span>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-white/80 shadow-sm">
            <Database className="h-3 w-3 text-amber-primary" />
            <span className="text-[11px] font-medium text-amber-primary">{stats.total_circulars} docs</span>
          </div>

          {stats.total_conflicts > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 text-white border border-red-600 shadow-sm animate-pulse cursor-pointer" onClick={() => toast.error(`${stats.total_conflicts} regulatory conflicts detected!`)}>
              <ShieldAlert className="h-3 w-3" />
              <span className="text-[11px] font-bold">{stats.total_conflicts}</span>
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

        {/* Notifications */}
        <button className="relative p-1.5 text-slate-500 hover:text-amber-primary transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* User / Role Section */}
        <div className="flex items-center gap-3">
          <span className={cn(
            "px-2 py-0.5 border rounded-md text-[9px] font-bold tracking-wider",
            getRoleColor(role)
          )}>
            {role || "GUEST"}
          </span>
          
          <div className="h-8 w-8 rounded-full bg-amber-primary/10 border border-amber-primary/20 flex items-center justify-center text-amber-primary font-bold text-xs">
            AS
          </div>
        </div>
      </div>
    </header>
  );
}
