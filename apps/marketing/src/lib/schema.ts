export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };
}

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Vayva',
        url: 'https://vayva.ng',
        logo: 'https://vayva.ng/logo.png',
        description: 'WhatsApp Commerce Platform for Nigeria',
        sameAs: [
            'https://twitter.com/vayvang',
            'https://instagram.com/vayvang'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'support@vayva.ng'
        }
    };
}

export function generateWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Vayva',
        url: 'https://vayva.ng',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://vayva.ng/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    };
}
