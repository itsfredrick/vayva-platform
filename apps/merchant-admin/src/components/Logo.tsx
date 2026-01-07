import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  className?: string;
}

const sizeMap = {
  sm: { width: 48, height: 48, text: "text-lg" },
  md: { width: 64, height: 64, text: "text-2xl" },
  lg: { width: 80, height: 80, text: "text-3xl" },
};

const MARKETING_URL = "https://vayva.co";

export function Logo({
  size = "md",
  showText = true,
  href = "/",
  className = "",
}: LogoProps) {
  const { width, height, text } = sizeMap[size as keyof typeof sizeMap] || sizeMap.md;
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (isStandalone) {
      e.preventDefault();
      window.open(MARKETING_URL, "_blank");
    }
  };

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/brand-logo.png"
        alt="Vayva Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
      {showText && (
        <span className={`font-bold tracking-tight text-[#0B0B0B] ${text}`}>
          Vayva
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={isStandalone ? MARKETING_URL : href}
        className="flex items-center"
        onClick={handleClick}
        target={isStandalone ? "_blank" : undefined}
      >
        {content}
      </Link>
    );
  }

  return content;
}
