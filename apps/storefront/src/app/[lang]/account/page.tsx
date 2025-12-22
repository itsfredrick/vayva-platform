'use client';

import { use } from 'react';
import { LocaleKey, LOCALES } from '@/data/locales';
import { Gift, Package, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang: rawLang } = use(params);
    const lang = (rawLang === 'tr' ? 'tr' : 'en') as LocaleKey;
    const t = LOCALES[lang].account.overview;

    return (
        <div className="space-y-8">
            <div className="bg-[#0B1220] rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">{t.welcome}, Ceren!</h1>
                    <p className="opacity-60">ceren@example.com</p>
                </div>
                {/* Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Plan */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t.planTitle}</h2>
                    <div className="text-xl font-bold mb-2">{t.planDesc}</div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                        Active
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t.quickLinks}</h2>
                    <div className="grid grid-cols-1 gap-3">
                        <Link href={`/${lang}/menu`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                                <Utensils size={18} />
                            </div>
                            <span className="font-bold">{t.menu}</span>
                        </Link>
                        <Link href={`/${lang}/past-deliveries`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <Package size={18} />
                            </div>
                            <span className="font-bold">{t.history}</span>
                        </Link>
                        <Link href={`/${lang}/gift-cards`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                                <Gift size={18} />
                            </div>
                            <span className="font-bold">{t.gift}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
