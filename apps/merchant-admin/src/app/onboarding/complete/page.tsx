"use client";

import { useSonic } from "@/hooks/useSonic";

import { Button, Icon, cn } from "@vayva/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

import { useAuth } from "@/context/AuthContext";

export default function OnboardingSuccessPage() {
    const { refreshProfile } = useAuth();
    const [isProfileRefreshed, setIsProfileRefreshed] = useState(false);

    // Sonic UI
    const { play: playSuccess } = useSonic("success", { volume: 0.6 });

    // Trigger confetti on mount and refresh profile
    useEffect(() => {
        playSuccess();

        // Ensure auth context knows we are complete
        refreshProfile().then(() => {
            setIsProfileRefreshed(true);
            console.log("Profile refreshed on success page");
        });

        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // multiple origins for a "full screen" feel
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const containerVariants: any = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 50, damping: 20 }
        }
    };

    const orbitVariants: any = {
        animate: {
            rotate: 360,
            transition: { duration: 10, repeat: Infinity, ease: "linear" }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 relative overflow-hidden">
            {/* Background Decor - Premium Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#46EC13]/5 rounded-full blur-[150px] -z-10" />
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-2xl w-full text-center space-y-12 z-10"
            >
                <div className="flex justify-center mb-8">
                    <motion.div variants={itemVariants} className="relative">
                        <div className="w-32 h-32 bg-black text-[#46EC13] rounded-[3rem] flex items-center justify-center shadow-3xl shadow-black/20">
                            <Icon name="CheckCircle" size={64} />
                        </div>
                        {/* Orbital Effects */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0"
                        >
                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#46EC13] rounded-full shadow-lg shadow-[#46EC13]/40" />
                        </motion.div>
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0"
                        >
                            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gray-200 rounded-full" />
                        </motion.div>
                    </motion.div>
                </div>

                <div className="space-y-4">
                    <motion.label variants={itemVariants} className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] block">
                        Ecosystem Deployed
                    </motion.label>
                    <motion.h1 variants={itemVariants} className="text-6xl font-black text-gray-900 tracking-tighter leading-none uppercase">
                        You're <span className="text-transparent bg-clip-text bg-gradient-to-br from-black via-gray-600 to-gray-400">All Set</span>
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-xl text-gray-400 font-medium max-w-lg mx-auto">
                        Your merchant infrastructure is live. You are now prepared to scale with Vayva.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-black/[0.02] text-left group hover:scale-[1.02] transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all">
                            <Icon name="Rocket" size={24} />
                        </div>
                        <h3 className="font-black text-sm text-gray-900 uppercase tracking-widest mb-3">Launch Directive</h3>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            Enter your control center to monitor real-time transactions and audit logs.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-black/[0.02] text-left group hover:scale-[1.02] transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all">
                            <Icon name="Plus" size={24} />
                        </div>
                        <h3 className="font-black text-sm text-gray-900 uppercase tracking-widest mb-3">Asset Creation</h3>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            Initialize your product catalog or sync assets from your legacy systems.
                        </p>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 pt-8 justify-center items-center w-full max-w-2xl mx-auto flex-wrap">
                    <Link href="/dashboard" className="w-full sm:w-auto min-w-[200px]" onClick={async (e) => {
                        // Double check profile is refreshed before navigating (safety)
                        if (!isProfileRefreshed) {
                            e.preventDefault();
                            await refreshProfile();
                            window.location.href = "/dashboard";
                        }
                    }}>
                        <Button className="!bg-black !text-white h-20 px-8 rounded-[2rem] text-xl font-black shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all w-full flex items-center justify-center gap-4 group whitespace-nowrap">
                            Go to Dashboard
                            <Icon name="ArrowRight" size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
                        </Button>
                    </Link>
                    <Link href="/products/new" className="w-full sm:w-auto min-w-[200px]">
                        <Button variant="ghost" className="h-20 px-8 rounded-[2rem] text-xl font-black border-2 border-gray-100 hover:border-black hover:bg-white transition-all w-full whitespace-nowrap">
                            Add First Product
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Bottom Credits / Secure Badge */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-12 flex flex-col items-center gap-4"
            >
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                    <Icon name="ShieldCheck" size={14} className="text-green-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Bank-Grade Security Active</span>
                </div>
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">© 2026 VAYVA PLATFORM S.A.</p>
            </motion.div>
        </div>
    );
}
