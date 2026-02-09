import { useState, useEffect } from "react";
import { Sliders, Save } from "lucide-react";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { api } from "../services/api";

const thresholdConfig = {
    cpu: { label: "CPU Threshold (%)", min: 10, max: 100, step: 5 },
    memory: { label: "Memory Threshold (MB)", min: 50, max: 1000, step: 50 },
    access_count: { label: "Access Violations", min: 1, max: 20, step: 1 },
};

export default function ThresholdSettings() {
    const [thresholds, setThresholds] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadThresholds();
    }, []);

    const loadThresholds = async () => {
        try {
            const data = await api.getThresholds();
            setThresholds(data);
        } catch (error) {
            console.error("Failed to load thresholds", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key, value) => {
        setThresholds(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async (key) => {
        try {
            await api.updateThreshold(key, thresholds[key]);
            // Optional: Show success feedback
        } catch (error) {
            console.error("Failed to update threshold", error);
        }
    };

    if (loading) return null;

    return (
        <Card className="border-violet-500/20 bg-violet-500/5">
            <CardHeader>
                <CardTitle className="text-violet-400">
                    <Sliders className="w-5 h-5" />
                    Detection Thresholds
                </CardTitle>
            </CardHeader>

            <div className="space-y-4 px-4 pb-4">
                {Object.entries(thresholdConfig).map(([key, config]) => (
                    <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <label className="text-slate-300 font-medium">{config.label}</label>
                            <span className="text-violet-300 font-mono font-bold">{thresholds[key]}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <input
                                type="range"
                                min={config.min}
                                max={config.max}
                                step={config.step}
                                value={thresholds[key] || config.min}
                                onChange={(e) => handleChange(key, parseInt(e.target.value))}
                                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                            />
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                                onClick={() => handleSave(key)}
                                title="Save change"
                            >
                                <Save className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
