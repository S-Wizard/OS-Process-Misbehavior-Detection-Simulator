import { LayoutDashboard, ShieldAlert, Activity, ScrollText, CircuitBoard } from "lucide-react";
import { cn } from "../utils";

export default function Sidebar({ currentView, setView }) {
    const menuItems = [
        { id: "overview", label: "Mission Overview", icon: LayoutDashboard },
        { id: "controls", label: "Attack Controls", icon: ShieldAlert },
        { id: "monitor", label: "System Monitor", icon: Activity },
        { id: "logs", label: "Event Logs", icon: ScrollText },
    ];

    return (
        <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0">
            {/* Brand */}
            <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
                <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                    <CircuitBoard className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="font-bold text-white tracking-wider text-sm">OS SIMULATOR</h1>
                    <p className="text-[10px] text-slate-500 font-mono">KERNEL.SYS v2.4</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300")} />
                            {item.label}

                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Status Footer */}
            <div className="p-4 border-t border-slate-800/50">
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 text-xs font-mono">
                    <div className="flex justify-between text-slate-500 mb-1">
                        <span>UPTIME</span>
                        <span className="text-emerald-500">00:42:12</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                        <span>STATUS</span>
                        <span className="text-primary animate-pulse">ONLINE</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
