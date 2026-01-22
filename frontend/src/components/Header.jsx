import { useState } from "react";

export default function Header() {
  const [stopping, setStopping] = useState(false);
  const [stopStatus, setStopStatus] = useState("");

  async function stopAllAttacks() {
    setStopping(true);
    setStopStatus("");

    try {
      const res = await fetch("http://localhost:5000/api/attack/stop", {
        method: "POST"
      });

      const data = await res.json();
      setStopStatus(data.message || "All attacks stopped successfully");
    } catch (err) {
      setStopStatus("Failed to stop attacks");
    } finally {
      setStopping(false);
    }
  }

  return (
    <div className="mb-6">

      {/* ===== Header Row ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">
            OS Misbehavior Detection Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            Real-time OS Misbehavior Simulation & Detection
          </p>
        </div>

        <button
          onClick={stopAllAttacks}
          disabled={stopping}
          className={`min-w-[170px] px-4 py-2 rounded-lg text-sm font-medium text-black
            transition flex items-center justify-center
            ${stopping
              ? "bg-amber-300 cursor-not-allowed"
              : "bg-amber-400 hover:brightness-110 active:scale-95"
            }`}
        >
          {stopping ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-black border-t-transparent" />
              Stopping…
            </div>
          ) : (
            "⏹ Stop All Attacks"
          )}
        </button>
      </div>

      {/* ===== Status Message (Below Header, No Layout Shift) ===== */}
      {stopStatus && (
        <div className="mt-3 text-sm bg-slate-800 text-slate-300 px-4 py-2 rounded">
          {stopStatus}
        </div>
      )}

    </div>
  );
}
