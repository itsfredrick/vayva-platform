import Link from 'next/link';
import { ROUTES } from "@/lib/routes";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl font-bold text-[#0B1220] mb-4">Page Not Found</h2>
            <p className="text-slate-500 mb-8 text-lg">Could not find requested resource.</p>
            <div className="flex gap-4">
                <Link
                    href={ROUTES.home}
                    className="px-6 py-3 rounded-xl bg-[#22C55E] text-white font-medium hover:bg-[#16A34A] transition-colors"
                >
                    Return Home
                </Link>
                <Link
                    href={ROUTES.templates}
                    className="px-6 py-3 rounded-xl border border-slate-200 text-[#0B1220] font-medium hover:border-[#22C55E] transition-colors"
                >
                    Browse Templates
                </Link>
            </div>
        </div>
    );
}
