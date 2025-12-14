'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <div className="pb-20">
            {/* Hero */}
            <section className="py-20 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-[#1d1d1f] mb-8">
                        Commerce for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#46EC13] to-blue-500">
                            Africa's ambition.
                        </span>
                    </h1>
                    <p className="text-xl text-[#1d1d1f]/60 max-w-2xl mx-auto leading-relaxed">
                        We are building the operating system for African commerce. Our mission is to empower millions of merchants to build, scale, and manage their businesses with ease.
                    </p>
                </motion.div>
            </section>

            {/* Stats */}
            <section className="py-10 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    {[
                        { label: 'Merchants', value: '10,000+' },
                        { label: 'Cities Covered', value: '36' },
                        { label: 'processed annually', value: '₦500M+' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border border-gray-100 p-8 rounded-[2rem] text-center shadow-lg hover:shadow-xl transition-all"
                        >
                            <h3 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-2">{stat.value}</h3>
                            <p className="text-[#1d1d1f]/60 font-medium uppercase tracking-wide text-sm">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Story */}
            <section className="py-20 px-4">
                <div className="max-w-3xl mx-auto prose prose-lg prose-gray">
                    <p className="text-xl text-[#1d1d1f]/80 leading-relaxed">
                        It started with a simple observation: African merchants are incredibly resilient, but they are underserved by technology.
                        They juggle multiple apps for payments, logistics, and inventory, often glued together by manual processes and spreadsheets.
                    </p>
                    <p className="text-xl text-[#1d1d1f]/80 leading-relaxed mt-6">
                        Vayva was born to solve this fragmentation. We believe that by providing a unified platform, we can unlock the true potential of African commerce
                        and help merchants compete on a global stage.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-4 bg-gray-50 border-y border-gray-100">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#1d1d1f] mb-12 text-center">Our Values</h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { title: 'Customer Obsession', desc: 'We only win when our merchants win. Every decision starts with them.' },
                            { title: 'Radical Simplicity', desc: 'Complexity is the enemy of execution. We build tools that just work.' },
                            { title: 'Think Big, Move Fast', desc: 'The opportunity is massive. We move with urgency and ambition.' }
                        ].map((value, i) => (
                            <div key={i} className="space-y-4">
                                <div className="w-12 h-12 rounded-full bg-[#1d1d1f] flex items-center justify-center text-[#46EC13] font-bold text-xl">
                                    {i + 1}
                                </div>
                                <h3 className="text-xl font-bold text-[#1d1d1f]">{value.title}</h3>
                                <p className="text-[#1d1d1f]/60 leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
