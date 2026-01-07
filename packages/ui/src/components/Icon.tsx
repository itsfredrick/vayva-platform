"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

export type IconName = keyof typeof dynamicIconImports | (string & {});

export interface IconProps extends LucideProps {
  name: IconName;
}

// Module-level cache for dynamic icon components to prevent re-creation during render
const iconCache: Record<string, React.ComponentType<LucideProps>> = {};

export const Icon = ({ name, ...props }: IconProps) => {
  const kebabName = useMemo(() => {
    return name
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase();
  }, [name]);

  const IconComponent = useMemo(() => {
    const importName = kebabName as keyof typeof dynamicIconImports;
    if (!iconCache[importName]) {
      const importer = dynamicIconImports[importName];
      if (!importer) return null;
      iconCache[importName] = dynamic(importer) as React.ComponentType<LucideProps>;
    }
    return iconCache[importName];
  }, [kebabName]);

  if (!IconComponent) return null;

  return <IconComponent {...props} />;
};
