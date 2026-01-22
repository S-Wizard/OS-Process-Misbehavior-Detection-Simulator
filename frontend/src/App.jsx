import Layout from "./components/Layout";
import Header from "./components/Header";
import Placeholder from "./components/Placeholder";
import CpuAttackForm from "./components/CpuAttackForm";
import MemoryAttackForm from "./components/MemoryAttackForm";
import AccessAttackForm from "./components/AccessAttackForm";
import MetricsCharts from "./components/MetricsCharts";
import AlertsPanel from "./components/AlertsPanel";
import LogsPanel from "./components/LogsPanel";

export default function App() {
  return (
    <Layout>
      <Header />

      {/* Top Section */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-slate-300 mb-4">
          Attack Control Panel
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CpuAttackForm />
          <MemoryAttackForm />
          <AccessAttackForm />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-slate-300 mb-3">
        Live System Metrics
      </h2>

      <div className="w-full">
        <MetricsCharts />
      </div>

      <h2 className="text-xl font-semibold text-slate-300 mb-3">
        Detection & Monitoring
      </h2>
      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AlertsPanel />
        <LogsPanel />
      </div>


    </Layout>
  );
}

