import React from "react";
import { Icon } from "@vayva/ui";
import Link from "next/link";

interface ProFeatureUpsellProps {
    title: string;
    description: string;
    icon?: string;
}

export const ProFeatureUpsell: React.FC<ProFeatureUpsellProps> = ({
    title,
    description,
    icon = "Lock",
}) => {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center min-h-[160px] p-6 text-center group">
            {/* Blurred / Pattern Background */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 flex flex-col items-center max-w-sm">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                    <Icon name={icon as any} size={20} className="text-gray-500 group-hover:text-green-600 transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                    {description}
                </p>
                <Link href="/dashboard/billing?upgrade=pro" className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                    <span>Upgrade to Pro</span>
                    <Icon name="ArrowRight" size={12} />
                </Link>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-500/20 rounded-2xl transition-colors pointer-events-none" />
        </div>
    );
};
