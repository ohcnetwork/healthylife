import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusType = "normal" | "elevated" | "high" | "info" | "muted";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  normal: {
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Icon: CheckCircle2,
  },
  elevated: {
    className: "bg-amber-50 text-amber-900 border-amber-200",
    Icon: AlertTriangle,
  },
  high: {
    className: "bg-rose-50 text-rose-900 border-rose-200",
    Icon: AlertCircle,
  },
  info: {
    className: "bg-sky-50 text-sky-900 border-sky-200",
    Icon: Info,
  },
  muted: {
    className: "bg-slate-100 text-slate-600 border-slate-200",
    Icon: Info,
  },
};

export function StatusBadge({
  status,
  label,
  showIcon = true,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.Icon;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium", config.className, className)}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </Badge>
  );
}

// Color mapping helper
export function getStatusType(color: string): StatusType {
  switch (color) {
    case "emerald":
      return "normal";
    case "amber":
      return "elevated";
    case "rose":
      return "high";
    case "sky":
      return "info";
    default:
      return "muted";
  }
}
