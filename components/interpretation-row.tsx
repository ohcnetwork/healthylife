import { StatusBadge, getStatusType } from "@/components/status-badge";
import { cn } from "@/lib/utils";

interface InterpretationRowProps {
  label: string;
  value: string | number;
  status: { label: string; color: string };
  unit?: string;
  className?: string;
}

export function InterpretationRow({
  label,
  value,
  status,
  unit,
  className,
}: InterpretationRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3",
        className
      )}
    >
      <div>
        <p className="text-sm text-slate-600">{label}</p>
        <p className="text-xl font-semibold tabular-nums text-slate-900">
          {value}
          {unit && (
            <span className="text-sm font-normal text-slate-500 ml-1">
              {unit}
            </span>
          )}
        </p>
      </div>
      <StatusBadge status={getStatusType(status.color)} label={status.label} />
    </div>
  );
}
