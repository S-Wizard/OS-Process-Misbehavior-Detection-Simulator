import { AlertTriangle, Bell, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { api } from "../services/api";

export default function AlertsPanel({ alerts = [] }) {
  const clearAlerts = async () => {
    await api.clearData("alerts");
  };

  return (
    <Card className="h-full flex flex-col border-red-900/30 bg-red-950/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-red-400">
          <AlertTriangle className="w-5 h-5" />
          Active Alerts
        </CardTitle>
        {alerts.length > 0 && (
          <Button size="sm" variant="ghost" onClick={clearAlerts} className="text-red-400 hover:text-red-300 hover:bg-red-950/50">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
            <Bell className="w-8 h-8 mb-2" />
            <span className="text-xs uppercase tracking-widest">No Active Threats</span>
          </div>
        ) : (
          alerts.map((alert, idx) => (
            <div
              key={idx}
              className="p-3 rounded bg-red-950/30 border border-red-900/50 flex gap-3 animate-pulse-glow"
            >
              <div className="mt-1 min-w-[6px] h-1.5 rounded-full bg-red-500 animate-pulse" />
              <p className="text-sm text-red-200 font-mono leading-relaxed">
                {alert}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

