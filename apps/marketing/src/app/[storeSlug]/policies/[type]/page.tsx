import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@vayva/db';
import Link from 'next/link';

interface PolicyPageProps {
    params: {
        storeSlug: string;
        type: string;
    };
}

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
    const policy = await getPolicy(params.storeSlug, params.type);

    return {
        title: policy ? `${policy.title} | ${params.storeSlug}` : 'Policy Not Available',
        description: policy ? `${policy.title} for ${params.storeSlug}` : 'This policy is not yet available.'
    };
}

async function getPolicy(storeSlug: string, type: string) {
    try {
        const policyType = type.toUpperCase().replace('-', '_');

        const policy = await prisma.merchantPolicy.findFirst({
            where: {
                storeSlug,
                type: policyType as any,
                status: 'PUBLISHED'
            }
        });

        return policy;
    } catch (error) {
        console.error('Error fetching policy:', error);
        return null;
    }
}

export default async function PolicyPage({ params }: PolicyPageProps) {
    const policy = await getPolicy(params.storeSlug, params.type);

    if (!policy) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-900 mb-2">Policy Not Available</h1>
                    <p className="text-slate-600 mb-6">
                        This policy hasn't been published yet. Please check back later or contact the store.
                    </p>
                    <Link
                        href={`/${params.storeSlug}`}
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#22C55E] text-white rounded-xl font-medium hover:bg-[#22C55E]/90 transition-colors"
                    >
                        Back to Store
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <Link
                        href={`/${params.storeSlug}`}
                        className="text-sm text-slate-600 hover:text-[#22C55E] transition-colors inline-flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Store
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-8 md:p-12">
                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        {policy.title}
                    </h1>

                    {/* Last Updated */}
                    {policy.lastUpdatedLabel && (
                        <p className="text-sm text-slate-500 mb-8">
                            Last updated: {policy.lastUpdatedLabel}
                        </p>
                    )}

                    {/* Policy Content */}
                    <div
                        className="prose prose-slate max-w-none
                            prose-headings:text-slate-900 prose-headings:font-semibold
                            prose-p:text-slate-700 prose-p:leading-relaxed
                            prose-a:text-[#22C55E] prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-slate-900 prose-strong:font-semibold
                            prose-ul:text-slate-700 prose-ol:text-slate-700
                            prose-li:marker:text-[#22C55E]"
                        dangerouslySetInnerHTML={{ __html: policy.contentHtml || policy.contentMd }}
                    />

                    {/* Contact Block */}
                    <div className="mt-12 pt-8 border-t border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">Questions?</h3>
                        <p className="text-slate-600">
                            If you have any questions about this policy, please contact the store directly.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
