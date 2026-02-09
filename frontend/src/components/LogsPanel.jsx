import { Terminal } from "lucide-react";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import { useEffect, useRef } from "react";

export default function LogsPanel({ logs = [] }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <Card className="h-full flex flex-col bg-black">
      <CardHeader>
        <CardTitle className="text-emerald-400">
          <Terminal className="w-5 h-5" />
          System Logs
        </CardTitle>
      </CardHeader>

      <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1 p-2 bg-slate-950/50 rounded border border-slate-800/50 shadow-inner">
        {logs.length === 0 && (
          <div className="text-slate-600 italic px-2">Waiting for events...</div>
        )}

        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-2 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group">
            <span className="text-slate-600 select-none group-hover:text-slate-500">
              {String(idx + 1).padStart(3, '0')}
            </span>
            <span className={getLogColor(log)}>
              {log}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </Card>
  );
}

function getLogColor(text) {
  if (text.includes("ATTACK_START")) return "text-orange-400 font-bold";
  if (text.includes("DETECT")) return "text-primary font-bold";
  if (text.includes("ACTION")) return "text-emerald-400";
  if (text.includes("ALERT")) return "text-red-400";
  return "text-slate-300";
}
