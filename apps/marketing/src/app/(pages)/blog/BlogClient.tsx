"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@vayva/ui";
import { ArrowRight, Calendar, User, Tag, Search, X } from "lucide-react";
import { APP_URL } from "@/lib/constants";

const POSTS = [
    {
        id: 1,
        title: "10 WhatsApp Business Scripts to Close Sales Faster",
        excerpt: "Stop typing 'Price?' replies manually. Copy these proven templates for handling inquiries, delivery pricing, and 'I will get back to you' customers.",
        category: "Guides",
        author: "Tola Adesina",
        date: "Jan 03, 2026",
        image: "/images/blog/blog-guide-automation.png",
        slug: "whatsapp-sales-scripts",
        content: (
            <>
                <p className="mb-4">
                    Responding to customers on WhatsApp can be exhausting, especially when you get the same questions over and over again. "How much?" "Is it available?" "Location?"
                </p>
                <p className="mb-4">
                    To help you save time and close more sales, we've compiled 10 proven scripts you can save as 'Quick Replies' in your WhatsApp Business app.
                </p>
                <h3 className="text-xl font-bold mt-6 mb-3">1. The Price Inquiry Script</h3>
                <p className="mb-4 bg-gray-50 p-4 rounded-lg border-l-4 border-green-500 italic">
                    "Hi there! 👋 Thanks for asking. The [Product Name] is currently ₦15,000. It comes in [Color/Size options]. Would you like to see a video of it?"
                </p>
                <p className="mb-4">
                    <strong>Why it works:</strong> It answers the question immediately but also keeps the conversation going by offering a video.
                </p>
                <h3 className="text-xl font-bold mt-6 mb-3">2. The "I Will Get Back to You" Re-engagement</h3>
                <p className="mb-4 bg-gray-50 p-4 rounded-lg border-l-4 border-green-500 italic">
                    "Hello! Just checking in on your order for the [Product Name]. We have only 2 pieces left in stock and I wanted to reserve one for you. Should I go ahead?"
                </p>
                <p className="mb-4">
                    Use these scripts to professionalize your communication and increase your conversion rate today!
                </p>
            </>
        ),
    },
    {
        id: 2,
        title: "Case Study: How 'Mama Nkechi Cakes' Saved ₦150k on logistics",
        excerpt: "Delivery fees were eating into her margins. See how automatic distance-based billing on Vayva helped this Lagos baker become profitable again.",
        category: "Success Stories",
        author: "Chidi Nwafor",
        date: "Dec 29, 2025",
        image: "/images/blog/blog-success-logistics.png",
        slug: "delivery-cost-case-study",
        content: (
            <>
                <p className="mb-4">
                    Mama Nkechi runs a popular cake business in Surulere. But she had a big problem: Delivery riders were charging her random prices, and she was often covering the difference out of her own pocket.
                </p>
                <p className="mb-4">
                    "Sometimes I would charge a customer ₦2,000 for delivery to Lekki, only for the rider to demand ₦3,500 because of 'traffic'," she explains.
                </p>
                <h3 className="text-xl font-bold mt-6 mb-3">The Solution: Automatic Distance Billing</h3>
                <p className="mb-4">
                    By switching to Vayva's logistics integration, Mama Nkechi was able to:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Get real-time delivery quotes before confirming the order.</li>
                    <li>Pass the exact delivery cost to the customer automatically.</li>
                    <li>Batch orders for cheaper rates.</li>
                </ul>
                <p className="mb-4">
                    In just 3 months, she saved over ₦150,000 in lost delivery revenue. "Now, what the app says is what we pay. No more arguments," she says delightfully.
                </p>
            </>
        ),
    },
    {
        id: 3,
        title: "CAC & TIN: The New 2026 Requirements for Online Sellers",
        excerpt: "The Federal Government is cracking down on unregistered social sellers. Here is the step-by-step guide to compliance to avoid your bank account being frozen.",
        category: "Regulation",
        author: "Vayva Legal",
        date: "Dec 15, 2025",
        image: "/images/blog/blog-regulation-kyc.png",
        slug: "cac-tin-requirements-2026",
        content: (
            <>
                <p className="mb-4">
                    The regulatory landscape for online businesses in Nigeria has changed. As of January 2026, the CBN and CAC have enforced stricter KYC (Know Your Customer) rules for all business accounts.
                </p>
                <p className="mb-4">
                    If you are selling on Instagram, WhatsApp, or Vayva, you must have your business registered. Failure to do so may result in your business bank account being restricted (Post No Debit).
                </p>
                <h3 className="text-xl font-bold mt-6 mb-3">What You Need to Do</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Register with CAC:</strong> You can register a Business Name for as low as ₦15,000.</li>
                    <li><strong>Get your TIN:</strong> A Tax Identification Number is now mandatory for opening a corporate account.</li>
                    <li><strong>Upload Documents to Vayva:</strong> Go to your Vayva dashboard &gt; Settings &gt; Compliance and upload your certificates.</li>
                </ul>
                <p className="mb-4">
                    Don't wait until your account is frozen. Start the process today. Vayva has partnered with legal firms to offer discounted registration for our merchants.
                </p>
            </>
        ),
    },
    {
        id: 4,
        title: "Escrow Payments: Building Trust with First-Time Customers",
        excerpt: "Nigerians are scared of 'What I ordered vs What I got'. Learn how Vayva's detailed order confirmation receipts build instant trust.",
        category: "Trust & Safety",
        author: "Fredrick Nyamsi",
        date: "Dec 10, 2025",
        image: "/images/step-4-payments.png",
        slug: "building-customer-trust",
        content: (
            <>
                <p className="mb-4">
                    Trust is the currency of online business. In Nigeria, the fear of scams or "What I ordered vs What I got" prevents millions of potential sales every day.
                </p>
                <p className="mb-4">
                    Vayva allows you to offer Escrow payments. This means the customer's money is held safely by Vayva until they confirm they have received the goods in good condition.
                </p>
                <h3 className="text-xl font-bold mt-6 mb-3">Does Escrow Hurt Cash Flow?</h3>
                <p className="mb-4">
                    Many merchants worry about delayed funds. However, data shows that offering Payment on Delivery (or Escrow) increases conversion rates by 300%.
                </p>
                <p className="mb-4">
                    With Vayva, escrow funds are released within 24 hours of delivery confirmation. It's a small wait for a massive boost in sales volume.
                </p>
            </>
        ),
    },
    {
        id: 5,
        title: "Black Friday 2025 Recap: What We Learned from 5M Messages",
        excerpt: "The data is in. We analyzed 500+ Vayva stores during Yakata sales. The biggest winner? Stores that used automated broadcast lists.",
        category: "Data Insights",
        author: "Growth Team",
        date: "Dec 05, 2025",
        image: "/images/step-1-whatsapp.png",
        slug: "black-friday-data-recap",
        content: (
            <>
                <p className="mb-4">
                    Black Friday (Yakata) 2025 was our biggest yet. We processed over 5 million WhatsApp messages between merchants and customers. Here is what the data told us.
                </p>
                <h3 className="text-xl font-bold mt-6 mb-3">Speed Wins</h3>
                <p className="mb-4">
                    Stores that responded to inquiries within 5 minutes had a 70% higher conversion rate than those that took 30 minutes or more. This is where Vayva's AI auto-responder was a game changer.
                </p>
                <h3 className="text-xl font-bold mt-6 mb-3">Broadcasts Work</h3>
                <p className="mb-4">
                    Merchants who sent personalized broadcast messages to their existing customers (not spamming strangers!) saw a 4x ROI compared to Instagram ads.
                </p>
                <p className="mb-4">
                    Start building your customer list now for the next big sales event!
                </p>
            </>
        ),
    },
    {
        id: 6,
        title: "How to Switch from 'DM for Price' to Automated Catalogues",
        excerpt: "Hiding your prices is losing you 60% of sales. Here is how to upload your inventory to Vayva and let the AI handle price inquiries 24/7.",
        category: "Tutorials",
        author: "Product Team",
        date: "Nov 28, 2025",
        image: "/images/step-2-templates.png",
        slug: "switch-to-catalogues",
        content: (
            <>
                <p className="mb-4">
                    "DM for price" is the fastest way to kill a sale. Modern customers want instant gratification. If they have to wait for you to wake up and reply, they've moved on to a competitor.
                </p>
                <h3 className="text-xl font-bold mt-6 mb-3">The Automated Advantage</h3>
                <p className="mb-4">
                    By uploading your products to Vayva, you create a searchable digital catalogue. When a customer asks "Do you have red heels?", Vayva's AI can instantly reply with a link to your red heels and the price.
                </p>
                <p className="mb-4">
                    This happens while you sleep, while you're in traffic, or while you're focusing on making more products. It's like having a 24/7 sales assistant.
                </p>
            </>
        ),
    },
];

