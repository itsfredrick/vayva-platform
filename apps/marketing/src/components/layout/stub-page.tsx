import React from 'react';
import { Container } from '@/components/ui/container';

export default function StubPage() {
    return (
        <Container className="py-20 min-h-[60vh]">
            <h1 className="text-3xl font-bold mb-4">Coming Soon</h1>
            <p className="text-gray-500">This page is currently under construction.</p>
        </Container>
    );
}
