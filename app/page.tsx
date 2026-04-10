"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Map, 
  Radar, 
  Search, 
  FileText, 
  CheckCircle2,
  AlertTriangle,
  Clock
} from "lucide-react";

export default function LandingPage() {
  const stats = {
    circulars: 5,
    conflicts: 1,
    warnings: 3
  };

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-slate font-aventa selection:bg-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold tracking-tight">RegIntel AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-indigo-600 transition-colors">Methodology</Link>
            <Link href="/dashboard/q-and-a" className="px-5 py-2.5 bg-brand-slate text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              Launch Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
              Read, cross-referenced,<br />
              and conflict-checked.
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 font-garamond italic">
              Autonomous Intelligence for RBI & SEBI compliance—deployed before your legal team even wakes up.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-20">
              <Link href="/dashboard/q-and-a" className="group px-8 py-4 bg-indigo-600 text-white rounded-full text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2">
                Launch Intelligence Suite
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-white border border-slate-200 text-brand-slate rounded-full text-lg font-bold hover:bg-slate-50 transition-all">
                Request API Access
              </button>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { label: "Circulars Indexed", value: stats.circulars, icon: FileText, color: "text-indigo-600" },
                { label: "Active Conflicts", value: stats.conflicts, icon: AlertTriangle, color: "text-amber-600" },
                { label: "Draft Warnings", value: stats.warnings, icon: Radar, color: "text-teal-600" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className={`p-4 rounded-2xl bg-slate-50 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section (Brutalism) */}
      <section className="py-32 bg-brand-slate text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div>
              <div className="text-7xl font-bold mb-4 gradient-text brightness-150 font-aventa leading-none">600+</div>
              <p className="text-slate-400 text-lg">Regulatory circulars issued by RBI/SEBI annually. <span className="text-white">Impossible to track manually.</span></p>
            </div>
            <div>
              <div className="text-7xl font-bold mb-4 text-red-400 font-aventa leading-none">₹86Cr</div>
              <p className="text-slate-400 text-lg">Total penalties levied in FY24 for compliance breaches. <span className="text-white">The cost of negligence.</span></p>
            </div>
            <div>
              <div className="text-7xl font-bold mb-4 text-amber-400 font-aventa leading-none">3–10d</div>
              <p className="text-slate-400 text-lg">Average time to map a single circular to internal policy. <span className="text-white">RegIntel does it in 45s.</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-20 tracking-tight">The 5-Step Intelligence Loop</h2>
          <div className="relative flex flex-col md:flex-row justify-between gap-8">
            {[
              { step: "01", title: "Monitor", desc: "Agent 1 scrapes RBI/SEBI sources every 15 minutes." },
              { step: "02", title: "Parse", desc: "Agent 2 extracts semantically split regulatory clauses." },
              { step: "03", title: "Diff", desc: "Agent 3 identifies paragraph-level shifts in law." },
              { step: "04", title: "Map", desc: "Agent 4 links changes to your specific internal policy." },
              { step: "05", title: "Action", desc: "Agent 5/6 drafts amendments and impact reports." },
            ].map((item, idx) => (
              <div key={idx} className="relative flex-1 group">
                <div className="text-6xl font-black text-slate-100 group-hover:text-indigo-50 transition-colors mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
                {idx < 4 && <div className="hidden md:block absolute top-8 -right-4 w-8 h-[2px] bg-slate-100" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trifecta Section (Feature Cards) */}
      <section id="features" className="py-32 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Semantic Diff */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="h-16 w-16 bg-indigo-50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Semantic Diff Engine</h3>
              <p className="text-slate-500 mb-6 font-garamond italic">We dont just find text changes. We find meaning shifts. See exactly how "Shall" transformed to "May" across 400 pages.</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Clause-Level Tracking
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Supersession Graphs
                </div>
              </div>
            </div>

            {/* Conflict Graph */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="h-16 w-16 bg-amber-50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Map className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Conflict Explorer</h3>
              <p className="text-slate-500 mb-6 font-garamond italic">A spatial map of every regulatory contradiction. See where RBI Section A conflicts with SEBI Amendment B instantly.</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Multi-Hop Reasoning
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Contradiction Alerts
                </div>
              </div>
            </div>

            {/* Early Warning */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="h-16 w-16 bg-teal-50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Radar className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Predictive Radar</h3>
              <p className="text-slate-500 mb-6 font-garamond italic">Foresee regulatory shifts based on draft papers and market chatter. Don't just react—respond before it's official.</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Draft Analysis
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Executive Summary
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold tracking-tight">RegIntel AI</span>
            </div>
            <p className="text-slate-400 text-sm">Built for Indian Financial Institutions.<br />PMLA, FEMA, RBI, & SEBI Compliant.</p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-3">
              <span className="font-bold">Platform</span>
              <Link href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Pricing</Link>
              <Link href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">API Docs</Link>
              <Link href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Security</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold">Company</span>
              <Link href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">About Us</Link>
              <Link href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Legal</Link>
              <Link href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-50 text-center text-xs text-slate-400">
          © 2026 RegIntel AI. All rights reserved. Professional Compliance Intelligence.
        </div>
      </footer>
    </div>
  );
}
