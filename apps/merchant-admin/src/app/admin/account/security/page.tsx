'use client';

import React, { useState } from 'react';
import { Lock, Shield, Smartphone, Loader2, CheckCircle } from 'lucide-react';

export default function SecurityPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
            return;
        }

        setChangingPassword(true);

        try {
            const res = await fetch('/api/security/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to change password');
            }

            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
                <p className="text-gray-600 mt-1">
                    Manage your password and security preferences
                </p>
            </div>

            {/* Password Change */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Lock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                        <p className="text-sm text-gray-600">Update your password regularly for security</p>
                    </div>
                </div>

                {message && (
                    <div className={`
                        mb-6 p-4 rounded-lg border flex items-start gap-3
                        ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
                    `}>
                        {message.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
                        <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                            {message.text}
                        </p>
                    </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={changingPassword}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {changingPassword ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </form>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <Smartphone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">
                        Two-factor authentication is currently <span className="font-semibold text-gray-900">disabled</span>
                    </p>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
                        Enable 2FA
                    </button>
                </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-50 rounded-lg">
                        <Shield className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
                        <p className="text-sm text-gray-600">Manage devices where you're currently logged in</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                            <p className="font-medium text-gray-900">Current Session</p>
                            <p className="text-sm text-gray-600">Chrome on Mac • Lagos, Nigeria</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            Active Now
                        </span>
                    </div>
                </div>

                <button className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium">
                    Logout All Other Sessions
                </button>
            </div>
        </div>
    );
}
