"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DisclaimerAlert } from "@/components/disclaimer-alert";
import { InterpretationRow } from "@/components/interpretation-row";
import { 
  AlertTriangle,
  Building2,
  Download,
  RotateCcw,
  HelpCircle,
  HeartPulse,
  Droplet
} from "lucide-react";
import { useAssessment, getBPStatus, getSugarStatus } from "@/lib/assessment-context";
import Link from "next/link";

export default function AdvisoryPage() {
  const router = useRouter();
  const { data, resetAssessment, calculateBMI, getBMICategory } = useAssessment();

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(bmi) : null;
  const bpStatus = getBPStatus(data.systolic, data.diastolic);
  const sugarStatus = getSugarStatus(data.sugarType, data.sugarValue);

  const handleRestart = () => {
    resetAssessment();
    router.push("/");
  };

  const handleDownload = () => {
    // Generate simple text summary for now
    const summary = `
HEALTH ASSESSMENT - VITALS SUMMARY
Date: ${new Date().toLocaleDateString()}

MEASUREMENTS
${bmi ? `BMI: ${bmi} (${bmiCategory?.label})` : "BMI: Not calculated"}
${data.bpEntered ? `Blood Pressure: ${data.systolic}/${data.diastolic} mmHg (${bpStatus.label})` : "Blood Pressure: Not entered"}
${data.sugarEntered ? `Blood Sugar (${data.sugarType?.toUpperCase()}): ${data.sugarValue} ${data.sugarType === "hba1c" ? "%" : "mg/dL"} (${sugarStatus.label})` : "Blood Sugar: Not entered"}

ADVISORY
Your entered blood pressure or blood sugar is higher than normal.
Please consult a doctor at your nearest health facility for further evaluation.

DISCLAIMER
This tool provides general risk information and is not a diagnosis.
It does not provide treatment advice.
`.trim();

    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "health-vitals-summary.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell currentStep={2} totalSteps={4}>
      <div className="space-y-6">
        {/* Main Advisory Alert */}
        <Alert className="bg-rose-50 border-rose-200">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
          <AlertTitle className="text-lg font-semibold text-rose-900">
            We recommend speaking to a doctor
          </AlertTitle>
          <AlertDescription className="text-rose-800 mt-2">
            Your entered blood pressure or blood sugar is higher than normal. 
            This tool can&apos;t interpret risk scores safely when these are high. 
            Please consult a doctor at your nearest Family Health Centre for further evaluation.
          </AlertDescription>
        </Alert>

        {/* Measurements Summary */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Your measurements</CardTitle>
            <CardDescription>What you entered in this assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {bmi && bmiCategory && (
              <InterpretationRow
                label="BMI"
                value={bmi}
                status={bmiCategory}
              />
            )}

            {data.bpEntered && (
              <InterpretationRow
                label="Blood Pressure"
                value={`${data.systolic}/${data.diastolic}`}
                unit="mmHg"
                status={bpStatus}
              />
            )}

            {data.sugarEntered && (
              <InterpretationRow
                label={`Blood Sugar (${data.sugarType?.toUpperCase()})`}
                value={data.sugarValue || 0}
                unit={data.sugarType === "hba1c" ? "%" : "mg/dL"}
                status={sugarStatus}
              />
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            size="lg"
          >
            <Building2 className="w-5 h-5" />
            Consult a doctor at your nearest Family Health Centre
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
              Download my measurements
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleRestart}
            >
              <RotateCcw className="w-4 h-4" />
              Restart assessment
            </Button>
          </div>
        </div>

        {/* Why am I seeing this? */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full text-slate-600 gap-2">
              <HelpCircle className="w-4 h-4" />
              Why am I seeing this?
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Why we&apos;re showing this advisory</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm text-slate-700">
              <p>
                When blood pressure or blood sugar readings are higher than normal, 
                continuing with risk scoring could give misleading results.
              </p>
              <p>
                <strong>For blood pressure:</strong> Readings of 140/90 mmHg or higher 
                suggest you should speak with a healthcare provider about management 
                and lifestyle changes.
              </p>
              <p>
                <strong>For blood sugar:</strong> Elevated readings may indicate 
                pre-diabetes or diabetes, which requires proper medical evaluation 
                and testing.
              </p>
              <p>
                This is why we recommend consulting a doctor before continuing with 
                the general risk assessment.
              </p>
            </div>
          </DialogContent>
        </Dialog>

        <Separator />

        <DisclaimerAlert variant="warning" />
      </div>
    </AppShell>
  );
}

