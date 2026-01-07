"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function BootSplash() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Simulate initial app load / hydration
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1500); // Display splash for 1.5 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#ffffff] dark:bg-[#000000]"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.2,
                            ease: [0.16, 1, 0.3, 1], // Custom spring-like easing
                        }}
                        className="relative"
                    >
                        <div className="relative w-24 h-24">
                            <Image
                                src="/favicon.svg"
                                alt="Vayva Logo"
                                fill
                                className="object-contain dark:invert"
                                priority
                            />
                        </div>

                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 -z-10" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
