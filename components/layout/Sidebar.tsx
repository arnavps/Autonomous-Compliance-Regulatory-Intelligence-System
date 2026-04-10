"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MessageSquare, 
  Map, 
  Radar, 
  FileSearch, 
  Shield, 
  Scale, 
  AppWindow, 
  History, 
  Gauge, 
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  FileCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getNavItems = () => {
    switch (role) {
      case "LAWYER":
        return [
          { name: "Case Research", href: "/qa", icon: Scale }, // Using Q&A for research in this mock
          { name: "Conflict Explorer", href: "/conflicts", icon: Map },
          { name: "Amendment Workbench", href: "/amendments", icon: AppWindow },
          { name: "Audit Trail", href: "/audit", icon: History },
        ];
      case "RISK":
        return [
          { name: "Risk Dashboard", href: "/risk", icon: Gauge },
          { name: "Early Warning Radar", href: "/radar", icon: Radar },
          { name: "Conflict Explorer", href: "/conflicts", icon: Map },
          { name: "Exposure Matrix", href: "/risk", icon: LayoutGrid }, // Pointing to Risk for now
        ];
      case "COMPLIANCE":
      default:
        return [
          { name: "Regulatory Q&A", href: "/qa", icon: MessageSquare },
          { name: "Conflict Explorer", href: "/conflicts", icon: Map },
          { name: "Early Warning Radar", href: "/radar", icon: Radar },
          { name: "Document Analyzer", href: "/documents", icon: FileSearch },
          { name: "Impact Reports", href: "/reports", icon: FileCheck },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className={cn(
      "flex h-screen flex-col glass-sidebar fixed left-0 top-0 transition-all duration-300 z-40 pt-[56px]",
      isCollapsed ? "w-[64px]" : "w-[240px]"
    )}>
      {/* Top Section - Logo Only */}
      {!isCollapsed && (
        <div className="px-6 py-4">
          <div className="h-6 w-[100px] flex items-center">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-amber-primary/40 uppercase">Intelligence</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={cn(
        "flex-1 py-4 space-y-1 overflow-y-auto no-scrollbar",
        isCollapsed ? "px-2" : "px-3"
      )}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center transition-all duration-300 relative rounded-r-lg",
                isCollapsed ? "justify-center h-10 w-full" : "px-4 py-2.5",
                isActive 
                  ? "bg-amber-primary/[0.08] text-amber-primary border-l-[3px] border-amber-primary" 
                  : "text-slate-500 hover:bg-slate-500/5 hover:text-slate-900 border-l-[3px] border-transparent"
              )}
            >
              <item.icon 
                className={cn(
                  "h-5 w-5 transition-colors shrink-0",
                  isActive ? "text-amber-primary" : "text-slate-400 group-hover:text-slate-600",
                  !isCollapsed && "mr-3"
                )} 
              />
              {!isCollapsed && (
                <span className="text-[13px] font-medium tracking-tight truncate">{item.name}</span>
              )}
              {isCollapsed && isActive && (
                <div className="absolute left-0 w-[3px] h-full bg-amber-primary rounded-full transition-all duration-300" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className={cn(
        "p-4 border-t border-slate-200/50 space-y-4 bg-slate-50/20",
        isCollapsed && "p-2 items-center text-center"
      )}>
        <div className="flex items-center gap-2 px-2">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
          {!isCollapsed && (
            <span className="text-[10px] font-mono font-bold text-slate-400 whitespace-nowrap">AGENTS ONLINE</span>
          )}
        </div>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-200/50 transition-all text-slate-400"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
