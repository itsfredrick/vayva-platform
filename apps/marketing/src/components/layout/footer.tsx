import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/container';
import { Logo } from '../ui/logo';
import { Instagram, Twitter, Linkedin, MessageCircle } from 'lucide-react';

const FOOTER_LINKS = [
    {
        title: "Product",
        links: [
            { name: "Store Builder", href: "/features/store" },
            { name: "WhatsApp AI", href: "/features/whatsapp-ai" },
            { name: "Marketplace", href: "/marketplace" },
            { name: "Pricing", href: "/pricing" },
        ]
    },
    {
        title: "Company",
        links: [
            { name: "About", href: "/about" },
            { name: "Careers", href: "/careers" },
            { name: "Blog", href: "/blog" },
            { name: "Contact", href: "/contact" },
        ]
    },
    {
        title: "Resources",
        links: [
            { name: "Help Center", href: "/help" },
            { name: "Status", href: "/status" },
            { name: "Templates", href: "/templates" },
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Terms", href: "/legal/terms" },
            { name: "Privacy", href: "/legal/privacy" },
            { name: "Cookies", href: "/legal/cookies" },
            { name: "Acceptable Use", href: "/legal/acceptable-use" },
        ]
    }
];

export function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
            <Container>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
                    {/* Brand Col */}
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <Logo />
                            <span className="font-heading font-bold text-lg">Vayva</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Powering the next generation of African commerce with AI and trust.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <a href="#" className="text-gray-400 hover:text-black transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-black transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-black transition-colors"><Linkedin size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-black transition-colors"><MessageCircle size={20} /></a>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {FOOTER_LINKS.map((group) => (
                        <div key={group.title} className="col-span-1">
                            <h4 className="font-bold text-sm mb-4">{group.title}</h4>
                            <ul className="flex flex-col gap-3">
                                {group.links.map(link => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-sm text-gray-500 hover:text-black transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-400">© 2025 Vayva Inc. All rights reserved.</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        All systems operational
                    </div>
                </div>
            </Container>
        </footer>
    );
}
