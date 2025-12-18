'use client';

export interface LegalTOCItem {
    id: string;
    title: string;
}

interface LegalTOCProps {
    items: LegalTOCItem[];
}

export function LegalTOC({ items }: LegalTOCProps) {
    return (
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <nav className="space-y-1">
                <h3 className="text-sm font-semibold text-[#0B1220] mb-4">Table of Contents</h3>
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                className="text-sm text-[#0B1220]/60 hover:text-[#22C55E] transition-colors block py-1"
                            >
                                {item.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
