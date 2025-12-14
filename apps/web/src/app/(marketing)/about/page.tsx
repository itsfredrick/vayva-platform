'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <span className="text-[#46EC13] font-bold tracking-wide uppercase mb-4 block">Our Mission</span>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">Built for African Commerce.</h1>
                <p className="text-xl text-white/60 mb-20 leading-relaxed">
                    Vayva was born from a simple observation: retail in Nigeria is dynamic, social, and mobile-first, but the tools available were built for the West.
                    <br /><br />
                    We're building the operating system for the next generation of African merchants.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'Local Context', desc: 'We solve for Nigerian realities: trust issues, logistics headaches, and payment friction.' },
                        { title: 'WhatsApp First', desc: 'We know that in Africa, commerce happens in chat. So we built our platform around it.' },
                        { title: 'Empowerment', desc: 'We believe that with the right tools, anyone can build a global business from Lagos.' }
                    ].map((val, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl text-left">
                            <h3 className="text-white font-bold text-lg mb-4">{val.title}</h3>
                            <p className="text-white/50 text-sm">{val.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
