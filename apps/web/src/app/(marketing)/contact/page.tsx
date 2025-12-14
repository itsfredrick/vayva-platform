'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Get in touch.</h1>
                    <p className="text-xl text-white/60 mb-12">
                        Have specific questions about enterprise plans or high-volume sales? Our team is here to help.
                    </p>

                    <div className="space-y-8">
                        <div>
                            <h4 className="text-white font-bold mb-2">Support</h4>
                            <p className="text-white/50">help@vayva.com</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-2">Sales</h4>
                            <p className="text-white/50">sales@vayva.com</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-2">Office</h4>
                            <p className="text-white/50">123 Innovation Drive, Lekki Phase 1, Lagos, Nigeria</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-white">First Name</label>
                                <input className="w-full bg-[#0b141a] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#46EC13]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-white">Last Name</label>
                                <input className="w-full bg-[#0b141a] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#46EC13]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Email</label>
                            <input type="email" className="w-full bg-[#0b141a] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#46EC13]" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Message</label>
                            <textarea rows={4} className="w-full bg-[#0b141a] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#46EC13]" />
                        </div>
                        <Button className="w-full bg-white text-black font-bold h-12 rounded-lg hover:bg-white/90">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
