import React, { useState } from "react";
import Link from "next/link";
import { LegalModals } from "./LegalModals";

interface AuthRightPanelProps {
  children: React.ReactNode;
  stepIndicator?: string;
  title: string;
  subtitle?: React.ReactNode;
}

export const AuthRightPanel = ({
  children,
  stepIndicator,
  title,
  subtitle,
}: AuthRightPanelProps) => {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <div className="flex-1 lg:w-[55%] bg-white flex flex-col">
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[480px]">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <div className="text-base text-gray-600 mb-8">{subtitle}</div>
          )}

          {/* Form content */}
          <div>{children}</div>

          {/* Help Link - Centered under the action button */}
          <div className="mt-8 text-center">
            <Link
              href="https://vayva.co/help"
              target="_blank"
              className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Having trouble? Get help
            </Link>
          </div>

          {/* Simple Footer Links - Centered under the form */}
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-400">
            <button
              onClick={() => setTermsOpen(true)}
              className="hover:text-gray-600 transition-colors"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-gray-600 transition-colors"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      <LegalModals
        termsOpen={termsOpen}
        privacyOpen={privacyOpen}
        onCloseTerms={() => setTermsOpen(false)}
        onClosePrivacy={() => setPrivacyOpen(false)}
      />
    </div>
  );
};
