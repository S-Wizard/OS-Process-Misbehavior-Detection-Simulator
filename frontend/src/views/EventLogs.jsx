import { useRef, useEffect, useState } from "react";
import { ScrollText, Pause, Play, Download, Trash2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { api } from "../services/api";

export default function EventLogs({ logs = [] }) {
    const scrollRef = useRef(null);
    const [autoScroll, setAutoScroll] = useState(true);

    // Smart Auto-Scroll logic
    useEffect(() => {
        if (autoScroll && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, autoScroll]);

    // Detect scroll position to pause auto-scroll
    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

        // If near bottom (within 50px), enable auto-scroll, else disable
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        if (isAtBottom) {
            setAutoScroll(true);
        } else {
            setAutoScroll(false);
        }
    };

    // Export logs as JSON file
    const downloadLogs = () => {
        const dataStr = JSON.stringify(logs, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `event_logs_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Clear logs
    const clearLogs = async () => {
        await api.clearData("logs");
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-500/10 rounded border border-violet-500/20">
                        <ScrollText className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Event Logs</h2>
                        <p className="text-sm text-slate-400">System kernel and detector events.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={clearLogs} disabled={logs.length === 0}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadLogs} disabled={logs.length === 0}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setAutoScroll(!autoScroll)}>
                        {autoScroll ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {autoScroll ? "Live" : "Paused"}
                    </Button>
                    <Badge variant="default">{logs.length} Events</Badge>
                </div>
            </div>


            <Card className="flex-1 overflow-hidden p-0 bg-black border-slate-800">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-900/50 text-xs font-mono text-slate-500 uppercase tracking-wider">
                    <div className="col-span-2">Time</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-8">Message</div>
                </div>

                {/* Scrollable Body */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="h-full overflow-y-auto custom-scrollbar pb-10"
                >
                    {logs.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No events recorded.</div>
                    ) : (
                        logs.map((log, i) => {
                            // Support both string and object formats
                            const message = typeof log === 'string' ? log : log.message;
                            const timestamp = typeof log === 'string' ? '--:--:--' : log.time;
                            const type = getLogType(message);
                            return (
                                <div key={i} className="grid grid-cols-12 gap-4 p-3 border-b border-slate-800/50 hover:bg-white/5 text-sm font-mono transition-colors">
                                    <div className="col-span-2 text-slate-500">
                                        {timestamp}
                                    </div>
                                    <div className="col-span-2">
                                        <LogBadge type={type} />
                                    </div>
                                    <div className="col-span-8 text-slate-300">
                                        {message}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </Card>
        </div>
    );
}

function LogBadge({ type }) {
    switch (type) {
        case "ATTACK": return <Badge variant="danger" className="text-[10px]">ATTACK</Badge>;
        case "DETECT": return <Badge variant="info" className="text-[10px] bg-cyan-950 text-cyan-400 border-cyan-900">DETECT</Badge>;
        case "ACTION": return <Badge variant="success" className="text-[10px]">ACTION</Badge>;
        default: return <Badge variant="default" className="text-[10px]">INFO</Badge>;
    }
}

function getLogType(text) {
    if (text.includes("ATTACK_START")) return "ATTACK";
    if (text.includes("DETECT")) return "DETECT";
    if (text.includes("ACTION")) return "ACTION";
    if (text.includes("ALERT")) return "ATTACK";
    return "INFO";
}
