"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MessageSquareLock, 
  Map, 
  Radar, 
  FileSearch, 
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Regulatory Q&A", href: "/dashboard/q-and-a", icon: MessageSquareLock },
  { name: "Conflict Explorer", href: "/dashboard/conflict-map", icon: Map },
  { name: "Early Warning Radar", href: "/dashboard/early-warning", icon: Radar },
  { name: "Document Analyzer", href: "/dashboard/doc-analyzer", icon: FileSearch },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-surface-container-low border-r-[0.5px] border-border/20 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
      <div className="flex h-20 items-center px-8 border-b-[0.5px] border-border/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold font-serif italic tracking-tight text-foreground">ACRIS</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        <div className="tech-label text-muted-foreground/40 px-4 mb-4">Intelligence Modules</div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3 transition-all duration-300 relative",
                isActive 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />
              )}
              <item.icon 
                className={cn(
                  "mr-4 h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground/40 group-hover:text-muted-foreground"
                )} 
              />
              <span className="text-xs font-bold uppercase tracking-widest font-mono">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t-[0.5px] border-border/10">
        <div className="bg-surface-container p-5 border-[0.5px] border-border/20">
          <p className="tech-label text-muted-foreground mb-3 tracking-tighter">System Integrity</p>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 bg-tertiary animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-foreground">AGENTS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
