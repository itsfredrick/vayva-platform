import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
    id?: string;
    children: ReactNode;
    className?: string;
    fullWidth?: boolean;
}

export function Section({ id, children, className, fullWidth = false }: SectionProps) {
    return (
        <section
            id={id}
            className={cn(
                "py-16 md:py-24 relative scroll-mt-24", // Scroll margin for sticky header
                className
            )}
        >
            {fullWidth ? (
                children
            ) : (
                <div className="max-w-4xl mx-auto px-0">
                    {children}
                </div>
            )}
        </section>
    );
}
