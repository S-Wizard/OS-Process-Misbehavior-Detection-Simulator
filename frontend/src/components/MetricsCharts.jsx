import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import { Cpu, Zap } from "lucide-react";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

export default function MetricsCharts({ cpuData = [], memData = [] }) {
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        display: false,
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#64748b",
          font: { family: "Fira Code" }
        },
        border: { display: false }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
        borderColor: "#1e293b",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        titleFont: { family: "Inter" },
        bodyFont: { family: "Fira Code" }
      }
    },
    elements: {
      point: { radius: 0, hoverRadius: 4 }
    }
  };

  const cpuChart = {
    labels: cpuData.map((_, i) => i),
    datasets: [
      {
        label: "CPU Usage (%)",
        data: cpuData,
        borderColor: "#06b6d4", // Cyan
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(6, 182, 212, 0.2)"); // Cyan transparent
          gradient.addColorStop(1, "rgba(6, 182, 212, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  const memChart = {
    labels: memData.map((_, i) => i),
    datasets: [
      {
        label: "Memory Usage (MB)",
        data: memData,
        borderColor: "#8b5cf6", // Violet
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(139, 92, 246, 0.2)"); // Violet transparent
          gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <Cpu className="w-5 h-5 text-primary" />
            CPU Load
          </CardTitle>
        </CardHeader>
        <div className="h-[250px] w-full">
          <Line data={cpuChart} options={{
            ...commonOptions,
            scales: { ...commonOptions.scales, y: { ...commonOptions.scales.y, max: 100 } }
          }} />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Zap className="w-5 h-5 text-secondary" />
            Memory Allocation
          </CardTitle>
        </CardHeader>
        <div className="h-[250px] w-full">
          <Line data={memChart} options={commonOptions} />
        </div>
      </Card>
    </div>
  );
}
