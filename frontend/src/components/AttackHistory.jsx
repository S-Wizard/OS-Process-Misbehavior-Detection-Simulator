import { useState, useEffect } from "react";
import { History, Clock, FileWarning, CheckCircle, XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { api } from "../services/api";

export default function AttackHistory() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await api.getHistory();
                setHistory(data);
            } catch (error) {
                console.error("Failed to load history", error);
            }
        };

        fetchHistory();
        const interval = setInterval(fetchHistory, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="h-full border-indigo-500/20 bg-indigo-500/5">
            <CardHeader>
                <CardTitle className="text-indigo-400">
                    <History className="w-5 h-5" />
                    Attack History
                </CardTitle>
            </CardHeader>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                        <tr>
                            <th className="px-4 py-2">Time</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">PID</th>
                            <th className="px-4 py-2">Outcome</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                                    No entries recorded
                                </td>
                            </tr>
                        ) : (
                            history.map((entry, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-2 font-mono text-slate-300">{entry.start_time}</td>
                                    <td className="px-4 py-2">
                                        <Badge variant="outline" className="text-xs uppercase">
                                            {entry.type}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-2 font-mono text-slate-500">{entry.pid}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-1.5">
                                            {getOutcomeIcon(entry.outcome)}
                                            <span className={getOutcomeColor(entry.outcome)}>
                                                {entry.outcome}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

function getOutcomeIcon(outcome) {
    if (outcome === "Running") return <Clock className="w-3 h-3 text-amber-500" />;
    if (outcome.includes("Terminated")) return <CheckCircle className="w-3 h-3 text-emerald-500" />;
    return <FileWarning className="w-3 h-3 text-slate-500" />;
}

function getOutcomeColor(outcome) {
    if (outcome === "Running") return "text-amber-400";
    if (outcome.includes("Terminated")) return "text-emerald-400";
    return "text-slate-400";
}
