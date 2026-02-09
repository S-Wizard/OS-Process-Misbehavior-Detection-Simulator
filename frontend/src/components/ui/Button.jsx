import { cn } from "../../utils";

export function Button({
    className,
    variant = "primary",
    size = "default",
    isLoading,
    children,
    ...props
}) {
    const variants = {
        primary: "bg-primary text-black hover:bg-cyan-400 focus:ring-cyan-500",
        secondary: "bg-secondary text-white hover:bg-violet-400 focus:ring-violet-500",
        danger: "bg-danger text-white hover:bg-rose-400 focus:ring-rose-500",
        ghost: "bg-transparent text-slate-300 hover:bg-slate-800",
        outline: "border border-slate-700 text-slate-300 hover:bg-slate-800",
    };

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-lg",
    };

    return (
        <button
            className={cn(
                "btn-tech inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {children}
        </button>
    );
}
