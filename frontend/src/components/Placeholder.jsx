export default function Placeholder({ title }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-full">
      <h3 className="text-lg font-semibold text-slate-300 mb-2">
        {title}
      </h3>
      <div className="text-slate-500 text-sm">
        Component coming soon…
      </div>
    </div>
  );
}
