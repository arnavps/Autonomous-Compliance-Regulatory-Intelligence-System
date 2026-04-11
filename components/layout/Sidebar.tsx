"use client";

import { useEffect, useState } from "react";
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
import { useWorkflowStore } from "@/lib/store/workflowStore";

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getNavItems = () => {
    switch (role) {
      case "LAWYER":
        return [
          { name: "Impact Reports", href: "/dashboard/impact-reports", icon: FileCheck },
          { name: "Amendment Workbench", href: "/dashboard/amendment-workbench", icon: AppWindow },
          { name: "Conflict Explorer", href: "/dashboard/conflict-map", icon: Map },
          { name: "Case Research", href: "/dashboard/case-research", icon: Scale },
        ];
      case "RISK":
        return [
          { name: "Risk Dashboard", href: "/dashboard/risk-dashboard", icon: Gauge },
          { name: "Exposure Matrix", href: "/dashboard/exposure-matrix", icon: LayoutGrid },
          { name: "Early Warning Radar", href: "/dashboard/early-warning", icon: Radar },
          { name: "Conflict Explorer", href: "/dashboard/conflict-map", icon: Map },
        ];
      case "COMPLIANCE":
      default:
        return [
          { name: "Regulatory Q&A", href: "/dashboard/q-and-a", icon: MessageSquare },
          { name: "Document Analyzer", href: "/dashboard/doc-analyzer", icon: FileSearch },
          { name: "Audit Trail", href: "/dashboard/audit-trail", icon: History },
          { name: "Early Warning Radar", href: "/dashboard/early-warning", icon: Radar },
        ];
    }
  };

  const navItems = getNavItems();

  if (!mounted) {
    return <div className="h-full w-[240px] glass-sidebar shrink-0" />;
  }

  return (
    <div className={cn(
      "flex h-full flex-col glass-sidebar transition-all duration-300 relative",
      isCollapsed ? "w-[64px]" : "w-[240px]"
    )}>
      {/* Top Section - Brand */}
      <div className={cn(
        "flex items-center gap-2 px-6 py-4",
        isCollapsed ? "justify-center px-0" : ""
      )}>
        <Shield className="h-5 w-5 text-amber-primary fill-amber-primary/20 shrink-0" />
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight text-foreground leading-none">ACRIS</span>
            <span className="text-[8px] font-mono font-bold tracking-[0.2em] text-amber-primary/40 uppercase mt-0.5">Intelligence</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 py-4 space-y-1 overflow-y-auto no-scrollbar",
        isCollapsed ? "px-2" : "px-3"
      )}>
              {navItems.map((item) => {
          const isActive = pathname === item.href;
          const pendingAmendments = useWorkflowStore.getState().amendments.filter(a => a.status === 'Proposed').length;
          const hasBadge = item.name === "Amendment Workbench" && pendingAmendments > 0;

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
                <span className="text-[13px] font-medium tracking-tight truncate flex-1">{item.name}</span>
              )}
              {!isCollapsed && hasBadge && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[8px] font-bold animate-pulse">
                  {pendingAmendments}
                </span>
              )}
              {isCollapsed && hasBadge && (
                <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
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
