import React from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FeaturePageProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export default function FeaturePage({ title, description }: FeaturePageProps) {
    return (
        <section className="py-24 bg-white">
            <Container>
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">{title}</h1>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">{description}</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/signup">
                            <Button size="lg" className="rounded-full px-8">Get Started</Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" size="lg" className="rounded-full px-8">Back to Home</Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
