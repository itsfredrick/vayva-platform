export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#F5F5F7]">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#46EC13]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            {/* Glass Card Container */}
            <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] shadow-xl">
                <div className="w-16 h-16 bg-[#46EC13] rounded-2xl flex items-center justify-center mx-auto mb-6 text-black shadow-lg shadow-[#46EC13]/20">
                    <span className="font-bold text-3xl">V</span>
                </div>
                {children}
            </div>
        </div>
    );
}
