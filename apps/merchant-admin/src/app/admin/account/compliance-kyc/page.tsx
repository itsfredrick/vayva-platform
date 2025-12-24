'use client';

import React, { useState, useEffect } from 'react';
import { FileCheck, Upload, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface KYCData {
    status: string;
    businessType: string | null;
    documents: Array<{
        type: string;
        status: string;
        uploadedAt: string;
    }>;
    canWithdraw: boolean;
}

export default function KYCPage() {
    const [data, setData] = useState<KYCData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchKYC();
    }, []);

    const fetchKYC = async () => {
        try {
            const res = await fetch('/api/kyc/status');
            if (!res.ok) throw new Error('Failed to fetch');
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error('Failed to load KYC', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!data) {
        return <div className="text-center py-12 text-gray-500">Failed to load KYC status</div>;
    }

    const getStatusIcon = (status: string) => {
        switch (status.toUpperCase()) {
            case 'VERIFIED':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'PENDING':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            case 'FAILED':
                return <XCircle className="w-5 h-5 text-red-600" />;
            default:
                return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'VERIFIED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'FAILED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Compliance & KYC</h1>
                <p className="text-gray-600 mt-1">
                    Complete your verification to enable withdrawals
                </p>
            </div>

            {/* Status Overview */}
            <div className={`
                rounded-lg border-2 p-6
                ${data.status === 'VERIFIED' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}
            `}>
                <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(data.status)}
                    <h3 className="text-lg font-semibold text-gray-900">
                        Verification Status: {data.status.replace('_', ' ')}
                    </h3>
                </div>
                <p className="text-gray-700">
                    {data.canWithdraw
                        ? 'Your account is verified. You can now withdraw funds.'
                        : 'Complete verification to enable withdrawals and unlock all features.'}
                </p>
            </div>

            {/* Required Documents */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>

                <div className="space-y-4">
                    {data.documents.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 mb-4">No documents uploaded yet</p>
                            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                                Start Verification
                            </button>
                        </div>
                    ) : (
                        data.documents.map((doc) => (
                            <div key={doc.type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(doc.status)}
                                    <div>
                                        <p className="font-medium text-gray-900">{doc.type}</p>
                                        <p className="text-sm text-gray-600">
                                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(doc.status)}`}>
                                    {doc.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Upload Section */}
            {data.status !== 'VERIFIED' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h3>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500">PDF, JPG, PNG up to 10MB</p>
                    </div>

                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900 font-medium mb-2">Required Documents:</p>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• BVN or NIN</li>
                            <li>• Government-issued ID (Driver's License, Passport, or Voter's Card)</li>
                            <li>• CAC Certificate (for registered businesses)</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
