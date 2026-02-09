import { Card, CardHeader, CardTitle } from "../components/ui/Card";
import { Activity, ShieldCheck, Cpu, Zap } from "lucide-react";
import AlertsPanel from "../components/AlertsPanel";
import MetricsCharts from "../components/MetricsCharts";
import ProtectionSettings from "../components/ProtectionSettings";
import ThresholdSettings from "../components/ThresholdSettings";
import AttackHistory from "../components/AttackHistory";

export default function Overview({ metrics, alerts, status }) {
    // Calculate health color based on value
    const healthColor = status?.health >= 70 ? "text-emerald-400" :
        status?.health >= 40 ? "text-amber-400" : "text-rose-400";

    const healthTrend = status?.active_attacks > 0 ?
        `-${status.active_attacks * 15}%` : "+0%";

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Activity}
                    label="System Health"
                    value={`${status?.health ?? 100}%`}
                    trend={healthTrend}
                    color={healthColor}
                />
                <StatCard
                    icon={ShieldCheck}
                    label="Active Protections"
                    value={status?.active_protections_count ?? 3}
                    sub="Enabled"
                    color="text-primary"
                />
                <StatCard
                    icon={Cpu}
                    label="CPU Load"
                    value={`${Math.round(metrics?.cpu?.[metrics.cpu.length - 1] || 0)}%`}
                    color="text-cyan-400"
                />
                <StatCard
                    icon={Zap}
                    label="Memory Usage"
                    value={`${Math.round(metrics?.memory?.[metrics.memory.length - 1] || 0)} MB`}
                    color="text-violet-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <MetricsCharts
                        cpuData={metrics?.cpu || []}
                        memData={metrics?.memory || []}
                    />
                </div>
                <div className="lg:col-span-1 h-[300px] lg:h-auto">
                    <AlertsPanel alerts={alerts} />
                </div>
            </div>

            {/* Config Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProtectionSettings protections={status?.protections} />
                <ThresholdSettings />
            </div>

            {/* History Section */}
            <div className="grid grid-cols-1">
                <AttackHistory />
            </div>
        </div>
    );
}




function StatCard({ icon: Icon, label, value, trend, sub, color }) {
    return (
        <Card className="p-4 flex items-center gap-4 border-slate-800 bg-slate-900/40">
            <div className={`p-3 rounded-lg bg-white/5 ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs text-slate-400 font-mono uppercase">{label}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{value}</span>
                    {trend && <span className="text-xs text-emerald-400">{trend}</span>}
                    {sub && <span className="text-xs text-slate-500">{sub}</span>}
                </div>
            </div>
        </Card>
    )
}
