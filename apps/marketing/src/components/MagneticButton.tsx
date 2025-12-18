"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost";

function cx(...classes: Array<string | false | undefined | null>) {
    return classes.filter(Boolean).join(" ");
}

const base =
    "no-underline inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold select-none " +
    "transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7FAF7]";

const styles: Record<Variant, string> = {
    primary:
        "bg-[#22C55E] text-white shadow-[0_10px_30px_rgba(34,197,94,0.20)] hover:brightness-[1.02]",
    secondary:
        "bg-white/70 text-[#0B1220] ring-1 ring-slate-900/10 hover:bg-white/80",
    ghost: "bg-transparent text-[#0B1220]/70 hover:text-[#0B1220]",
};

export function MagneticButton({
    children,
    className,
    variant = "primary",
    asChild = false,
}: {
    children: React.ReactNode;
    className?: string;
    variant?: Variant;
    asChild?: boolean;
}) {
    const reduce = useReducedMotion();
    const ref = React.useRef<HTMLDivElement>(null);
    const [xy, setXy] = React.useState({ x: 0, y: 0 });

    function onMove(e: React.PointerEvent) {
        if (reduce) return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = e.clientX - (r.left + r.width / 2);
        const py = e.clientY - (r.top + r.height / 2);
        setXy({ x: px * 0.12, y: py * 0.12 });
    }

    function onLeave() {
        setXy({ x: 0, y: 0 });
    }

    const cls = cx(base, styles[variant], className);

    const rendered = (() => {
        if (asChild) {
            const childrenArray = React.Children.toArray(children);
            const child = childrenArray.find((c) => React.isValidElement(c));

            if (child && React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                    className: cx(cls, (child as any).props?.className),
                });
            }
        }
        return (
            <button className={cls} type="button">
                {children}
            </button>
        );
    })();

    return (
        <motion.div
            ref={ref}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            animate={reduce ? { x: 0, y: 0 } : { x: xy.x, y: xy.y }}
            transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.6 }}
            className="inline-block"
        >
            {rendered}
        </motion.div>
    );
}
