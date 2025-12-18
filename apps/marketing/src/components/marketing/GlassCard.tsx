import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false }: GlassCardProps) {
    return (
        <div
            className={cn(
                "bg-white/70 backdrop-blur-xl border border-slate-900/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl md:rounded-3xl p-6 md:p-8",
                hoverEffect && "transition-all duration-300 hover:bg-white/80 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]",
                className
            )}
        >
            {children}
        </div>
    );
}
