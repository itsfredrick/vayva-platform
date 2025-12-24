import React from 'react';

export const VayvaLogo = ({ className }: { className?: string }) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="32" height="32" rx="8" fill="black" />
        <path d="M10 10L14 22L18 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 10L22 22" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
