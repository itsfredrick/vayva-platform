'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { StepShell } from './StepShell';

const THEMES = [
    { id: 'minimal', name: 'Minimal', color: '#ffffff', textColor: '#000000' },
    { id: 'midnight', name: 'Midnight', color: '#1a1a1a', textColor: '#ffffff' },
    { id: 'ocean', name: 'Ocean', color: '#e0f2fe', textColor: '#0c4a6e' },
];

interface ThemeSelectionStepProps {
    value: string;
    onChange: (value: string) => void;
    onNext: () => void;
    onBack: () => void;
    isSubmitting?: boolean;
}

export function ThemeSelectionStep({ value, onChange, onNext, onBack, isSubmitting }: ThemeSelectionStepProps) {
    return (
        <StepShell
            title="Choose your style"
            description="Select a starting theme for your store. You can change this later."
        >
            <div className="grid grid-cols-3 gap-4 mb-8">
                {THEMES.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => onChange(theme.id)}
                        className={`group relative aspect-[3/4] rounded-2xl border transition-all overflow-hidden
              ${value === theme.id
                                ? 'border-[#46EC13] ring-2 ring-[#46EC13] ring-offset-2'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div
                            className="w-full h-full flex flex-col p-3"
                            style={{ backgroundColor: theme.color, color: theme.textColor }}
                        >
                            <div className="w-1/2 h-2 rounded-full bg-current opacity-20 mb-2" />
                            <div className="w-full h-20 rounded-lg bg-current opacity-5 mb-auto" />
                            <div className="w-2/3 h-2 rounded-full bg-current opacity-20" />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-white/90 backdrop-blur-sm border-t border-black/5">
                            <span className="text-xs font-bold text-black">{theme.name}</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl" disabled={isSubmitting}>
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!value || isSubmitting}
                    className="flex-[2] h-12 bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white font-bold rounded-xl"
                >
                    {isSubmitting ? 'Setting up store...' : 'Launch Store 🚀'}
                </Button>
            </div>
        </StepShell>
    );
}
