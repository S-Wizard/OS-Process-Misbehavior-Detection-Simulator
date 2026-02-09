import { X, Clock, Activity } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function AttackTimelineModal({ open, onClose, logs, startIndex }) {
    const modalRef = useRef(null);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!open) return null;

    // Filter logs that happened after the attack started
    const sessionLogs = logs.slice(startIndex);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                ref={modalRef}
                className="glass-panel w-full max-w-2xl max-h-[80vh] flex flex-col rounded-xl shadow-2xl border border-primary/20 animate-in zoom-in-95 duration-200"
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-2 text-primary">
                        <Activity className="w-5 h-5" />
                        <h2 className="font-bold tracking-wide uppercase">Attack Execution Timeline</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-black/40">
                    {sessionLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-500 gap-2">
                            <Clock className="w-8 h-8 opacity-50" />
                            <p>Initializing attack sequence...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sessionLogs.map((log, i) => {
                                // Support both string and object formats
                                const message = typeof log === 'string' ? log : log.message;
                                const timestamp = typeof log === 'string' ? `T+${i.toFixed(1)}s` : log.time;

                                return (
                                    <div key={i} className="relative pl-6 border-l border-slate-700 pb-1 last:border-0 last:pb-0">
                                        <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-black ${getDotColor(message)}`} />
                                        <div className="text-xs text-slate-500 font-mono mb-1">
                                            {timestamp}
                                        </div>
                                        <div className={`text-sm font-mono p-3 rounded-lg border bg-opacity-10 ${getLogStyle(message)}`}>
                                            {message}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 rounded transition-colors"
                    >
                        Close Report
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

function getDotColor(message) {
    if (!message) return "bg-slate-500";
    if (message.includes("ATTACK_START")) return "bg-orange-500";
    if (message.includes("DETECT")) return "bg-primary";
    if (message.includes("ACTION")) return "bg-emerald-500";
    return "bg-slate-500";
}

function getLogStyle(message) {
    if (!message) return "bg-slate-500 text-slate-200 border-slate-500/30";
    if (message.includes("ATTACK_START")) return "bg-orange-500 text-orange-200 border-orange-500/30";
    if (message.includes("DETECT")) return "bg-cyan-500 text-cyan-200 border-cyan-500/30";
    if (message.includes("ACTION")) return "bg-emerald-500 text-emerald-200 border-emerald-500/30";
    if (message.includes("ALERT")) return "bg-rose-500 text-rose-200 border-rose-500/30";
    return "bg-slate-500 text-slate-200 border-slate-500/30";
}
