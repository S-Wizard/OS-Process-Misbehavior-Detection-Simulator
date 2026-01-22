import { useState } from "react";

export default function CpuAttackForm() {
  const [loading, setLoading] = useState(false);
  const [intensity, setIntensity] = useState(90);
  const [duration, setDuration] = useState(10);
  const [threads, setThreads] = useState(1);
  const [status, setStatus] = useState("");

  async function startCpuAttack() {
  setLoading(true);
  setStatus("");

  try {
    const res = await fetch("http://localhost:5000/api/attack/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "cpu",
        params: {
          intensity: Number(intensity),
          duration: Number(duration),
          threads: Number(threads)
        }
      })
    });

    const data = await res.json();
    setStatus(data.message || "CPU attack started");
  } catch (err) {
    setStatus("Failed to start CPU attack");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-cyan-400 mb-4">
        Create CPU Attack
      </h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-slate-400">
            Intensity (%)
          </label>
          <input
            type="number"
            min="10"
            max="100"
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            className="w-full p-2 rounded bg-slate-800 text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400">
            Duration (seconds)
          </label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 rounded bg-slate-800 text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400">
            Threads
          </label>
          <input
            type="number"
            min="1"
            max="8"
            value={threads}
            onChange={(e) => setThreads(e.target.value)}
            className="w-full p-2 rounded bg-slate-800 text-white"
          />
        </div>

        <button
  onClick={startCpuAttack}
  disabled={loading}
  className={`w-full py-2 rounded-lg font-semibold text-black transition 
    ${loading ? "bg-cyan-300 cursor-not-allowed" : "bg-cyan-400 hover:brightness-110 active:scale-95"}`}
>
  {loading ? (
    <div className="flex items-center justify-center gap-2">
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
      Starting…
    </div>
  ) : (
    "Start CPU Attack"
  )}
</button>


        {status && (
          <div className="text-sm mt-2 px-3 py-2 rounded bg-slate-800 text-slate-300">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
