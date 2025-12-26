"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { DisclaimerAlert } from "@/components/disclaimer-alert";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  AlertTriangle,
  Cigarette,
  Wine,
  Ruler,
  Users,
  HelpCircle,
} from "lucide-react";
import {
  useAssessment,
  TobaccoUse,
  AlcoholUse,
  WaistReference,
  WAIST_THRESHOLDS,
} from "@/lib/assessment-context";
import Link from "next/link";

export default function Step3Page() {
  const router = useRouter();
  const { data, updateData, calculateCBACScore } = useAssessment();

  const [tobaccoUse, setTobaccoUse] = useState<TobaccoUse | null>(
    data.tobaccoUse
  );
  const [alcoholUse, setAlcoholUse] = useState<AlcoholUse | null>(
    data.alcoholUse
  );
  const [waistCircumference, setWaistCircumference] = useState<string>(
    data.waistCircumference?.toString() || ""
  );
  const [waistReference, setWaistReference] = useState<WaistReference | null>(
    data.waistReference ||
      (data.gender === "male"
        ? "male"
        : data.gender === "female"
          ? "female"
          : null)
  );
  const [familyHistory, setFamilyHistory] = useState<boolean | null>(
    data.familyHistory
  );

  // Calculate score in real-time
  const currentScore = useMemo(() => {
    let score = 0;

    // Age band
    const age = data.age || 0;
    if (age >= 60) score += 4;
    else if (age >= 50) score += 3;
    else if (age >= 40) score += 2;
    else if (age >= 30) score += 1;

    // Tobacco
    if (tobaccoUse === "daily") score += 2;
    else if (tobaccoUse === "past") score += 1;

    // Alcohol
    if (alcoholUse === "yes") score += 1;

    // Waist circumference
    const waist = parseFloat(waistCircumference);
    if (waist && waistReference) {
      const thresholds = WAIST_THRESHOLDS[waistReference];
      if (waist > thresholds.high) score += 2;
      else if (waist > thresholds.low) score += 1;
    }

    // Physical activity (from step 1)
    if (
      data.activityLevel === "sedentary" ||
      data.activityLevel === "moderate"
    ) {
      score += 1;
    }

    // Family history
    if (familyHistory) score += 2;

    return score;
  }, [
    data.age,
    data.activityLevel,
    tobaccoUse,
    alcoholUse,
    waistCircumference,
    waistReference,
    familyHistory,
  ]);

  const isHighRisk = currentScore > 4;

  const handleNext = () => {
    updateData({
      tobaccoUse,
      alcoholUse,
      waistCircumference: parseFloat(waistCircumference) || null,
      waistReference,
      familyHistory,
    });

    router.push("/assessment/step-4");
  };

  const waistThreshold = waistReference
    ? WAIST_THRESHOLDS[waistReference]
    : null;

  return (
    <AppShell currentStep={3} totalSteps={6}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            NCD Risk Check
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            This checklist estimates risk. It does not diagnose disease.
          </p>
        </div>

        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Risk factors
            </CardTitle>
            <CardDescription>
              Answer these questions to calculate your CBAC score
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tobacco Use */}
            <div className="rounded-lg border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Cigarette className="w-5 h-5 text-slate-600" />
                <Label className="text-sm font-medium">
                  Do you use tobacco?
                </Label>
              </div>
              <RadioGroup
                value={tobaccoUse || ""}
                onValueChange={(v) => setTobaccoUse(v as TobaccoUse)}
                className="space-y-2"
              >
                {[
                  { value: "never", label: "Never used", score: 0 },
                  {
                    value: "past",
                    label: "Used in past / occasionally",
                    score: 1,
                  },
                  { value: "daily", label: "Use daily", score: 2 },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between gap-3 rounded-md border p-3 cursor-pointer transition-colors min-h-11 ${
                      tobaccoUse === option.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={option.value} />
                      <span className="text-sm text-slate-900">
                        {option.label}
                      </span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Alcohol Use */}
            <div className="rounded-lg border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Wine className="w-5 h-5 text-slate-600" />
                <Label className="text-sm font-medium">
                  Do you consume alcohol daily?
                </Label>
              </div>
              <RadioGroup
                value={alcoholUse || ""}
                onValueChange={(v) => setAlcoholUse(v as AlcoholUse)}
                className="space-y-2"
              >
                {[
                  { value: "no", label: "No", score: 0 },
                  { value: "yes", label: "Yes", score: 1 },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between gap-3 rounded-md border p-3 cursor-pointer transition-colors min-h-11 ${
                      alcoholUse === option.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={option.value} />
                      <span className="text-sm text-slate-900">
                        {option.label}
                      </span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Waist Circumference */}
            <div className="rounded-lg border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-slate-600" />
                  <Label className="text-sm font-medium">
                    Waist circumference
                  </Label>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-600 gap-1"
                    >
                      <HelpCircle className="w-4 h-4" />
                      How to measure
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        How to measure waist circumference
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 text-sm text-slate-700">
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Stand upright and breathe normally</li>
                        <li>
                          Find the midpoint between the top of your hip bone and
                          the bottom of your ribs
                        </li>
                        <li>Wrap a measuring tape around this point</li>
                        <li>The tape should be snug but not tight</li>
                        <li>
                          Read the measurement after breathing out normally
                        </li>
                      </ol>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="font-medium mb-2">
                          Reference thresholds:
                        </p>
                        <p>
                          <strong>Female:</strong> Normal ≤80 cm, Elevated 81-90
                          cm, High &gt;90 cm
                        </p>
                        <p>
                          <strong>Male:</strong> Normal ≤90 cm, Elevated 91-100
                          cm, High &gt;100 cm
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {data.gender === "other" && (
                <div className="space-y-2">
                  <Label className="text-xs text-slate-600">
                    Choose reference chart for waist scoring
                  </Label>
                  <Select
                    value={waistReference || ""}
                    onValueChange={(v) =>
                      setWaistReference(v as WaistReference)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">
                        Use female thresholds
                      </SelectItem>
                      <SelectItem value="male">Use male thresholds</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    We ask this only to calculate the checklist score.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="Enter waist circumference in cm"
                  value={waistCircumference}
                  onChange={(e) => setWaistCircumference(e.target.value)}
                />
                {waistThreshold && (
                  <p className="text-xs text-slate-500">
                    Thresholds: Normal ≤{waistThreshold.low} cm, Elevated{" "}
                    {waistThreshold.low + 1}-{waistThreshold.high} cm, High &gt;
                    {waistThreshold.high} cm
                  </p>
                )}
              </div>
            </div>

            {/* Family History */}
            <div className="rounded-lg border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" />
                <Label className="text-sm font-medium">
                  Family history of diabetes, hypertension, or heart disease?
                </Label>
              </div>
              <RadioGroup
                value={
                  familyHistory === null ? "" : familyHistory ? "yes" : "no"
                }
                onValueChange={(v) => setFamilyHistory(v === "yes")}
                className="space-y-2"
              >
                {[
                  { value: "no", label: "No", score: 0 },
                  { value: "yes", label: "Yes", score: 2 },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between gap-3 rounded-md border p-3 cursor-pointer transition-colors min-h-11 ${
                      (familyHistory === true && option.value === "yes") ||
                      (familyHistory === false && option.value === "no")
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={option.value} />
                      <span className="text-sm text-slate-900">
                        {option.label}
                      </span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Score Preview */}
        <Card
          className={`border ${isHighRisk ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"}`}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Your CBAC Score</p>
                <p className="text-3xl font-semibold tabular-nums text-slate-900">
                  {currentScore}
                </p>
              </div>
              <StatusBadge
                status={isHighRisk ? "elevated" : "normal"}
                label={isHighRisk ? "Higher risk" : "Lower risk"}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {isHighRisk
                ? "Score > 4 indicates higher NCD risk. Please consult a doctor for evaluation."
                : "Score ≤ 4 indicates lower risk. Continue with healthy habits."}
            </p>
          </CardContent>
        </Card>

        {isHighRisk && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-900 font-semibold">
              Higher risk detected
            </AlertTitle>
            <AlertDescription className="text-amber-800">
              <span>
                Your score suggests higher risk for diabetes or hypertension. We
                recommend visiting the nearest{" "}
                <strong>Janakeeya Arogya Kendram</strong> for further
                evaluation.
              </span>
            </AlertDescription>
          </Alert>
        )}

        <DisclaimerAlert />

        {/* Navigation */}
        <div className="flex justify-between gap-3 pt-4">
          <Link href="/assessment/step-2">
            <Button variant="outline" className="gap-1">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <Button
            onClick={handleNext}
            className="gap-1 bg-emerald-600 hover:bg-emerald-700"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
