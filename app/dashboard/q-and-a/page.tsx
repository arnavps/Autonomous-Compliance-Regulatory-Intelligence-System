"use client";

import { MessageSquareLock, ShieldEllipsis, User, Bot, Loader2 } from "lucide-react";
import { useState } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
  confidence?: number;
  citations?: string[];
}

export default function QnAPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    const userMessage = query;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setQuery("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: data.answer,
            confidence: data.confidence,
            citations: data.citations,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Error: Could not reach the intelligence engine. Please check backend connection." }
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Network error: Connection to localhost:8000 failed." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold font-aventa tracking-tight">Regulatory Q&A</h1>
          <p className="text-slate-500 font-garamond italic">Ask any regulatory question grounded in verified India FinReg sources.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg">
          <ShieldEllipsis className="h-5 w-5 text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-700">Enterprise Guardrails Active</span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        
        {/* Chat Feed */}
        <div className="flex-1 p-8 overflow-y-auto w-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <MessageSquareLock className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Initialize Compliance Query</h3>
              <p className="text-slate-400 max-w-sm">Type your query below to start a verified search across RBI and SEBI databases.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-indigo-100" : "bg-slate-100 border border-slate-200"}`}>
                    {msg.role === "user" ? <User className="h-5 w-5 text-indigo-600" /> : <Bot className="h-5 w-5 text-slate-600" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-5 ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-slate-50 border border-slate-100 rounded-tl-sm text-slate-700"}`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    
                    {/* Citations block for AI */}
                    {msg.role === "ai" && msg.citations && (
                      <div className="mt-4 pt-4 border-t border-slate-200/60">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Citations</span>
                          {msg.confidence && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${msg.confidence > 80 ? "bg-teal-100 text-teal-700" : "bg-amber-100 text-amber-700"}`}>
                              {msg.confidence}% Confidence
                            </span>
                          )}
                        </div>
                        <ul className="text-xs text-indigo-600 space-y-1">
                          {msg.citations.map((cite, j) => (
                            <li key={j} className="hover:underline cursor-pointer">• {cite}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center bg-slate-100 border border-slate-200">
                    <Bot className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl p-5 bg-slate-50 border border-slate-100 rounded-tl-sm text-slate-700 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    <span className="text-sm text-slate-500 italic">ACRIS is consulting the regulatory database...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Input Block */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-[2rem] flex-shrink-0">
          <div className="relative group">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="e.g., What are the latest KYC norms for Digital Lending as per RBI August 2024 circular?"
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-6 pr-32 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none shadow-sm"
            />
            <button 
              onClick={handleSubmit}
              disabled={isTyping || !query.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Ask ACRIS
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
