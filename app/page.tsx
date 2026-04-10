"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  ArrowRight, 
  ShieldCheck, 
  Search,
  Database,
  AlertTriangle,
  Users
} from "lucide-react";

export default function LandingPage() {
  const stats = {
    circulars: 5,
    conflicts: 1,
    warnings: 3
  };

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-slate font-aventa selection:bg-indigo-100 relative overflow-hidden">
      
      {/* 
        Giant Background Watermark (Vertex Style)
        Implemented with low opacity behind the content 
      */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none opacity-[0.03]">
        <h1 className="text-[15rem] md:text-[25rem] font-black tracking-tighter text-slate-900 leading-none">
          REGINTEL
        </h1>
      </div>

      {/* 
        Floating Pill Navigation (Travelora Style) 
      */}
      <div className="fixed top-6 left-0 w-full z-50 px-6">
        <nav className="max-w-6xl mx-auto h-16 rounded-full bg-white/70 backdrop-blur-xl border border-slate-200/50 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold tracking-tight">ACRIS</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard/q-and-a" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Platform</Link>
            <button onClick={() => toast.info("Methodology details coming in next release!")} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Methodology</button>
            <button onClick={() => toast.info("Contact our sales team for Enterprise pricing.")} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Enterprise</button>
          </div>
          <Link href="/dashboard/q-and-a" className="px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center gap-2">
            Launch Platform
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>

      {/* Main Hero Container */}
      <section className="relative z-10 pt-40 px-6 pb-20 min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Zone: Hero Text (Travelora Style - 60% width) */}
          <motion.div 
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agents Online</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-brand-slate">
              Read, mapped <br/>
              <span className="text-indigo-600">& conflict-free.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 w-full max-w-xl mb-12 font-garamond italic">
              Autonomous Intelligence for RBI & SEBI compliance—deployed before your legal team even wakes up.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/dashboard/q-and-a" className="w-full sm:w-auto px-8 py-4 bg-brand-slate text-white rounded-full text-lg font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Launch Dashboard
              </Link>
              <button 
                onClick={() => toast.info("API Key required. Please check your developer console.")}
                className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-brand-slate rounded-full text-lg font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <Search className="h-5 w-5" />
                Query API
              </button>
            </div>
            
            {/* Social Proof (Travelora Style - Bottom Left) */}
            <div className="mt-16 flex items-center gap-4 border-t border-slate-200 pt-8">
              <div className="flex -space-x-3">
                {[1,2,3,4].map((i) => (
                   <div key={i} className="h-10 w-10 rounded-full border-2 border-brand-ivory bg-indigo-100 flex items-center justify-center">
                     <Users className="h-4 w-4 text-indigo-500" />
                   </div>
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-500">Trusted by 40+ Indian NBFCs</span>
            </div>
          </motion.div>

          {/* Right Zone: Floating Stats Card (Travelora/Vertex Hybrid) */}
          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-teal-400" />
              
              <h3 className="text-xl font-bold mb-8">Live System Intelligence</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Database className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Circulars</p>
                      <p className="font-bold text-lg">Indexed & Parsed</p>
                    </div>
                  </div>
                  <span className="text-3xl font-black text-indigo-600">{stats.circulars}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Conflicts</p>
                      <p className="font-bold text-lg">Detected</p>
                    </div>
                  </div>
                  <span className="text-3xl font-black text-amber-600">{stats.conflicts}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Warnings</p>
                      <p className="font-bold text-lg">Draft Stage</p>
                    </div>
                  </div>
                  <span className="text-3xl font-black text-teal-600">{stats.warnings}</span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* 
        Stats Bar (Vertex Style - Anchored Bottom) 
      */}
      <div className="w-full bg-brand-slate text-white py-12 px-6 border-b-8 border-indigo-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-700">
          <div className="pt-6 md:pt-0">
            <div className="text-5xl font-black mb-2 text-indigo-400 font-aventa">600+</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">CIRCULARS ANNUALLY</p>
          </div>
          <div className="pt-6 md:pt-0">
            <div className="text-5xl font-black mb-2 text-amber-400 font-aventa">₹86Cr</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">FY24 PENALTIES</p>
          </div>
          <div className="pt-6 md:pt-0">
            <div className="text-5xl font-black mb-2 text-teal-400 font-aventa">45s</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">TO MAP NEW POLICIES</p>
          </div>
        </div>
      </div>

    </div>
  );
}
