import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useMetrics() {
    const [metrics, setMetrics] = useState({ cpu: [], memory: [] });
    const [logs, setLogs] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [status, setStatus] = useState({ health: 100, active_protections_count: 3, active_attacks: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [m, l, a, s] = await Promise.all([
                    api.getMetrics(),
                    api.getLogs(),
                    api.getAlerts(),
                    api.getStatus(),
                ]);
                setMetrics(m);
                setLogs(l);
                setAlerts(a);
                setStatus(s);
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
    }, []);

    return { metrics, logs, alerts, status };
}

