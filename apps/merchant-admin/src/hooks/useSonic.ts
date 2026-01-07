import useSound from 'use-sound';
import { useCallback, useState, useEffect } from 'react';

// Define the sound map for type safety
export type SoundType = 'click' | 'success' | 'hover' | 'toggle';

// Asset paths - assuming they will be placed in public/sounds/
const SOUND_PATHS: Record<SoundType, string> = {
    click: '/sounds/click.mp3',
    success: '/sounds/success.mp3',
    hover: '/sounds/hover.mp3',
    toggle: '/sounds/toggle.mp3',
};

interface UseSonicOptions {
    volume?: number;
}

export function useSonic(type: SoundType, options: UseSonicOptions = {}) {
    const [enabled, setEnabled] = useState(false);

    // Hydration safety
    useEffect(() => {
        setEnabled(true);
    }, []);

    const [play, { stop }] = useSound(SOUND_PATHS[type], {
        volume: options.volume || 0.5,
        soundEnabled: enabled,
        interrupt: true,
    });

    const safePlay = useCallback(() => {
        if (enabled) {
            try {
                play();
            } catch (e) {
                // Silently fail if interaction policies block play or file missing
            }
        }
    }, [enabled, play]);

    return { play: safePlay, stop };
}
