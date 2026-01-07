import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@vayva/db";
import { ResendEmailService } from "./email/resend";
import { emailOTP } from "better-auth/plugins";
import { headers } from "next/headers";

/**
 * NATIVE BETTER AUTH CONFIGURATION
 * This replaces the managed Neon Auth setup to allow full control over email delivery.
 */
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    // We use NEXTAUTH_SECRET as a fallback to maintain compatibility with existing envs
    secret: process.env.BETTER_AUTH_SECRET || process.env.NEXTAUTH_SECRET,

    emailAndPassword: {
        enabled: true,
    },

    plugins: [
        emailOTP({
            expiresIn: 900, // 15 minutes
            sendVerificationOnSignUp: true,
            async sendVerificationOTP({ email, otp }: { email: string; otp: string }) {
                // console.log("Sending OTP to", email);
                await ResendEmailService.sendOTPEmail(email, otp);
            },
        }),
    ],

    // Better Auth includes built-in support for social providers, but the user only mentioned emails/otp

    // Custom email verification (if using links)
    // Custom email verification (if using links)
    // We are strictly using OTPs via the email-otp plugin, so we disable the default link behavior
    // to prevent duplicate or ugly emails.
    emailVerification: {
        sendOnSignUp: false,
        autoSignInAfterVerification: true,
    },
    trustedOrigins: ["http://localhost:3000"],
    advanced: {
        cookiePrefix: "better-auth",
        defaultCookieAttributes: {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            httpOnly: true,
        },
    },
});
