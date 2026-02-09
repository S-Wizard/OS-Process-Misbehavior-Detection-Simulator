import { cn } from "../../utils";

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn(
                "glass-panel rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }) {
    return (
        <h3
            className={cn(
                "text-lg font-semibold leading-none tracking-tight text-white flex items-center gap-2",
                className
            )}
            {...props}
        >
            {children}
        </h3>
    );
}
