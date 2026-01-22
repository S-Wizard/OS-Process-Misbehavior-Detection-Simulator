import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function MetricsCharts() {
  const [cpuData, setCpuData] = useState([]);
  const [memData, setMemData] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5000/api/metrics");
        const data = await res.json();

        setCpuData(data.cpu || []);
        setMemData(data.memory || []);
      } catch (err) {
        console.error("Failed to fetch metrics", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const cpuChart = {
    labels: cpuData.map((_, i) => i),
    datasets: [
      {
        label: "CPU Usage (%)",
        data: cpuData,
        borderColor: "#22d3ee",
        tension: 0.3
      }
    ]
  };

  const memChart = {
    labels: memData.map((_, i) => i),
    datasets: [
      {
        label: "Memory Usage (MB)",
        data: memData,
        borderColor: "#a78bfa",
        tension: 0.3
      }
    ]
  };

  const options = {
  responsive: true,
  maintainAspectRatio: false,   // 👈 VERY IMPORTANT
  animation: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 100
    }
  }
};

  return (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

    {/* CPU Chart */}
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 h-[420px]">
      <h3 className="text-xl font-semibold text-cyan-400 mb-4">
        CPU Usage (%)
      </h3>
      <div className="h-[320px]">
        <Line data={cpuChart} options={options} />
      </div>
    </div>

    {/* Memory Chart */}
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 h-[420px]">
      <h3 className="text-xl font-semibold text-purple-400 mb-4">
        Memory Usage (MB)
      </h3>
      <div className="h-[320px]">
        <Line data={memChart} options={options} />
      </div>
    </div>

  </div>
);

}
