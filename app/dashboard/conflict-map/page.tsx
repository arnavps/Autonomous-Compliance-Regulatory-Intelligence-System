import { Map, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function ConflictMapPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-aventa tracking-tight">Conflict Explorer</h1>
          <p className="text-slate-500 font-garamond italic">Visualize the network of regulatory contradictions and supersessions.</p>
        </div>
        <button 
          onClick={() => toast.success("Graph successfully exported as PDF.")}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50">
          <Share2 className="h-4 w-4" />
          Export Graph
        </button>
      </div>

      <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
        <div className="text-center z-10">
          <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Map className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold mb-2">Graph Engine Ready</h3>
          <p className="text-slate-400 max-w-sm">Select a circular from the Sidebar to visualize its legal dependencies and potential conflicts.</p>
        </div>
      </div>
    </div>
  );
}
