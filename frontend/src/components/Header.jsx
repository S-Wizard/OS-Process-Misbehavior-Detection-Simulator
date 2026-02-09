import { ShieldCheck, Activity } from "lucide-react";
import { Badge } from "./ui/Badge";

export default function Header() {
  return (
    <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            OS SIMULATOR <span className="text-primary font-mono text-sm opacity-50">v2.0</span>
          </h1>
          <p className="text-sm text-slate-400">Process Misbehavior Detection System</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="success" className="gap-1.5 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          SYSTEM ONLINE
        </Badge>

        <div className="h-8 w-px bg-slate-800" />

        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-500 font-mono">KERNEL.SYS</span>
          <span className="text-xs text-slate-300 font-mono">PID: 001</span>
        </div>
      </div>
    </header>
  );
}
