import { Shield, ShieldCheck, ShieldOff } from "lucide-react";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import { api } from "../services/api";

const protectionLabels = {
    cpu_detector: { name: "CPU Detector", desc: "Monitors CPU abuse" },
    memory_detector: { name: "Memory Detector", desc: "Monitors memory abuse" },
    access_monitor: { name: "Access Monitor", desc: "Monitors unauthorized access" },
};

export default function ProtectionSettings({ protections = {} }) {
    const handleToggle = async (key) => {
        await api.toggleProtection(key);
    };

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="text-primary">
                    <Shield className="w-5 h-5" />
                    Protection Settings
                </CardTitle>
            </CardHeader>

            <div className="space-y-3">
                {Object.entries(protectionLabels).map(([key, { name, desc }]) => {
                    const isEnabled = protections[key] ?? true;
                    return (
                        <div
                            key={key}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:bg-white/5 ${isEnabled
                                    ? "border-primary/30 bg-primary/10"
                                    : "border-slate-700 bg-slate-900/50"
                                }`}
                            onClick={() => handleToggle(key)}
                        >
                            <div className="flex items-center gap-3">
                                {isEnabled ? (
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                ) : (
                                    <ShieldOff className="w-5 h-5 text-slate-500" />
                                )}
                                <div>
                                    <div className="text-sm font-medium text-white">{name}</div>
                                    <div className="text-xs text-slate-400">{desc}</div>
                                </div>
                            </div>
                            <div
                                className={`w-10 h-5 rounded-full relative transition-colors ${isEnabled ? "bg-primary" : "bg-slate-600"
                                    }`}
                            >
                                <div
                                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isEnabled ? "left-[22px]" : "left-0.5"
                                        }`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
