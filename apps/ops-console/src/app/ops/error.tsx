
"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function OpsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Ops Console Error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-6">
            <div className="p-4 bg-red-50 rounded-full">
                <AlertCircle className="h-12 w-12 text-red-600" />
            </div>

            <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold text-gray-900">Something went wrong!</h2>
                <p className="text-gray-500">
                    {error.message || "An unexpected error occurred while loading the dashboard."}
                </p>
                {error.digest && (
                    <p className="text-xs text-gray-400 font-mono">Error ID: {error.digest}</p>
                )}
            </div>

            <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-sm active:scale-95 transform duration-100"
            >
                <RefreshCcw className="h-4 w-4" />
                Try again
            </button>
        </div>
    );
}
