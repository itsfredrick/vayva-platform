import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeroProps {
    title: string | ReactNode;
    subtitle?: string | ReactNode;
    children?: ReactNode; // For actions/buttons
    className?: string;
    align?: 'center' | 'left';
    lastUpdated?: string;
}

export function PageHero({ title, subtitle, children, className, align = 'center', lastUpdated }: PageHeroProps) {
    return (
        <div
            className={cn(
                "pt-24 pb-12 md:pt-32 md:pb-20",
                align === 'center' ? "text-center mx-auto max-w-3xl" : "text-left max-w-4xl",
                className
            )}
        >
            <h1 className="text-4xl md:text-6xl font-bold text-[#0B1220] tracking-tight mb-6 leading-[1.1]">
                {title}
            </h1>
            {subtitle && (
                <div className={cn(
                    "text-lg md:text-xl text-[#0B1220]/60 font-medium leading-relaxed mb-8",
                    align === 'center' ? "mx-auto max-w-2xl" : ""
                )}>
                    {typeof subtitle === 'string' ? <p>{subtitle}</p> : subtitle}
                </div>
            )}
            {lastUpdated && (
                <p className="text-sm text-[#0B1220]/50 mb-6">Last updated: {lastUpdated}</p>
            )}
            {children && (
                <div className={cn("flex flex-col sm:flex-row gap-4", align === 'center' ? "justify-center" : "justify-start")}>
                    {children}
                </div>
            )}
        </div>
    );
}
