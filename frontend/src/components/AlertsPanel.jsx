import { useEffect, useState } from "react";

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5000/api/alerts");
        const data = await res.json();
        setAlerts(data || []);
      } catch (err) {
        console.error("Failed to fetch alerts", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 border border-red-900 rounded-xl p-4 h-64 overflow-y-auto">
      <h3 className="text-lg font-semibold text-red-400 mb-3">
        🚨 Alerts
      </h3>

      {alerts.length === 0 && (
        <div className="text-slate-500 text-sm">
          No alerts yet
        </div>
      )}

      <ul className="space-y-2">
        {alerts.map((alert, idx) => (
          <li
            key={idx}
            className="text-sm text-red-300 font-medium"
          >
            {alert}
          </li>
        ))}
      </ul>
    </div>
  );
}
