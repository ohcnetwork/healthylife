"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { StatusBadge, getStatusType } from "@/components/status-badge";
import { InterpretationRow } from "@/components/interpretation-row";
import { DisclaimerAlert } from "@/components/disclaimer-alert";
import {
  Download,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Utensils,
  Building2,
  Heart,
  Scale,
  HeartPulse,
  Droplet,
  ClipboardList,
  Stethoscope,
  FileText,
  Loader2,
} from "lucide-react";
import {
  useAssessment,
  getBPStatus,
  getSugarStatus,
} from "@/lib/assessment-context";
import { generateHealthPDF } from "@/lib/generate-pdf";
import { toast } from "sonner";

export default function Step6Page() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    data,
    resetAssessment,
    calculateBMI,
    getBMICategory,
    calculateCBACScore,
    hasAnyCancerSymptom,
    needsLifestyleGuidance,
  } = useAssessment();

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(bmi) : null;
  const bpStatus = getBPStatus(data.systolic, data.diastolic);
  const sugarStatus = getSugarStatus(data.sugarType, data.sugarValue);
  const cbacScore = calculateCBACScore();
  const hasCancerSymptoms = hasAnyCancerSymptom();
  const guidance = needsLifestyleGuidance();

  const isHighCBACRisk = cbacScore > 4;
  const needsConsultation = isHighCBACRisk || hasCancerSymptoms;

  // Generate advice based on data
  const keyAdvice = useMemo(() => {
    const advice: string[] = [];

    if (isHighCBACRisk) {
      advice.push(
        "Please visit the nearest Janakeeya Arogya Kendram for NCD risk evaluation."
      );
    }

    if (hasCancerSymptoms) {
      advice.push(
        "Please consult a doctor for evaluation of reported symptoms."
      );
    }

    if (guidance.tobacco) {
      advice.push(
        "Consider seeking tobacco cessation support; reducing tobacco lowers risk over time."
      );
    }

    if (guidance.alcohol) {
      advice.push(
        "Reducing daily alcohol can improve long-term health; consider support services if needed."
      );
    }

    if (guidance.activity) {
      advice.push(
        "Aim for at least 150 minutes/week of moderate activity, starting gradually."
      );
    }

    return advice;
  }, [isHighCBACRisk, hasCancerSymptoms, guidance]);

  // Diet tips based on BMI
  const dietTips = useMemo(() => {
    if (!bmiCategory) return [];

    switch (bmiCategory.label) {
      case "Underweight":
        return [
          "Add nutrient-dense meals and snacks",
          "Include protein sources daily (eggs, dal, milk, fish)",
          "Eat small, frequent meals",
        ];
      case "Overweight":
      case "Obese":
        return [
          "Reduce sugary drinks and processed foods",
          "Fill half your plate with vegetables",
          "Practice portion control",
          "Choose whole grains over refined",
        ];
      default:
        return [
          "Maintain balanced meals with variety",
          "Include fruits and vegetables daily",
          "Stay hydrated with water",
        ];
    }
  }, [bmiCategory]);

  // Sugar-specific tips
  const sugarTips = useMemo(() => {
    if (sugarStatus?.color === "amber" || sugarStatus?.color === "rose") {
      return [
        "Choose whole grains over refined carbs",
        "Limit sweets and sugary drinks",
        "Don't skip meals; prefer steady meal timing",
        "Consult a doctor for proper testing",
      ];
    }
    return [];
  }, [sugarStatus]);

  // Activity tips based on level
  const activityTips = useMemo(() => {
    switch (data.activityLevel) {
      case "sedentary":
        return [
          "Start with 10 minutes/day walking",
          "Take short breaks from sitting every hour",
          "Use stairs when possible",
        ];
      case "moderate":
        return [
          "Add 1-2 longer walks per week",
          "Try to reach 150 minutes/week",
          "Include variety (walking, cycling, swimming)",
        ];
      case "adequate":
        return [
          "Maintain your current routine",
          "Add strength exercises twice weekly",
          "Try new activities to stay motivated",
        ];
      default:
        return [];
    }
  }, [data.activityLevel]);

  const handleRestart = () => {
    resetAssessment();
    router.push("/");
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      generateHealthPDF({
        data,
        bmi,
        bmiCategory,
        cbacScore,
        hasCancerSymptoms,
        keyAdvice,
        dietTips,
        sugarTips,
        activityTips,
      });

      toast.success("PDF downloaded successfully!", {
        description: "Check your downloads folder",
      });
    } catch (error) {
      toast.error("Failed to generate PDF", {
        description: "Please try again",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppShell currentStep={6} totalSteps={6}>
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Your Summary
                </CardTitle>
                <CardDescription>
                  Assessment completed on {new Date().toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Consultation Alert (if needed) */}
        {needsConsultation && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-900 font-semibold">
              We recommend consulting a doctor
            </AlertTitle>
            <AlertDescription className="text-amber-800">
              <div>
                Based on your assessment, please visit the nearest{" "}
                <strong>Janakeeya Arogya Kendram</strong> for further
                evaluation. or contact your ASHA for further assistance.
              </div>
              <Button className="mt-3 bg-emerald-600 hover:bg-emerald-700 gap-2 w-full">
                <Building2 className="w-4 h-4" />
                <div>Find nearby JAK</div>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Measurements Section */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              Measurements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bmi && bmiCategory && (
              <InterpretationRow label="BMI" value={bmi} status={bmiCategory} />
            )}

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">Blood Pressure</span>
              </div>
              {data.bpEntered ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {data.systolic}/{data.diastolic} mmHg
                  </span>
                  <StatusBadge
                    status={getStatusType(bpStatus.color)}
                    label={bpStatus.label}
                  />
                </div>
              ) : (
                <StatusBadge status="muted" label="Not entered" />
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">Blood Sugar</span>
              </div>
              {data.sugarEntered ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {data.sugarValue}{" "}
                    {data.sugarType === "hba1c" ? "%" : "mg/dL"}
                  </span>
                  <StatusBadge
                    status={getStatusType(sugarStatus.color)}
                    label={sugarStatus.label}
                  />
                </div>
              ) : (
                <StatusBadge status="muted" label="Not entered" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Risk Scores Section */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-600" />
              Risk Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div>
                <p className="text-sm text-slate-600">CBAC Score</p>
                <p className="text-2xl font-semibold tabular-nums">
                  {cbacScore}
                </p>
              </div>
              <StatusBadge
                status={isHighCBACRisk ? "elevated" : "normal"}
                label={isHighCBACRisk ? "Higher risk" : "Lower risk"}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <span className="text-sm text-slate-600">
                Cancer symptoms reported
              </span>
              <StatusBadge
                status={hasCancerSymptoms ? "high" : "normal"}
                label={hasCancerSymptoms ? "Yes" : "No"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Key Advice Section */}
        {keyAdvice.length > 0 && (
          <Card className="bg-white border border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                Key Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {keyAdvice.map((advice, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    {advice}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Diet & Exercise Guidance */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Personalised Guidance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Accordion type="multiple" className="space-y-2">
              <AccordionItem
                value="diet"
                className="border border-slate-200 rounded-lg px-4"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium">Diet Tips</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="space-y-2 text-sm text-slate-700">
                    {dietTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                  {sugarTips.length > 0 && (
                    <>
                      <p className="text-sm font-medium text-slate-700 mt-4 mb-2">
                        For blood sugar:
                      </p>
                      <ul className="space-y-2 text-sm text-slate-700">
                        {sugarTips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="exercise"
                className="border border-slate-200 rounded-lg px-4"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium">Activity Tips</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="space-y-2 text-sm text-slate-700">
                    {activityTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <DisclaimerAlert variant="warning" />

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
              >
                <Download className="w-5 h-5" />
                Download Summary (PDF)
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Download your summary
                </DialogTitle>
                <DialogDescription>
                  Generate a beautifully formatted PDF with all your assessment
                  results.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900">
                    Your PDF will include:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Body measurements & BMI
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Risk scores & interpretations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Personalised recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Diet & activity guidance
                    </li>
                  </ul>
                </div>
                <Alert className="bg-emerald-50 border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-800">
                    The PDF will be saved on your device only. We don&apos;t
                    store or see it.
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                    onClick={handleDownload}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2"
            onClick={handleRestart}
          >
            <RotateCcw className="w-5 h-5" />
            Start New Assessment
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
