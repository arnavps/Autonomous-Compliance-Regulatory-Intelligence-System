"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MessageSquareLock, 
  Map, 
  Radar, 
  FileSearch, 
  ShieldCheck,
  LayoutDashboard
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
    <div className="flex h-full w-64 flex-col bg-white border-r border-slate-200 shadow-sm">
      <div className="flex h-16 items-center px-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold font-aventa tracking-tight text-slate-900">RegIntel AI</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                isActive 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon 
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500"
                )} 
              />
              <span className="font-aventa">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-100">
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-700">All Agents Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
