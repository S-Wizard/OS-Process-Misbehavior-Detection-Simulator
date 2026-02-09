import { cn } from "../../utils";

export function Badge({ className, variant = "default", children, ...props }) {
    const variants = {
        default: "bg-slate-800 text-slate-300 border-slate-700",
        success: "bg-emerald-950/50 text-emerald-400 border-emerald-900",
        warning: "bg-amber-950/50 text-amber-400 border-amber-900",
        danger: "bg-rose-950/50 text-rose-400 border-rose-900",
        info: "bg-blue-950/50 text-blue-400 border-blue-900",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