export default function BlogClient({ metadata }: { metadata: any }) {
    const [selectedPost, setSelectedPost] = useState<typeof POSTS[0] | null>(null);

    return (
        <div className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        headline: metadata.title,
                        description: metadata.description,
                        author: {
                            "@type": "Organization",
                            name: "Vayva",
                        },
                    }),
                }}
            />

            {/* Header */}
            <section className="bg-[#F8FAFC] pt-32 pb-20 px-4 border-b border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 mb-6 shadow-sm">
                        <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            Growth Academy
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-[#0F172A] mb-6 tracking-tight">
                        The Vayva <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#16A34A]">Blog</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[#64748B] max-w-2xl mx-auto leading-relaxed font-medium">
                        Real strategies to help you build a multimillion Naira business on WhatsApp.
                    </p>

                    <div className="mt-10 max-w-lg mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search guides, regulations, or tips..."
                            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-lg shadow-gray-100 focus:ring-2 focus:ring-[#22C55E] focus:border-transparent outline-none transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="group grid md:grid-cols-12 gap-8 items-center mb-24 bg-[#0F172A] rounded-[40px] p-2 md:p-3 shadow-2xl overflow-hidden relative">
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-transparent pointer-events-none" />

                        <div className="md:col-span-7 relative">
                            <div className="aspect-[16/10] relative rounded-[32px] overflow-hidden">
                                <Image
                                    src="/images/blog/blog-feature-ai.png"
                                    alt="Vayva AI Dashboard"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent md:hidden" />
                            </div>
                        </div>

                        <div className="md:col-span-5 p-6 md:pr-12 md:py-12 relative z-10">
                            <div className="flex items-center gap-4 text-sm mb-6">
                                <span className="bg-[#22C55E] text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] shadow-lg shadow-green-900/20">
                                    New Feature
                                </span>
                                <span className="text-gray-400 flex items-center gap-1.5 font-medium">
                                    <Calendar size={14} /> Jan 6, 2026
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-[1.1]">
                                Vayva AI 2.0: Now Understands 'How much last?'
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                We trained our AI on millions of Nigerian trade conversations. It can now negotiate discounts (within limits you set) and handle Pidgin English seamlessly.
                            </p>
                            <Link href={`${APP_URL}/signup`}>
                                <Button className="bg-white text-[#0F172A] hover:bg-gray-100 px-8 py-6 rounded-2xl text-lg font-bold transition-all inline-flex items-center gap-2 w-full md:w-auto justify-center">
                                    Try the Demo <ArrowRight size={20} />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-[#0F172A]">Latest Articles</h2>
                            <p className="text-[#64748B] mt-2">Expert advice to grow your business.</p>
                        </div>
                        {/* Categories (Desktop only) */}
                        <div className="hidden md:flex gap-2">
                            {["All", "Guides", "Success Stories", "Product"].map((cat, i) => (
                                <button key={cat} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${i === 0 ? "bg-[#0F172A] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Post Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {POSTS.map((post) => (
                            <article
                                key={post.id}
                                className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-2 border border-gray-100 cursor-pointer"
                                onClick={() => setSelectedPost(post)}
                            >
                                <div className="aspect-[1.5] relative overflow-hidden bg-gray-100">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#0F172A] shadow-sm uppercase tracking-wider flex items-center gap-1.5">
                                        <Tag size={12} className="text-[#22C55E]" />
                                        {post.category}
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="text-xs font-bold text-gray-400 mb-4 flex items-center gap-2">
                                        <Calendar size={14} />
                                        {post.date}
                                    </div>

                                    <h3 className="text-xl font-bold text-[#0F172A] mb-4 group-hover:text-[#22C55E] transition-colors leading-[1.3]">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden relative">
                                                {post.author.includes("Fredrick") ? (
                                                    <Image src="/images/nyamsi-fredrick.jpg" alt={post.author} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-[#0F172A] text-white text-xs font-bold">
                                                        {post.author.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs font-bold text-gray-700">{post.author}</span>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedPost(post);
                                            }}
                                            className="text-[#22C55E] text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300"
                                        >
                                            Read
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Button variant="outline" className="border-2 px-8 py-6 rounded-2xl text-lg font-bold hover:bg-gray-50">
                            Load More Articles
                        </Button>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-24 px-4 bg-[#0F172A] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#22C55E] rounded-full blur-[120px] opacity-10" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-block mb-6 p-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10">
                        <div className="w-12 h-12 bg-[#22C55E] rounded-xl flex items-center justify-center mx-auto text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                        Get business tips delivered to<br />your WhatsApp
                    </h2>
                    <p className="text-gray-400 mb-10 text-lg max-w-xl mx-auto">
                        Join 5,000+ merchants receiving weekly growth strategies, market insights, and platform updates.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all flex-1"
                        />
                        <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-2xl px-8 py-4 text-base font-bold shadow-lg shadow-green-900/20">
                            Subscribe
                        </Button>
                    </div>
                    <p className="text-gray-500 text-xs mt-6">
                        We respect your inbox. Unsubscribe at any time.
                    </p>
                </div>
            </section>

            {/* Blog Post Modal */}
            {selectedPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedPost(null)}
                    />
                    <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden relative shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header/Image */}
                        <div className="relative h-48 sm:h-64 shrink-0">
                            <Image
                                src={selectedPost.image}
                                alt={selectedPost.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-2 text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="inline-block px-3 py-1 rounded-full bg-[#22C55E] text-white text-xs font-bold mb-3 shadow-lg uppercase tracking-wider">
                                    {selectedPost.category}
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight shadow-black drop-shadow-md">
                                    {selectedPost.title}
                                </h2>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden relative">
                                    {selectedPost.author.includes("Fredrick") ? (
                                        <Image src="/images/nyamsi-fredrick.jpg" alt={selectedPost.author} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[#0F172A] text-white text-xs font-bold">
                                            {selectedPost.author.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#0F172A]">{selectedPost.author}</p>
                                    <p className="text-xs text-gray-500">{selectedPost.date}</p>
                                </div>
                            </div>

                            <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-[#0F172A] prose-p:text-gray-600 prose-a:text-[#22C55E]">
                                {selectedPost.content}
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                                <p className="text-gray-500 mb-4 font-medium">Enjoyed this article?</p>
                                <Button
                                    onClick={() => {
                                        const text = `Check out this article on Vayva: ${selectedPost.title}`;
                                        const url = `https://vayva.com/blog/${selectedPost.slug}`;
                                        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
                                    }}
                                    className="bg-[#0F172A] text-white hover:bg-gray-800 rounded-xl px-8 py-3 font-semibold"
                                >
                                    Share on WhatsApp
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
