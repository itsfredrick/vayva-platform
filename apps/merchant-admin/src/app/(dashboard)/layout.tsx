import { AdminShell } from "@/components/admin-shell";
import { requireAuth } from "@/lib/session";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { OrderNotificationProvider } from "@/providers/OrderNotificationProvider";
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Check if actually authenticated at all
    const sessionResponse = await auth.api.getSession({
        headers: await headers()
    });

    const session = sessionResponse?.session;
    const sessionUser = sessionResponse?.user;

    if (!session || !sessionUser) {
        redirect("/signin");
    }

    // 2. Strict: Email Verification
    // Use the session's emailVerified field (source of truth from auth provider)
    if (!sessionUser.emailVerified) {
        redirect("/verify");
    }

    // 3. Check if they have a valid Merchant/Store profile
    const user = await requireAuth();

    if (!user) {
        // Authenticated but no store/membership -> Onboarding
        redirect("/onboarding");
    }

    // 4. Strict: Onboarding Complete
    if (!user.onboardingCompleted) {
        redirect("/onboarding");
    }

    return (
        <OrderNotificationProvider>
            <AdminShell>
                {children}
            </AdminShell>
        </OrderNotificationProvider>
    );
}
