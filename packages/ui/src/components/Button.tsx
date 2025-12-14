import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';
import { motion, hoverLift, tapScale } from '../motion';

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-black hover:bg-primary/90",
                destructive: "bg-red-500 text-white hover:bg-red-600",
                outline: "border border-white/10 bg-white/5 hover:bg-white/10 text-white",
                secondary: "bg-white/10 text-white hover:bg-white/20",
                ghost: "hover:bg-white/10 text-white",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const BaseButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        return (
            <motion.button
                className={cn(buttonVariants({ variant, size, className }))}
                // @ts-ignore: framer-motion refs are compatible but types can be strict
                ref={ref}
                whileHover={!props.disabled ? hoverLift : undefined}
                whileTap={!props.disabled ? tapScale : undefined}
                {...(props as any)}
            />
        );
    }
);
BaseButton.displayName = "Button";

export { BaseButton as Button, buttonVariants };
