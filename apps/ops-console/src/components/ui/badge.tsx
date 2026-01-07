import { StatusChip } from "@vayva/ui";

export const Badge = ({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}) => {
  // Map variants to StatusChip type
  let type: "success" | "warning" | "error" | "info" | "neutral" = "neutral";
  if (variant === "default") type = "success";
  if (variant === "destructive") type = "error";
  if (variant === "secondary") type = "info";

  // StatusChip expects 'status' string as content and 'type' as style
  // We ignore className for now as StatusChip might not support it, 
  // or we wrap it if needed. For lint fixing, accepting it is enough.
  return <div className={className}><StatusChip status={String(children)} type={type} /></div>;
};
