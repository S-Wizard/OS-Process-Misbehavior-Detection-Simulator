import { useState } from "react";
import { useAttacks } from "../hooks/useAttacks";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Server, Database } from "lucide-react";

export default function MemoryAttackForm({ openTimeline }) {
  const [chunk, setChunk] = useState(50);
  const [interval, setInterval] = useState(1);
  const [duration, setDuration] = useState(10);
  const [status, setStatus] = useState("");

  const { launchAttack, loading } = useAttacks();

  async function startMemoryAttack() {
    setStatus("");
    try {
      const data = await launchAttack("memory", {
        chunk: Number(chunk),
        interval: Number(interval),
        duration: Number(duration)
      });
      setStatus(data.message || "Memory attack started");
      openTimeline();
    } catch (err) {
      setStatus("Failed to start memory attack");
    }
  }

  return (
    <Card className="hover:border-secondary/50 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <Server className="w-24 h-24 text-secondary" />
      </div>

      <CardHeader>
        <CardTitle className="text-secondary">
          <Database className="w-5 h-5" />
          Memory Leak
        </CardTitle>
      </CardHeader>

      <div className="space-y-4 relative z-10">
        <div>
          <label className="text-xs font-mono text-slate-400 mb-1 block">ALLOCATION/STEP (MB)</label>
          <input
            type="number"
            min="10"
            value={chunk}
            onChange={(e) => setChunk(e.target.value)}
            className="input-tech w-full border-secondary/30 focus:border-secondary focus:ring-secondary/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-slate-400 mb-1 block">INTERVAL (s)</label>
            <input
              type="number"
              step="0.5"
              min="0.1"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="input-tech w-full border-secondary/30 focus:border-secondary focus:ring-secondary/20"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-slate-400 mb-1 block">DURATION (s)</label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input-tech w-full border-secondary/30 focus:border-secondary focus:ring-secondary/20"
            />
          </div>
        </div>

        <Button
          variant="secondary"
          className="w-full mt-2"
          onClick={startMemoryAttack}
          isLoading={loading}
        >
          {loading ? "ALLOCATING..." : "Inject Leak"}
        </Button>

        {status && (
          <div className="text-xs font-mono text-center text-secondary/80 bg-secondary/10 py-1 rounded border border-secondary/20">
            {status}
          </div>
        )}
      </div>
    </Card>
  );
}
