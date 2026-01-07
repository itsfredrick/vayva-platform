"use client";

import React, { useState, useMemo } from "react";
import { authClient } from "@/lib/neon-auth";
import { Button } from "@vayva/ui";
import { Input } from "@vayva/ui";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Info, Eye, EyeOff } from "lucide-react";

export const SignUpForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password Strength Logic
    const passwordStrength = useMemo(() => {
        const pwd = formData.password;
        if (!pwd) return { score: 0, label: "", color: "bg-gray-200" };

        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        switch (score) {
            case 0:
            case 1:
                return { score, label: "Weak", color: "bg-red-500" };
            case 2:
            case 3:
                return { score, label: "Fair", color: "bg-yellow-500" };
            case 4:
                return { score, label: "Strong", color: "bg-green-500" };
            default:
                return { score: 0, label: "", color: "bg-gray-200" };
        }
    }, [formData.password]);

    const isPasswordMatch = formData.password === formData.confirmPassword;
    const canSubmit =
        formData.email &&
        formData.firstName &&
        formData.lastName &&
        formData.password &&
        isPasswordMatch &&
        passwordStrength.score >= 2; // Enforce at least "Fair"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isPasswordMatch) {
            toast.error("Passwords do not match");
            return;
        }

        if (passwordStrength.score < 2) {
            toast.error("Please use a stronger password");
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await authClient.signUp.email({
                email: formData.email,
                password: formData.password,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                callbackURL: "/onboarding",
            });

            if (error) {
                toast.error(error.message || "Failed to sign up");
            } else {
                localStorage.setItem("vayva_has_account", "true");
                toast.success("Account created! Please verify your email.");
                // Redirect to verification or dashboard depending on flow
                router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
            }
        } catch (err: any) {
            toast.error(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
            <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                    <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                    <Input
                        id="firstName"
                        placeholder="John"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                </div>
                <div className="space-y-2 flex-1">
                    <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                    <Input
                        id="lastName"
                        placeholder="Doe"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                </div>
            </div>

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
                {/* Password Strength Meter */}
                {formData.password && (
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Strength: <span className={`font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>{passwordStrength.label}</span></span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-gray-500">
                            Use 8+ chars, mixed case, numbers, and symbols.
                        </p>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        className={`${!isPasswordMatch && formData.confirmPassword ? "border-red-300 focus:ring-red-200" : ""} pr-20`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {formData.confirmPassword && (
                            <div className="text-xs">
                                {isPasswordMatch ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                    <X className="w-4 h-4 text-red-500" />
                                )}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
                {!isPasswordMatch && formData.confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                )}
            </div>

            <Button type="submit" className="w-full" isLoading={loading} disabled={!canSubmit}>
                Create Account
            </Button>
        </form>
    );
};
