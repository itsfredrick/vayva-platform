'use client';

import React from 'react';
import { HelpCircle, Mail, MessageSquare, Book } from 'lucide-react';

export default function HelpSupportPage() {
    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
                <p className="text-gray-600 mt-1">
                    Get help with your Vayva account
                </p>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <MessageSquare className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Live Chat</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                        Chat with our support team in real-time
                    </p>
                    <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                        Start Chat
                    </button>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                        Send us an email at support@vayva.com
                    </p>
                    <a
                        href="mailto:support@vayva.com"
                        className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
                    >
                        Send Email
                    </a>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <Book className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
                </div>

                <div className="space-y-4">
                    <FAQItem
                        question="How do I withdraw funds?"
                        answer="To withdraw funds, ensure your KYC is verified and you have a bank account connected. Then go to Wallet > Withdraw and follow the steps."
                    />
                    <FAQItem
                        question="What documents are needed for KYC?"
                        answer="You need your BVN or NIN, a government-issued ID (Driver's License, Passport, or Voter's Card), and CAC Certificate if you're a registered business."
                    />
                    <FAQItem
                        question="How do I upgrade my plan?"
                        answer="Go to Account > Subscription, select your desired plan, and complete the payment process."
                    />
                    <FAQItem
                        question="How do I add staff members?"
                        answer="Navigate to Account > Team & Roles, click 'Invite Member', enter their email and select their role."
                    />
                    <FAQItem
                        question="How do I connect WhatsApp?"
                        answer="Go to Account > Connected Services, find WhatsApp Business, and click 'Connect'. Follow the QR code scanning process."
                    />
                </div>
            </div>

            {/* Documentation Link */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Need More Help?</h3>
                <p className="text-gray-700 mb-4">
                    Check out our comprehensive documentation and guides
                </p>
                <a
                    href="https://docs.vayva.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                    <Book className="w-4 h-4" />
                    View Documentation
                </a>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="border-b border-gray-200 pb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-start justify-between text-left"
            >
                <span className="font-medium text-gray-900">{question}</span>
                <HelpCircle className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <p className="mt-2 text-gray-600 text-sm">{answer}</p>
            )}
        </div>
    );
}
