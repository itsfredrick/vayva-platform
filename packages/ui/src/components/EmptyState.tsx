import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-100 mb-4 shadow-sm">
                <PackageOpen className="text-gray-400" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
            {action}
        </div>
    );
}
