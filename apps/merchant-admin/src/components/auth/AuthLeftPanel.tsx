"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface AuthLeftPanelProps {
  showSignInLink?: boolean;
  showSignUpLink?: boolean;
}

export const AuthLeftPanel = ({
  showSignInLink,
  showSignUpLink,
}: AuthLeftPanelProps) => {
  return (
    <div className="hidden lg:flex lg:w-[45%] relative bg-[#0A0F1C] flex-col justify-between p-12 overflow-hidden text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/auth-bg.png"
          alt="Abstract Background"
          fill
          className="object-cover opacity-80"
          priority
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content Container (z-10 to sit above bg) */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Top: Logo */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
              <Image
                src="/brand-logo.png"
                alt="Vayva Logo"
                width={24}
                height={24}
                className="object-contain invert brightness-0"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-space-grotesk">Vayva</span>
          </Link>
        </div>

        {/* Center: Value Prop with Glassmorphism Card */}
        <div className="flex flex-col items-start justify-center flex-1 max-w-lg">
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            <h2 className="text-4xl font-bold mb-4 leading-tight font-space-grotesk text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200">
              Run your business on WhatsApp
            </h2>

            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Transform chaotic conversations into organized orders, payments, and
              delivery tracking. The operating system for modern African commerce.
            </p>

            <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Real-time Sync</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-600" />
              <span>Automated Invoices</span>
            </div>
          </div>
        </div>

        {/* Bottom: Links */}
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link
            href="/"
            className="hover:text-white transition-colors flex items-center gap-2 group-hover:-translate-x-1 duration-200"
          >
            ← Back to home
          </Link>

          <div className="flex-1" />

          {showSignInLink && (
            <Link href="/signin" className="hover:text-white transition-colors">
              Sign in
            </Link>
          )}

          {showSignUpLink && (
            <Link href="/signup" className="hover:text-white transition-colors">
              Create account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
