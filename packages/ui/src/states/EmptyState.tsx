'use client';

import React from 'react';
import { Icon, IconName } from '../components/Icon';
import { Button } from '../components/Button';
import { GlassPanel } from '../components/GlassPanel';
import { motion, scaleIn } from '../motion';

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: IconName;
}

export function EmptyState({ title, description, actionLabel, onAction, icon = 'Info' }: EmptyStateProps) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={scaleIn}
            className="w-full"
        >
            <GlassPanel className="flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Icon name={icon} className="w-8 h-8 text-primary opacity-80" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 max-w-md mb-8">{description}</p>
                {actionLabel && onAction && (
                    <Button onClick={onAction} size="lg">
                        {actionLabel}
                    </Button>
                )}
            </GlassPanel>
        </motion.div>
    );
}
