import CpuAttackForm from "../components/CpuAttackForm";
import MemoryAttackForm from "../components/MemoryAttackForm";
import AccessAttackForm from "../components/AccessAttackForm";
import { Terminal } from "lucide-react";

export default function AttackControls({ openTimeline }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <div className="p-2 bg-red-500/10 rounded border border-red-500/20">
                    <Terminal className="w-5 h-5 text-red-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Attack Command Center</h2>
                    <p className="text-sm text-slate-400">Launch simulated attacks to test system resilience.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CpuAttackForm openTimeline={openTimeline} />
                <MemoryAttackForm openTimeline={openTimeline} />
                <AccessAttackForm openTimeline={openTimeline} />
            </div>
        </div>
    );
}
