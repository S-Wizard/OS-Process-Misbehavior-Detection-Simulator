export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
            {children}
        </div>
    </div>

  );
}
