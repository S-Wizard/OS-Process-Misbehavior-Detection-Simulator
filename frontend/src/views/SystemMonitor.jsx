import MetricsCharts from "../components/MetricsCharts";
import { Activity } from "lucide-react";

export default function SystemMonitor({ metrics }) {
    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <div className="p-2 bg-cyan-500/10 rounded border border-cyan-500/20">
                    <Activity className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">System Monitor</h2>
                    <p className="text-sm text-slate-400">Real-time resource utilization telemetry.</p>
                </div>
            </div>

            <div className="flex-1">
                <MetricsCharts
                    cpuData={metrics?.cpu || []}
                    memData={metrics?.memory || []}
                />
            </div>
        </div>
    );
}
