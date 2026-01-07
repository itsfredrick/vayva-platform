"use client";

import { useState } from "react";
import { Button, Input, Icon, Avatar } from "@vayva/ui";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function AccountOverviewPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Mock Data linked to User
    const [profile, setProfile] = useState({
        firstName: user?.firstName || "Fredrick",
        lastName: user?.lastName || "D",
        email: user?.email || "admin@vayva.com",
        phone: "+234 801 234 5678",
        language: "English",
        timezone: "(GMT+01:00) Lagos"
    });

    const [tfaEnabled, setTfaEnabled] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Personal profile updated");
        }, 1000);
    };

    const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Overview</h1>
                    <p className="text-gray-500">Manage your personal identity, security, and global preferences.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => toast.info("Exporting profile data...")}>
                        <Icon name="Download" size={16} className="mr-2" /> Export Data
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card & Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 flex flex-col items-center text-center shadow-sm">
                        <div className="relative group mb-6">
                            <Avatar
                                fallback={initials}
                                className="w-28 h-28 text-3xl bg-indigo-600 ring-4 ring-indigo-50"
                            />
                            <button className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform">
                                <Icon name="Camera" size={16} />
                            </button>
                        </div>
                        <h3 className="font-bold text-xl text-gray-900">{profile.firstName} {profile.lastName}</h3>
                        <p className="text-sm text-gray-500 mb-6">System Administrator</p>

                        <div className="w-full pt-6 border-t border-gray-100 flex flex-col gap-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400 font-medium">Account ID</span>
                                <span className="text-gray-900 font-mono">USR_9281X0</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400 font-medium">Joined</span>
                                <span className="text-gray-900 font-medium">Dec 2023</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-2xl">
                        <div className="flex gap-3 items-start mb-4">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg shrink-0">
                                <Icon name="ShieldAlert" size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-orange-900 text-sm">Security Recommendation</h4>
                                <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                                    Enable Two-Factor Authentication to add an extra layer of security to your account.
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-white border-orange-200 text-orange-700 hover:bg-orange-50">
                            Setup 2FA
                        </Button>
                    </div>
                </div>

                {/* Right Column: Detailed Forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                            <Icon name="User" size={18} className="text-indigo-600" />
                            <h3 className="font-bold text-gray-900">Personal Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">First Name</label>
                                <Input
                                    value={profile.firstName}
                                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last Name</label>
                                <Input
                                    value={profile.lastName}
                                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                                <Input
                                    value={profile.email}
                                    disabled
                                    className="bg-gray-50 cursor-not-allowed"
                                />
                                <p className="text-[10px] text-gray-400 italic">Contact support to change your primary email.</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                                <Input
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button onClick={handleSave} disabled={loading} className="px-8 !bg-black text-white rounded-xl h-11 shadow-md hover:shadow-lg transition-all">
                                {loading ? <Icon name="Loader" className="animate-spin" size={18} /> : "Save Changes"}
                            </Button>
                        </div>
                    </div>

                    {/* Regional & Language */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                            <Icon name="Globe" size={18} className="text-indigo-600" />
                            <h3 className="font-bold text-gray-900">Regional Preferences</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Display Language</label>
                                <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-black outline-none transition-all">
                                    <option>English (US)</option>
                                    <option>English (UK)</option>
                                    <option>French</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Timezone</label>
                                <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-black outline-none transition-all">
                                    <option>(GMT+01:00) Lagos</option>
                                    <option>(GMT+00:00) London</option>
                                    <option>(GMT-05:00) New York</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Security Deep Dive */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Icon name="Key" size={18} className="text-indigo-600" />
                                <h3 className="font-bold text-gray-900">Login & Security</h3>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-50">
                            <div className="p-6 flex justify-between items-center group">
                                <div className="space-y-0.5">
                                    <p className="font-bold text-sm text-gray-900">Account Password</p>
                                    <p className="text-xs text-gray-500">Last updated 3 months ago. Make sure it's strong.</p>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-lg group-hover:border-black transition-colors">Change Password</Button>
                            </div>

                            <div className="p-6 flex justify-between items-center">
                                <div className="space-y-0.5">
                                    <p className="font-bold text-sm text-gray-900">Two-Factor Authentication (2FA)</p>
                                    <p className="text-xs text-gray-500">Secure your account with code-based authentication.</p>
                                </div>
                                <button
                                    onClick={() => setTfaEnabled(!tfaEnabled)}
                                    className={cn(
                                        "w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative shrink-0",
                                        tfaEnabled ? "bg-green-500" : "bg-gray-200"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 transform",
                                        tfaEnabled ? "translate-x-6" : "translate-x-0"
                                    )} />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="font-bold text-sm text-gray-900">Active Sessions</p>
                                    <button className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-widest">Logout all devices</button>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="p-2 bg-white rounded-lg border border-gray-100 text-gray-400">
                                            <Icon name="Laptop" size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-900">MacBook Pro ・ Chrome</p>
                                            <p className="text-[10px] text-gray-500 italic">Current Session ・ Lagos, Nigeria</p>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-transparent rounded-xl border border-transparent">
                                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-400">
                                            <Icon name="Smartphone" size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-700">iPhone 15 ・ Safari</p>
                                            <p className="text-[10px] text-gray-400">2 days ago ・ Abuja, Nigeria</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50/30 border border-red-100 p-6 rounded-2xl flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="font-bold text-red-900 text-sm">Delete Account</h4>
                            <p className="text-xs text-red-700 leading-relaxed max-w-md">
                                Physically removing your personal data from Vayva. This action is permanent and cannot be undone.
                            </p>
                        </div>
                        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
