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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, getStatusType } from "@/components/status-badge";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  AlertCircle,
  AlertTriangle,
  Scale,
  Ruler,
  HeartPulse,
  Droplet,
} from "lucide-react";
import {
  useAssessment,
  SugarType,
  isBPElevated,
  isSugarElevated,
  getBPStatus,
  getSugarStatus,
} from "@/lib/assessment-context";
import Link from "next/link";

export default function Step2Page() {
  const router = useRouter();
  const { data, updateData, calculateBMI, getBMICategory } = useAssessment();

  // Form state
  const [height, setHeight] = useState<string>(data.height?.toString() || "");
  const [weight, setWeight] = useState<string>(data.weight?.toString() || "");
  const [systolic, setSystolic] = useState<string>(
    data.systolic?.toString() || ""
  );
  const [diastolic, setDiastolic] = useState<string>(
    data.diastolic?.toString() || ""
  );
  const [sugarType, setSugarType] = useState<SugarType | null>(data.sugarType);
  const [sugarValue, setSugarValue] = useState<string>(
    data.sugarValue?.toString() || ""
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Computed BMI
  const bmi = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return null;
    const heightM = h / 100;
    return Math.round((w / (heightM * heightM)) * 10) / 10;
  }, [height, weight]);

  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  // BP status
  const bpStatus = useMemo(() => {
    const sys = parseFloat(systolic);
    const dia = parseFloat(diastolic);
    if (!sys || !dia) return null;
    return getBPStatus(sys, dia);
  }, [systolic, diastolic]);

  // Sugar status
  const sugarStatus = useMemo(() => {
    const val = parseFloat(sugarValue);
    if (!sugarType || !val) return null;
    return getSugarStatus(sugarType, val);
  }, [sugarType, sugarValue]);

  // Check if we should block
  const shouldBlock = useMemo(() => {
    const sys = parseFloat(systolic);
    const dia = parseFloat(diastolic);
    const sugar = parseFloat(sugarValue);

    const bpHigh = isBPElevated(sys || null, dia || null);
    const sugarHigh = isSugarElevated(sugarType, sugar || null);

    return bpHigh || sugarHigh;
  }, [systolic, diastolic, sugarType, sugarValue]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!height) {
      newErrors.height = "Please enter your height";
    } else {
      const h = parseFloat(height);
      if (isNaN(h) || h < 50 || h > 300) {
        newErrors.height = "Please enter a valid height (50-300 cm)";
      }
    }

    if (!weight) {
      newErrors.weight = "Please enter your weight";
    } else {
      const w = parseFloat(weight);
      if (isNaN(w) || w < 10 || w > 500) {
        newErrors.weight = "Please enter a valid weight (10-500 kg)";
      }
    }

    // BP validation (optional, but if one is entered, both are needed)
    if (systolic || diastolic) {
      if (!systolic) newErrors.systolic = "Please enter systolic pressure";
      if (!diastolic) newErrors.diastolic = "Please enter diastolic pressure";
    }

    // Sugar validation (optional, but if type is selected, value is needed)
    if (sugarType && !sugarValue) {
      newErrors.sugarValue = "Please enter blood sugar value";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;

    const sys = parseFloat(systolic) || null;
    const dia = parseFloat(diastolic) || null;
    const sugar = parseFloat(sugarValue) || null;

    updateData({
      height: parseFloat(height),
      weight: parseFloat(weight),
      systolic: sys,
      diastolic: dia,
      sugarType,
      sugarValue: sugar,
      bpEntered: !!(sys && dia),
      sugarEntered: !!(sugarType && sugar),
      bpElevated: isBPElevated(sys, dia),
      sugarElevated: isSugarElevated(sugarType, sugar),
    });

    if (shouldBlock) {
      router.push("/assessment/step-2/advisory");
    } else {
      router.push("/assessment/step-3");
    }
  };

  const clearBP = () => {
    setSystolic("");
    setDiastolic("");
  };

  const clearSugar = () => {
    setSugarType(null);
    setSugarValue("");
  };

  return (
    <AppShell currentStep={2} totalSteps={6}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Body measurements & vitals
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            We&apos;ll calculate your BMI and check your readings.
          </p>
        </div>

        {/* Card 1: Height & Weight */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              Body measurements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">
                  Height (cm) <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="height"
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g., 165"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className={errors.height ? "border-rose-500" : ""}
                />
                {errors.height && (
                  <p className="text-xs text-rose-600">{errors.height}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">
                  Weight (kg) <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="weight"
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g., 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className={errors.weight ? "border-rose-500" : ""}
                />
                {errors.weight && (
                  <p className="text-xs text-rose-600">{errors.weight}</p>
                )}
              </div>
            </div>

            {/* BMI Result */}
            {bmi && bmiCategory && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Your BMI</span>
                  <StatusBadge
                    status={getStatusType(bmiCategory.color)}
                    label={bmiCategory.label}
                  />
                </div>
                <p className="text-3xl font-semibold tabular-nums text-slate-900">
                  {bmi}
                </p>
                <p className="text-xs text-slate-500">
                  BMI is a screening measure and doesn&apos;t diagnose illness.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 2: Blood Pressure */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-emerald-600" />
                Blood pressure
              </CardTitle>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                Optional
              </span>
            </div>
            <CardDescription>
              If you know your recent BP reading
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="systolic">Systolic (mmHg)</Label>
                <Input
                  id="systolic"
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g., 120"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  className={errors.systolic ? "border-rose-500" : ""}
                />
                {errors.systolic && (
                  <p className="text-xs text-rose-600">{errors.systolic}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                <Input
                  id="diastolic"
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g., 80"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  className={errors.diastolic ? "border-rose-500" : ""}
                />
                {errors.diastolic && (
                  <p className="text-xs text-rose-600">{errors.diastolic}</p>
                )}
              </div>
            </div>

            {bpStatus && (
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <span className="text-sm text-slate-700">Your BP reading</span>
                <StatusBadge
                  status={getStatusType(bpStatus.color)}
                  label={bpStatus.label}
                />
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={clearBP}
              className="text-slate-600"
            >
              I don&apos;t know my BP
            </Button>
          </CardContent>
        </Card>

        {/* Card 3: Blood Sugar */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Droplet className="w-5 h-5 text-emerald-600" />
                Blood sugar
              </CardTitle>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                Optional
              </span>
            </div>
            <CardDescription>
              If you know your recent blood sugar reading
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Test type</Label>
              <Select
                value={sugarType || ""}
                onValueChange={(v) => setSugarType(v as SugarType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rbs">Random Blood Sugar (RBS)</SelectItem>
                  <SelectItem value="fbs">Fasting Blood Sugar (FBS)</SelectItem>
                  <SelectItem value="ppbs">
                    Post-Prandial Blood Sugar (PPBS)
                  </SelectItem>
                  <SelectItem value="hba1c">HbA1c</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sugarType && (
              <div className="space-y-2">
                <Label htmlFor="sugarValue">
                  Value ({sugarType === "hba1c" ? "%" : "mg/dL"})
                </Label>
                <Input
                  id="sugarValue"
                  type="number"
                  inputMode="decimal"
                  placeholder={
                    sugarType === "hba1c" ? "e.g., 5.7" : "e.g., 100"
                  }
                  value={sugarValue}
                  onChange={(e) => setSugarValue(e.target.value)}
                  className={errors.sugarValue ? "border-rose-500" : ""}
                />
                {errors.sugarValue && (
                  <p className="text-xs text-rose-600">{errors.sugarValue}</p>
                )}
              </div>
            )}

            {sugarStatus && (
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <span className="text-sm text-slate-700">Your blood sugar</span>
                <StatusBadge
                  status={getStatusType(sugarStatus.color)}
                  label={sugarStatus.label}
                />
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={clearSugar}
              className="text-slate-600"
            >
              I don&apos;t know my blood sugar
            </Button>
          </CardContent>
        </Card>

        {/* Warning if elevated */}
        {shouldBlock && (
          <Alert className="bg-rose-50 border-rose-200">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <AlertTitle className="text-rose-900 font-semibold">
              Elevated reading detected
            </AlertTitle>
            <AlertDescription className="text-rose-800">
              Your blood pressure or blood sugar is higher than normal. On the
              next screen, we&apos;ll provide guidance on next steps.
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-3 pt-4">
          <Link href="/assessment/step-1">
            <Button variant="outline" className="gap-1">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <Button
            onClick={handleNext}
            className="gap-1 bg-emerald-600 hover:bg-emerald-700"
            disabled={!height || !weight}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
