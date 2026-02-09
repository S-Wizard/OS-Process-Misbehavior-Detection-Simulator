import { useState } from "react";
import { useAttacks } from "../hooks/useAttacks";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Cpu, Zap } from "lucide-react";

export default function CpuAttackForm({ openTimeline }) {
  const [intensity, setIntensity] = useState(90);
  const [duration, setDuration] = useState(10);
  const [threads, setThreads] = useState(1);
  const [status, setStatus] = useState("");

  const { launchAttack, loading } = useAttacks();

  async function startCpuAttack() {
    setStatus("");
    try {
      const data = await launchAttack("cpu", {
        intensity: Number(intensity),
        duration: Number(duration),
        threads: Number(threads)
      });
      setStatus(data.message || "CPU attack started");
      openTimeline();
    } catch (err) {
      setStatus("Failed to start CPU attack");
    }
  }

  return (
    <Card className="hover:border-primary/50 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <Cpu className="w-24 h-24 text-primary" />
      </div>

      <CardHeader>
        <CardTitle className="text-primary">
          <Zap className="w-5 h-5" />
          CPU Overload
        </CardTitle>
      </CardHeader>

      <div className="space-y-4 relative z-10">
        <div>
          <label className="text-xs font-mono text-slate-400 mb-1 block">INTENSITY (%)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="10"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="w-full accent-primary h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="font-mono text-primary w-8 text-right">{intensity}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-slate-400 mb-1 block">DURATION (s)</label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input-tech w-full"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-slate-400 mb-1 block">THREADS</label>
            <input
              type="number"
              min="1"
              max="8"
              value={threads}
              onChange={(e) => setThreads(e.target.value)}
              className="input-tech w-full"
            />
          </div>
        </div>

        <Button
          variant="primary"
          className="w-full mt-2"
          onClick={startCpuAttack}
          isLoading={loading}
        >
          {loading ? "INITIALIZING..." : "LAUNCH ATTACK"}
        </Button>

        {status && (
          <div className="text-xs font-mono text-center text-primary/80 bg-primary/10 py-1 rounded border border-primary/20">
            {status}
          </div>
        )}
      </div>
    </Card>
  );
}
