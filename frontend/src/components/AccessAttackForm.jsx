import { useState } from "react";

export default function AccessAttackForm() {
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState(2);
  const [total, setTotal] = useState(10);
  const [delay, setDelay] = useState(0.1);
  const [violation, setViolation] = useState("FILE_ACCESS");
  const [status, setStatus] = useState("");

  async function startAccessAttack() {
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost:5000/api/attack/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "access",
          params: {
            rate: Number(rate),
            total: Number(total),
            delay: Number(delay),
            violation
          }
        })
      });

      const data = await res.json();
      setStatus(data.message || "Access attack started");
    } catch {
      setStatus("Failed to start access attack");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-red-400 mb-4">
        Unauthorized Access Attack
      </h3>

      <div className="space-y-3">
        <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="w-full p-2 rounded bg-slate-800 text-white" />
        <input type="number" value={total} onChange={e => setTotal(e.target.value)} className="w-full p-2 rounded bg-slate-800 text-white" />
        <input type="number" value={delay} onChange={e => setDelay(e.target.value)} className="w-full p-2 rounded bg-slate-800 text-white" />

        <select value={violation} onChange={e => setViolation(e.target.value)} className="w-full p-2 rounded bg-slate-800 text-white">
          <option value="FILE_ACCESS">File Access</option>
          <option value="NETWORK_ACCESS">Network Access</option>
          <option value="PRIVILEGE_ESCALATION">Privilege Escalation</option>
        </select>

        <button
          onClick={startAccessAttack}
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-black 
          ${loading ? "bg-red-300" : "bg-red-400 hover:brightness-110"}`}
        >
          {loading ? "Starting…" : "Start Access Attack"}
        </button>

        {status && <div className="text-sm bg-slate-800 p-2 rounded">{status}</div>}
      </div>
    </div>
  );
}
