import { useState } from "react";
import { useMetrics } from "./hooks/useMetrics";

import Layout from "./components/Layout";
import Sidebar from "./components/Sidebar";
import AttackTimelineModal from "./components/AttackTimelineModal";

// Views
import Overview from "./views/Overview";
import AttackControls from "./views/AttackControls";
import SystemMonitor from "./views/SystemMonitor";
import EventLogs from "./views/EventLogs";

export default function App() {
    const [currentView, setCurrentView] = useState("overview");
    const [showTimeline, setShowTimeline] = useState(false);
    const [timelineStartIndex, setTimelineStartIndex] = useState(0);

    // Centralized data fetching
    const { metrics, logs, alerts, status } = useMetrics();

    function openTimeline() {
        setTimelineStartIndex(logs.length);
        setShowTimeline(true);
    }

    // View Router
    const renderView = () => {
        switch (currentView) {
            case "overview":
                return <Overview metrics={metrics} alerts={alerts} status={status} />;
            case "controls":
                return <AttackControls openTimeline={openTimeline} />;
            case "monitor":
                return <SystemMonitor metrics={metrics} />;
            case "logs":
                return <EventLogs logs={logs} />;
            default:
                return <Overview metrics={metrics} alerts={alerts} status={status} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-black font-sans text-slate-300">
            <Sidebar currentView={currentView} setView={setCurrentView} />

            <div className="flex-1 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-20 relative">
                <Layout>
                    {renderView()}
                </Layout>
            </div>

            <AttackTimelineModal
                open={showTimeline}
                onClose={() => setShowTimeline(false)}
                logs={logs}
                startIndex={timelineStartIndex}
            />
        </div>
    );
}
