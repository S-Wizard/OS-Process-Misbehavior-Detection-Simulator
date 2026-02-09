export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-slate-300 font-sans selection:bg-primary/20">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[20%] h-[20%] bg-danger/5 rounded-full blur-[80px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  );
}
