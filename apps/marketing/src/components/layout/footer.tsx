import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-slate-900/10 pt-16 pb-8">
            <div className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <Link href={ROUTES.home} className="text-xl font-bold text-[#0B1220] block mb-4">
                            Vayva
                        </Link>
                        <p className="text-sm text-slate-500 mb-6">
                            WhatsApp commerce built for Nigeria—sell, get paid, and deliver with confidence.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#0B1220] mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link href={ROUTES.templates} className="hover:text-[#22C55E]">Templates</Link></li>
                            <li><Link href={ROUTES.pricing} className="hover:text-[#22C55E]">Pricing</Link></li>
                            <li><Link href={ROUTES.developers || "#"} className="hover:text-[#22C55E]">Developers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#0B1220] mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link href={ROUTES.contact} className="hover:text-[#22C55E]">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#0B1220] mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link href={ROUTES.terms} className="hover:text-[#22C55E]">Terms of Service</Link></li>
                            <li><Link href={ROUTES.privacy} className="hover:text-[#22C55E]">Privacy Policy</Link></li>
                            <li><Link href={ROUTES.refunds} className="hover:text-[#22C55E]">Refund Policy</Link></li>
                            <li><Link href={ROUTES.shippingDelivery} className="hover:text-[#22C55E]">Shipping & Delivery</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-900/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
                    <p>&copy; {currentYear} Vayva Platform.</p>
                    <div className="flex gap-6">
                        <Link href={ROUTES.security} className="hover:text-slate-600">Security</Link>
                        <Link href={ROUTES.cookies} className="hover:text-slate-600">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
