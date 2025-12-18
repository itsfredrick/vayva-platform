import React from 'react';
import { cn } from '../../lib/utils'; // Assuming lib/utils exists or will create it

export function Container({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <div className={cn("mx-auto w-full max-w-7xl px-5 md:px-10", className)}>
            {children}
        </div>
    );
}
