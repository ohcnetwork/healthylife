import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisclaimerAlertProps {
  variant?: "default" | "warning";
  title?: string;
  className?: string;
}

export function DisclaimerAlert({
  variant = "default",
  title = "Important",
  className,
}: DisclaimerAlertProps) {
  const isWarning = variant === "warning";

  return (
    <Alert
      className={cn(
        isWarning
          ? "bg-amber-50 border-amber-200 text-amber-900"
          : "bg-slate-100 border-slate-200 text-slate-800",
        className
      )}
    >
      {isWarning ? (
        <AlertTriangle className="h-4 w-4 text-amber-600" />
      ) : (
        <Info className="h-4 w-4 text-slate-600" />
      )}
      <AlertTitle className="font-semibold">{title}</AlertTitle>
      <AlertDescription className="text-sm">
        This tool provides general risk information and is not a diagnosis. It
        does not provide treatment advice. If you have symptoms or concerns,
        consult a doctor or visit your nearest health facility.
      </AlertDescription>
    </Alert>
  );
}
