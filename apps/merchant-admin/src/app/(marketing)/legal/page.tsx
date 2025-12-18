
import Link from 'next/link';
import { legalRegistry } from '@vayva/content';
import { Button, Icon } from '@vayva/ui';

export default function LegalHubPage() {
    return (
        <div className="max-w-[1280px] mx-auto px-6 py-24 md:py-32">
            <div className="max-w-3xl mb-24">
                <div className="inline-block px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-400 mb-6 uppercase tracking-[0.2em]">
                    Transparency & Trust
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-[#0B0B0B] mb-8 tracking-tighter" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Legal Hub
                </h1>
                <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-medium">
                    Our platform is built on trust. Here you'll find the terms, policies, and guidelines that safeguard our merchants and community.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {Object.values(legalRegistry).map((doc) => (
                    <Link key={doc.slug} href={`/legal/${doc.slug}`}>
                        <div className="group h-full flex flex-col justify-between border border-gray-100 p-8 rounded-3xl hover:border-black/5 transition-all bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                    <Icon name="FileText" size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0B0B0B] mb-3 group-hover:text-black transition-colors">
                                    {doc.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                    {doc.summary}
                                </p>
                            </div>

                            <div className="relative z-10 flex items-center justify-between border-t border-gray-50 pt-6">
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">v{doc.version || '1.0'}</span>
                                <span className="text-xs font-bold text-black flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                    View Policy <Icon name="ArrowRight" size={14} />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-32 p-12 md:p-20 bg-gray-50 rounded-[40px] text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full opacity-20 blur-3xl pointer-events-none" />
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0B0B0B] mb-6 tracking-tight">Need legal assistance?</h2>
                    <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
                        Our specialized compliance team is ready to answer any questions regarding our merchant agreement and platform policies.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="mailto:legal@vayva.shop">
                            <Button className="!bg-black !text-white !h-14 !px-8 !rounded-2xl text-lg">Contact Compliance</Button>
                        </a>
                        <Link href="/help">
                            <Button variant="ghost" className="!h-14 !px-8 !rounded-2xl text-lg">Help Center</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
