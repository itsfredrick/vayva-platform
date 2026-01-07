"use client";

import React from "react";
import { Modal } from "@vayva/ui";

interface LegalModalsProps {
    termsOpen: boolean;
    privacyOpen: boolean;
    onCloseTerms: () => void;
    onClosePrivacy: () => void;
}

export const LegalModals = ({
    termsOpen,
    privacyOpen,
    onCloseTerms,
    onClosePrivacy,
}: LegalModalsProps) => {
    return (
        <>
            <Modal
                isOpen={termsOpen}
                onClose={onCloseTerms}
                title="Terms of Service"
                className="max-w-4xl"
            >
                <div className="prose prose-slate max-w-none text-[13px] leading-relaxed overflow-y-auto max-h-[70vh] pr-4">
                    <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-3xl">
                        <h1 className="text-xl font-black text-slate-900 mb-2">VAYVA TERMS OF SERVICE (v1.0)</h1>
                        <p className="text-slate-500 font-bold mb-4">Effective Date: January 7, 2026</p>
                        <p className="text-slate-600 bg-white p-4 rounded-xl border border-slate-100 italic">
                            THIS IS A LEGALLY BINDING AGREEMENT. BY ACCESSING OR USING THE VAYVA PLATFORM, YOU AGREE TO BE BOUND BY THESE TERMS.
                        </p>
                    </div>

                    <section className="mb-8">
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            1. Definitions
                        </h2>
                        <div className="space-y-3 text-slate-600">
                            <p><strong>"Platform"</strong> means the Vayva e-commerce software, AI Business Agent, WhatsApp/Instagram integrations, storefront templates, and merchant dashboard.</p>
                            <p><strong>"Services"</strong> refers to order automation, payment ledgering, and logistics coordination features provided by Vayva.</p>
                            <p><strong>"Third-Party Providers"</strong> means entities integrated with the Platform, including <strong>Paystack Payments Limited</strong> and <strong>Kwik Delivery</strong>.</p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            2. Subscription and Trial Policy
                        </h2>
                        <div className="space-y-3 text-slate-600 font-medium">
                            <p><strong>2.1 7-Day Trial:</strong> Vayva offers a 7-day evaluative trial period for new Merchants.</p>
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                                <p className="text-red-900 font-black mb-1 uppercase text-[10px] tracking-widest">Critical Deletion Policy</p>
                                <p className="text-red-700 text-xs leading-relaxed font-bold">
                                    If a paid subscription is not active after trial, the account is paused. Vayva reserves the right to PERMANENTLY DELETE all Merchant data, storefronts, and configurations three (3) days after account pause if no renewal occurs.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8 border-l-4 border-blue-500 pl-6 bg-blue-50/30 py-4 rounded-r-2xl">
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            3. Financial Terms & Payment Processing
                        </h2>
                        <div className="space-y-4 text-slate-600">
                            <p><strong>3.1 Paystack Integration:</strong> All payment processing is handled via Paystack. Merchant expressly agrees to the Paystack Merchant Agreement.</p>
                            <p><strong>3.2 Split Payments:</strong> Vayva manages Paystack subaccounts to facilitate automated split payments between Vayva and the Merchant.</p>
                            <div className="p-4 bg-white border border-blue-100 rounded-xl shadow-sm">
                                <p className="text-blue-900 font-black mb-1 underline">3.3 Withdrawal Fee Disclosure</p>
                                <p className="text-slate-900 font-black text-lg">Vayva charges a flat 5% service fee on every withdrawal from the Vayva Wallet to your local bank account.</p>
                            </div>
                            <p><strong>3.4 Chargebacks:</strong> Merchant is 100% liable for customer chargebacks and disputes. Vayva reserves the right to debit your balance to recover these costs.</p>
                        </div>
                    </section>

                    <section className="mb-8 pl-6">
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                            4. AI Business Agent & Logistics
                        </h2>
                        <div className="space-y-3 text-slate-600">
                            <p><strong>4.1 AI "As-Is" Disclaimer:</strong> The AI Business Agent utilizes LLMs to capture orders. Vayva makes no warranty regarding the linguistic precision or factual accuracy of AI-generated responses.</p>
                            <p><strong>4.2 Logistics (Kwik):</strong> By enabling delivery, you agree to Kwik's Terms. Delivery quotes may include platform-level markups for service maintenance.</p>
                        </div>
                    </section>

                    <section className="mb-8 p-6 bg-slate-900 text-white rounded-[2.5rem]">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-slate-400">5. Limitation of Liability</h2>
                        <p className="text-xs leading-relaxed font-bold text-slate-300">
                            TO THE MAXIMUM EXTENT PERMITTED UNDER NIGERIAN LAW, VAYVA'S AGGREGATE LIABILITY FOR ANY CLAIM SHALL NOT EXCEED THE TOTAL FEES PAID BY THE MERCHANT TO VAYVA IN THE SIX (6) MONTHS PRECEDING THE CLAIM.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                        Governed by the laws of the Federal Republic of Nigeria.
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={privacyOpen}
                onClose={onClosePrivacy}
                title="Privacy Policy"
                className="max-w-4xl"
            >
                <div className="prose prose-slate max-w-none text-[13px] leading-relaxed overflow-y-auto max-h-[70vh] pr-4">
                    <div className="mb-8 p-6 bg-indigo-50 border border-indigo-200 rounded-3xl">
                        <h1 className="text-xl font-black text-indigo-900 mb-2">VAYVA PRIVACY POLICY (v1.0)</h1>
                        <p className="text-indigo-500 font-bold mb-4 italic">Compliant with NDPA 2023 & NDPR 2019</p>
                    </div>

                    <section className="mb-8">
                        <h2 className="text-sm font-black text-indigo-900 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-indigo-100">
                            1. Information We Gather
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4 text-slate-600">
                            <div className="p-4 bg-white border border-indigo-50 rounded-2xl">
                                <p className="font-black text-indigo-900 text-[10px] mb-2 uppercase tracking-widest">Merchant Data</p>
                                <p className="text-xs">KYC details, settlemet banking, business identifiers, and contact metadata.</p>
                            </div>
                            <div className="p-4 bg-white border border-indigo-50 rounded-2xl">
                                <p className="font-black text-indigo-900 text-[10px] mb-2 uppercase tracking-widest">Customer Data</p>
                                <p className="text-xs">Name, phone, and delivery address collected to facilitate e-commerce events.</p>
                            </div>
                            <div className="p-4 bg-white border border-indigo-50 rounded-2xl">
                                <p className="font-black text-indigo-900 text-[10px] mb-2 uppercase tracking-widest">Conversation Data</p>
                                <p className="text-xs">Chat logs from WhatsApp/Instagram processed by AI for order extraction.</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-sm font-black text-indigo-900 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-indigo-100">
                            2. Data Sharing & Transfers
                        </h2>
                        <div className="space-y-4 text-slate-600">
                            <p>We share data with <strong>Paystack</strong> (settlement), <strong>Kwik</strong> (logistics), and <strong>Meta</strong> (WhatsApp API).</p>
                            <div className="p-5 bg-yellow-50 border border-yellow-100 rounded-2xl">
                                <p className="font-black text-yellow-900 text-xs mb-2 italic">Cross-Border Transfer Notice</p>
                                <p className="text-xs leading-relaxed text-yellow-800">
                                    Anonymized chat data may be transferred to AI processing centers in the USA and Europe to facilitate order extraction. By using Vayva, you consent to these transfers under the adequacy requirements of the Nigeria Data Protection Act.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-sm font-black text-indigo-900 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-indigo-100">
                            3. Security & Rights
                        </h2>
                        <div className="space-y-3 text-slate-600">
                            <p><strong>Encryption:</strong> Vayva employs AES-256 for data at rest and TLS 1.3 for data in transit.</p>
                            <p><strong>User Rights:</strong> You have the right to access, rectify, or request erasure of your data, subject to legal retention obligations under Financial Regulations.</p>
                        </div>
                    </section>

                    <div className="mt-12 pt-6 border-t border-slate-100 text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Official Privacy Version 1.0 (NDPA Compliant)</p>
                    </div>
                </div>
            </Modal>
        </>
    );
};
