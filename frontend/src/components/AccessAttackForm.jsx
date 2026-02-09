import { useState } from "react";
import { useAttacks } from "../hooks/useAttacks";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { ShieldAlert, Lock } from "lucide-react";

export default function AccessAttackForm({ openTimeline }) {
  const [rate, setRate] = useState(2);
  const [total, setTotal] = useState(10);
  const [delay, setDelay] = useState(0.1);
  const [violation, setViolation] = useState("FILE_ACCESS");
  const [status, setStatus] = useState("");

  const { launchAttack, loading } = useAttacks();

  async function startAccessAttack() {
    setStatus("");
    try {
      const data = await launchAttack("access", {
        rate: Number(rate),
        total: Number(total),
        delay: Number(delay),
        violation
      });
      setStatus(data.message || "Access attack started");
      openTimeline();
    } catch (err) {
      setStatus("Failed to start access attack");
    }
  }

  return (
    <Card className="hover:border-danger/50 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <ShieldAlert className="w-24 h-24 text-danger" />
      </div>

      <CardHeader>
        <CardTitle className="text-danger">
          <Lock className="w-5 h-5" />
          Access Violation
        </CardTitle>
      </CardHeader>

      <div className="space-y-4 relative z-10">
        <div>
          <label className="text-xs font-mono text-slate-400 mb-1 block">VIOLATION TYPE</label>
          <select
            value={violation}
            onChange={(e) => setViolation(e.target.value)}
            className="input-tech w-full border-danger/30 focus:border-danger focus:ring-danger/20"
          >
            <option value="FILE_ACCESS">Restricted File Access</option>
            <option value="NETWORK_ACCESS">Unauthorized Port Scan</option>
            <option value="PRIVILEGE_ESCALATION">Root Privilege Escalation</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-slate-400 mb-1 block">ATTEMPTS/SEC</label>
            <input
              type="number"
              min="1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="input-tech w-full border-danger/30 focus:border-danger focus:ring-danger/20"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-slate-400 mb-1 block">TOTAL TRIES</label>
            <input
              type="number"
              min="1"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="input-tech w-full border-danger/30 focus:border-danger focus:ring-danger/20"
            />
          </div>
        </div>

        <Button
          variant="danger"
          className="w-full mt-2"
          onClick={startAccessAttack}
          isLoading={loading}
        >
          {loading ? "BREACHING..." : "Simulate Breach"}
        </Button>

        {status && (
          <div className="text-xs font-mono text-center text-danger/80 bg-danger/10 py-1 rounded border border-danger/20">
            {status}
          </div>
        )}
      </div>
    </Card>
  );
}
