"use client";

import { Bell, Search, UserCircle, Database, ShieldAlert } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search regulations, circulars, or internal policies..." 
              className="w-full bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
              <Database className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-700">5 Circulars Indexed</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">1 Conflict Detected</span>
            </div>
          </div>
          
          <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="h-8 w-[1px] bg-slate-200" />
          
          <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 transition-all">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
              <UserCircle className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-slate-700">Compliance Officer</span>
          </button>
        </div>
      </div>
    </header>
  );
}
