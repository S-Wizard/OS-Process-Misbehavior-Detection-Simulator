import { useEffect, useState } from "react";

export default function LogsPanel() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5000/api/logs");
        const data = await res.json();
        setLogs(data || []);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-64 overflow-y-auto">
      <h3 className="text-lg font-semibold text-blue-400 mb-3">
        📜 Logs
      </h3>

      {logs.length === 0 && (
        <div className="text-slate-500 text-sm">
          No logs yet
        </div>
      )}

      <ul className="space-y-1">
        {logs.map((log, idx) => (
          <li
            key={idx}
            className="text-sm text-slate-300"
          >
            {log}
          </li>
        ))}
      </ul>
    </div>
  );
}
