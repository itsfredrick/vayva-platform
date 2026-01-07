import React from "react";
import { cn } from "../utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "brand" | "default";
}

export const Skeleton = ({ className, variant = "default", ...props }: SkeletonProps) => {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md",
                variant === "brand" ? "bg-[#46EC13]/10" : "bg-gray-200/50 dark:bg-gray-700/50",
                className
            )}
            {...props}
        />
    );
};
