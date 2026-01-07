"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/neon-auth";
import { Button } from "@vayva/ui";
import { Input } from "@vayva/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Check } from "lucide-react";

export const SignInForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/dashboard";
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Load remembered email
    React.useEffect(() => {
        const savedEmail = localStorage.getItem("vayva_remembered_email");
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await authClient.signIn.email({
                email: formData.email,
                password: formData.password,
                callbackURL: redirectTo,
            });

            if (error) {
                toast.error(error.message || "Invalid email or password");
            } else {
                if (rememberMe) {
                    localStorage.setItem("vayva_remembered_email", formData.email);
                } else {
                    localStorage.removeItem("vayva_remembered_email");
                }
                localStorage.setItem("vayva_has_account", "true");

                toast.success("Welcome back!");
                // Force hard navigation to ensure cookies are sent to middleware
                window.location.href = redirectTo;
            }
        } catch (err: any) {
            toast.error(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email address</label>
                <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                        <input
                            type="checkbox"
                            className="peer h-4 w-4 appearance-none rounded border border-gray-300 bg-white checked:bg-indigo-600 checked:border-indigo-600 focus:outline-none transition-all duration-200"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember my email</span>
                </label>

                <button
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                    Forgot password?
                </button>
            </div>

            <Button type="submit" className="w-full" isLoading={loading}>
                Sign In
            </Button>
        </form>
    );
};
