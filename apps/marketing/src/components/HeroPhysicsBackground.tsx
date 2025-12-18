'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

export function HeroPhysicsBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [reducedMotion, setReducedMotion] = useState(false);
    const mouseRef = useRef({ x: 0, y: 0 });
    const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }>>([]);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mq.matches);
        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const initParticles = useCallback((width: number, height: number) => {
        const count = Math.min(20, Math.floor((width * height) / 50000));
        particlesRef.current = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 60 + 40,
            opacity: Math.random() * 0.08 + 0.02
        }));
    }, []);

    useEffect(() => {
        if (reducedMotion) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles(canvas.width, canvas.height);
        };
        resize();
        window.addEventListener('resize', resize);

        const handleMouse = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouse);

        let isVisible = true;
        const handleVisibility = () => { isVisible = document.visibilityState === 'visible'; };
        document.addEventListener('visibilitychange', handleVisibility);

        const animate = () => {
            if (!isVisible) {
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach(p => {
                // Gentle cursor influence
                const dx = mouseRef.current.x - p.x;
                const dy = mouseRef.current.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 300) {
                    const force = (300 - dist) / 300 * 0.01;
                    p.vx += dx * force * 0.001;
                    p.vy += dy * force * 0.001;
                }

                p.x += p.vx;
                p.y += p.vy;

                // Bounds
                if (p.x < -p.size) p.x = canvas.width + p.size;
                if (p.x > canvas.width + p.size) p.x = -p.size;
                if (p.y < -p.size) p.y = canvas.height + p.size;
                if (p.y > canvas.height + p.size) p.y = -p.size;

                // Draw blob
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                gradient.addColorStop(0, `rgba(34, 197, 94, ${p.opacity})`);
                gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        // Wait for idle before starting
        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => animate());
        } else {
            setTimeout(animate, 100);
        }

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouse);
            document.removeEventListener('visibilitychange', handleVisibility);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [reducedMotion, initParticles]);

    if (reducedMotion) return null;

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            aria-hidden="true"
        />
    );
}
