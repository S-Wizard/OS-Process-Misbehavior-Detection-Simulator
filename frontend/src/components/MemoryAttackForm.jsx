import { useState } from "react";

export default function MemoryAttackForm() {
  const [loading, setLoading] = useState(false);
  const [chunk, setChunk] = useState(50);
  const [interval, setInterval] = useState(1);
  const [duration, setDuration] = useState(10);
  const [status, setStatus] = useState("");

  async function startMemoryAttack() {
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost:5000/api/attack/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "memory",
          params: {
            chunk: Number(chunk),
            interval: Number(interval),
            duration: Number(duration)
          }
        })
      });

      const data = await res.json();
      setStatus(data.message || "Memory attack started");
    } catch {
      setStatus("Failed to start memory attack");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-purple-400 mb-4">
        Create Memory Attack
      </h3>

      <div className="space-y-3">
        <input type="number" value={chunk} onChange={e => setChunk(e.target.value)} className="w-full p-2 rounded bg-slate-800 text-white" />
        <input type="number" value={interval} onChange={e => setInterval(e.target.value)} className="w-full p-2 rounded bg-slate-800 text-white" />
        <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-2 rounded bg-slate-800 text-white" />

        <button
          onClick={startMemoryAttack}
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-black 
          ${loading ? "bg-purple-300" : "bg-purple-400 hover:brightness-110"}`}
        >
          {loading ? "Starting…" : "Start Memory Attack"}
        </button>

        {status && <div className="text-sm bg-slate-800 p-2 rounded">{status}</div>}
      </div>
    </div>
  );
}
