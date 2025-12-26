"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
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
  Cigarette,
  Wine,
  Lightbulb,
  ChevronLeft
} from "lucide-react";
import { 
  useAssessment, 
  getBPStatus, 
  getSugarStatus,
} from "@/lib/assessment-context";
import { generateHealthPDF } from "@/lib/generate-pdf";
import { toast } from "sonner";
import Link from "next/link";

export default function Step4Page() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const { 
    data, 
    resetAssessment, 
    calculateBMI, 
    getBMICategory,
    calculateCBACScore,
    needsLifestyleGuidance
  } = useAssessment();

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(bmi) : null;
  const bpStatus = getBPStatus(data.systolic, data.diastolic);
  const sugarStatus = getSugarStatus(data.sugarType, data.sugarValue);
  const cbacScore = calculateCBACScore();
  const guidance = needsLifestyleGuidance();

  const isHighCBACRisk = cbacScore > 4;
  const needsConsultation = isHighCBACRisk;
  const hasAnyLifestyleTrigger = guidance.tobacco || guidance.alcohol || guidance.activity;

  // Generate advice based on data
  const keyAdvice = useMemo(() => {
    const advice: string[] = [];

    if (isHighCBACRisk) {
      advice.push("Please visit the nearest Janakeeya Arogya Kendram for NCD risk evaluation.");
    }

    if (guidance.tobacco) {
      advice.push("Consider seeking tobacco cessation support; reducing tobacco lowers risk over time.");
    }

    if (guidance.alcohol) {
      advice.push("Reducing daily alcohol can improve long-term health; consider support services if needed.");
    }

    if (guidance.activity) {
      advice.push("Aim for at least 150 minutes/week of moderate activity, starting gradually.");
    }

    return advice;
  }, [isHighCBACRisk, guidance]);

  // Diet tips based on BMI
  const dietTips = useMemo(() => {
    if (!bmiCategory) return [];

    switch (bmiCategory.label) {
      case "Underweight":
        return [
          "Add nutrient-dense meals and snacks",
          "Include protein sources daily (eggs, dal, milk, fish)",
          "Eat small, frequent meals"
        ];
      case "Overweight":
      case "Obese":
        return [
          "Reduce sugary drinks and processed foods",
          "Fill half your plate with vegetables",
          "Practice portion control",
          "Choose whole grains over refined"
        ];
      default:
        return [
          "Maintain balanced meals with variety",
          "Include fruits and vegetables daily",
          "Stay hydrated with water"
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
        "Consult a doctor for proper testing"
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
          "Use stairs when possible"
        ];
      case "moderate":
        return [
          "Add 1-2 longer walks per week",
          "Try to reach 150 minutes/week",
          "Include variety (walking, cycling, swimming)"
        ];
      case "adequate":
        return [
          "Maintain your current routine",
          "Add strength exercises twice weekly",
          "Try new activities to stay motivated"
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      generateHealthPDF({
        data,
        bmi,
        bmiCategory,
        cbacScore,
        keyAdvice,
        dietTips,
        sugarTips,
        activityTips,
      });
      
      toast.success("PDF downloaded successfully!", {
        description: "Check your downloads folder"
      });
    } catch {
      toast.error("Failed to generate PDF", {
        description: "Please try again"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppShell currentStep={4} totalSteps={4}>
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Your Summary & Guidance</CardTitle>
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
              <div>Based on your assessment, please visit the nearest <strong>Janakeeya Arogya Kendram</strong> for further evaluation, or contact your ASHA for assistance.</div>
              <Button className="mt-3 bg-emerald-600 hover:bg-emerald-700 gap-2 w-full">
                <Building2 className="w-4 h-4" />
                Find nearby JAK
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
              <InterpretationRow
                label="BMI"
                value={bmi}
                status={bmiCategory}
              />
            )}

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">Blood Pressure</span>
              </div>
              {data.bpEntered ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{data.systolic}/{data.diastolic} mmHg</span>
                  <StatusBadge status={getStatusType(bpStatus.color)} label={bpStatus.label} />
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
                    {data.sugarValue} {data.sugarType === "hba1c" ? "%" : "mg/dL"}
                  </span>
                  <StatusBadge status={getStatusType(sugarStatus.color)} label={sugarStatus.label} />
                </div>
              ) : (
                <StatusBadge status="muted" label="Not entered" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Risk Score Section */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-600" />
              Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div>
                <p className="text-sm text-slate-600">CBAC Score</p>
                <p className="text-2xl font-semibold tabular-nums">{cbacScore}</p>
              </div>
              <StatusBadge 
                status={isHighCBACRisk ? "elevated" : "normal"} 
                label={isHighCBACRisk ? "Higher risk" : "Lower risk"} 
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
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    {advice}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Lifestyle Guidance Section */}
        {hasAnyLifestyleTrigger && (
          <Card className="bg-white border border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Your Focus Areas</CardTitle>
              <CardDescription>
                Based on your answers, here are areas where small changes can help
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Focus Area Badges */}
              <div className="flex flex-wrap gap-2">
                {guidance.tobacco && (
                  <Badge className="bg-amber-50 text-amber-800 border border-amber-200">
                    <Cigarette className="w-3 h-3 mr-1" />
                    Tobacco
                  </Badge>
                )}
                {guidance.alcohol && (
                  <Badge className="bg-amber-50 text-amber-800 border border-amber-200">
                    <Wine className="w-3 h-3 mr-1" />
                    Alcohol
                  </Badge>
                )}
                {guidance.activity && (
                  <Badge className="bg-amber-50 text-amber-800 border border-amber-200">
                    <Activity className="w-3 h-3 mr-1" />
                    Activity
                  </Badge>
                )}
              </div>

              <Accordion type="multiple" className="space-y-2">
                {/* Tobacco Guidance */}
                {guidance.tobacco && (
                  <AccordionItem value="tobacco" className="border border-slate-200 rounded-lg px-4">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Cigarette className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium">Tobacco Cessation Support</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          Set a quit date and tell someone you trust
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          Reduce triggers (after meals, stress moments)
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          Keep your hands busy with healthy alternatives
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          Ask at your nearest JAK about quit programs
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Alcohol Guidance */}
                {guidance.alcohol && (
                  <AccordionItem value="alcohol" className="border border-slate-200 rounded-lg px-4">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Wine className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium">Alcohol Reduction Support</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          Track how often you drink each week
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          Plan alcohol-free days and stick to them
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          Choose smaller portions when you do drink
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          Seek de-addiction support if cutting down is difficult
                        </li>
                      </ul>
                      <Alert className="bg-sky-50 border-sky-200 mt-3">
                        <Lightbulb className="h-4 w-4 text-sky-600" />
                        <AlertDescription className="text-sky-800 text-sm">
                          Professional support is available if you find it difficult to reduce on your own.
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Activity Guidance */}
                {guidance.activity && (
                  <AccordionItem value="activity" className="border border-slate-200 rounded-lg px-4">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium">Activity Plan</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-slate-900">Starter plan:</p>
                        <div className="space-y-2 text-sm text-slate-700">
                          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <Badge variant="outline" className="text-xs">Week 1</Badge>
                            <span>10 minutes walking per day, 5 days/week</span>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <Badge variant="outline" className="text-xs">Week 2</Badge>
                            <span>15 minutes walking per day, 5 days/week</span>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <Badge variant="outline" className="text-xs">Week 3+</Badge>
                            <span>Build toward 150 minutes/week total</span>
                          </div>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-lg">
                          <p className="text-sm text-emerald-800">
                            <strong>Add strength:</strong> Try simple bodyweight exercises 
                            (squats, wall push-ups) 2 days/week for added benefit.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Healthy habits message when no triggers */}
        {!hasAnyLifestyleTrigger && (
          <Card className="bg-emerald-50 border border-emerald-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">You&apos;re on a good track!</p>
                  <p className="text-sm text-emerald-800 mt-1">
                    Keep up your healthy habits with regular physical activity, balanced diet, 
                    regular check-ups, and stress management.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diet & Activity Tips */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Personalised Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Accordion type="multiple" className="space-y-2">
              <AccordionItem value="diet" className="border border-slate-200 rounded-lg px-4">
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
                      <p className="text-sm font-medium text-slate-700 mt-4 mb-2">For blood sugar:</p>
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

              <AccordionItem value="exercise" className="border border-slate-200 rounded-lg px-4">
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
                  Generate a beautifully formatted PDF with all your assessment results.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900">Your PDF will include:</p>
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
                    The PDF will be saved on your device only. We don&apos;t store or see it.
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

          <div className="flex gap-3">
            <Link href="/assessment/step-3" className="flex-1">
              <Button variant="outline" size="lg" className="w-full gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              className="flex-1 gap-2"
              onClick={handleRestart}
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
