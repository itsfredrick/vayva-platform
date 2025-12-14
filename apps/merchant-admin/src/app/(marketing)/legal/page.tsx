'use client';

import React from 'react';
import Link from 'next/link';

export default function LegalHubPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-12">Legal Center</h1>
                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        { title: 'Terms of Service', desc: 'The rules for using Vayva.', link: '/legal/terms' },
                        { title: 'Privacy Policy', desc: 'How we handle your data.', link: '/legal/privacy' },
                        { title: 'Acceptable Use Policy', desc: 'What you can and cannot sell.', link: '#' },
                        { title: 'Merchant Agreement', desc: 'Contract for sellers.', link: '#' },
                    ].map((doc) => (
                        <Link href={doc.link} key={doc.title}>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-2">{doc.title}</h3>
                                <p className="text-white/50">{doc.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
