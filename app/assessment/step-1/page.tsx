"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Info, AlertCircle } from "lucide-react";
import { useAssessment, Gender, ActivityLevel } from "@/lib/assessment-context";
import Link from "next/link";

export default function Step1Page() {
  const router = useRouter();
  const { data, updateData } = useAssessment();

  const [age, setAge] = useState<string>(data.age?.toString() || "");
  const [gender, setGender] = useState<Gender | null>(data.gender);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(data.activityLevel);
  const [errors, setErrors] = useState<{ age?: string }>({});
  const [showUnderageAlert, setShowUnderageAlert] = useState(false);

  useEffect(() => {
    const ageNum = parseInt(age);
    setShowUnderageAlert(ageNum > 0 && ageNum < 18);
  }, [age]);

  const validate = () => {
    const newErrors: { age?: string } = {};

    if (!age) {
      newErrors.age = "Please enter your age";
    } else {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        newErrors.age = "Please enter a valid age (1-120)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (!gender || !activityLevel) {
      // Optional fields - allow proceeding without them
    }

    updateData({
      age: parseInt(age),
      gender,
      activityLevel,
    });

    router.push("/assessment/step-2");
  };

  return (
    <AppShell currentStep={1} totalSteps={4}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">About you</h1>
          <p className="text-sm text-slate-600 mt-1">
            This helps us tailor your risk score and tips.
          </p>
        </div>

        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Basic Information</CardTitle>
            <CardDescription>All fields help us provide better guidance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Age */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="age" className="text-sm font-medium">
                  Age (completed years) <span className="text-rose-500">*</span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter your age in full years</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="age"
                type="number"
                inputMode="numeric"
                placeholder="e.g., 42"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={errors.age ? "border-rose-500" : ""}
                min={1}
                max={120}
              />
              {errors.age && (
                <p className="text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.age}
                </p>
              )}
              <p className="text-xs text-slate-500">Enter your age in full years.</p>
            </div>

            {showUnderageAlert && (
              <Alert className="bg-sky-50 border-sky-200">
                <Info className="h-4 w-4 text-sky-600" />
                <AlertDescription className="text-sm text-sky-800">
                  This tool is designed for adults. You can continue, but results may be less relevant.
                </AlertDescription>
              </Alert>
            )}

            {/* Gender */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Gender</Label>
              <RadioGroup
                value={gender || ""}
                onValueChange={(value) => setGender(value as Gender)}
                className="space-y-2"
              >
                {[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors min-h-11 ${
                      gender === option.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <span className="text-sm text-slate-900">{option.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Activity Level */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Physical activity level</Label>
              <RadioGroup
                value={activityLevel || ""}
                onValueChange={(value) => setActivityLevel(value as ActivityLevel)}
                className="space-y-2"
              >
                {[
                  { value: "sedentary", label: "Sedentary", description: "Very little activity" },
                  { value: "moderate", label: "Moderate", description: "Some activity, under 150 minutes/week" },
                  { value: "adequate", label: "Adequate", description: "150 minutes/week or more" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors min-h-11 ${
                      activityLevel === option.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-slate-900">{option.label}</span>
                      <p className="text-xs text-slate-500">{option.description}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-3 pt-6 border-t">
            <Link href="/">
              <Button variant="outline" className="gap-1">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <Button
              onClick={handleNext}
              className="gap-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={!age}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}



