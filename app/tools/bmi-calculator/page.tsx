"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, getStatusType } from "@/components/status-badge";
import { Footer } from "@/components/footer";
import {
  Calculator,
  Heart,
  ChevronLeft,
  Info,
  Scale,
  Ruler,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

const BMI_CATEGORIES = [
  {
    max: 18.5,
    label: "Underweight",
    color: "sky",
    description:
      "You may need to gain some weight. Consider consulting a healthcare provider.",
  },
  {
    max: 25,
    label: "Normal",
    color: "emerald",
    description:
      "Great! Your weight is within the healthy range. Keep up the good habits!",
  },
  {
    max: 30,
    label: "Overweight",
    color: "amber",
    description:
      "You may benefit from lifestyle changes. Small steps can make a big difference.",
  },
  {
    max: Infinity,
    label: "Obese",
    color: "rose",
    description:
      "Consider consulting a healthcare provider for personalized guidance.",
  },
];

export default function BMICalculatorPage() {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  const bmi = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return null;
    const heightM = h / 100;
    return Math.round((w / (heightM * heightM)) * 10) / 10;
  }, [height, weight]);

  const category = useMemo(() => {
    if (!bmi) return null;
    return (
      BMI_CATEGORIES.find((c) => bmi < c.max) ||
      BMI_CATEGORIES[BMI_CATEGORIES.length - 1]
    );
  }, [bmi]);

  const handleCalculate = () => {
    if (bmi) setShowResult(true);
  };

  const handleReset = () => {
    setHeight("");
    setWeight("");
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Healthy Life
              </span>
            </Link>
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-700 border-emerald-200"
            >
              <Calculator className="w-3 h-3 mr-1" />
              BMI Tool
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>

        <div className="space-y-6">
          {/* Hero */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              BMI Calculator
            </h1>
            <p className="text-slate-600">
              Calculate your Body Mass Index instantly
            </p>
          </div>

          {/* Calculator Card */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600" />
                Enter your measurements
              </CardTitle>
              <CardDescription>
                We&apos;ll calculate your BMI and show what it means
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height" className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-slate-400" />
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    inputMode="decimal"
                    placeholder="e.g., 165"
                    value={height}
                    onChange={(e) => {
                      setHeight(e.target.value);
                      setShowResult(false);
                    }}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-slate-400" />
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    inputMode="decimal"
                    placeholder="e.g., 70"
                    value={weight}
                    onChange={(e) => {
                      setWeight(e.target.value);
                      setShowResult(false);
                    }}
                    className="text-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCalculate}
                  disabled={!bmi}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  Calculate BMI
                </Button>
                {showResult && (
                  <Button variant="outline" onClick={handleReset}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          {showResult && bmi && category && (
            <Card
              className={`border-2 ${
                category.color === "emerald"
                  ? "border-emerald-200 bg-emerald-50"
                  : category.color === "amber"
                    ? "border-amber-200 bg-amber-50"
                    : category.color === "rose"
                      ? "border-rose-200 bg-rose-50"
                      : "border-sky-200 bg-sky-50"
              }`}
            >
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Your BMI</p>
                    <p className="text-5xl font-bold tabular-nums text-slate-900">
                      {bmi}
                    </p>
                  </div>
                  <StatusBadge
                    status={getStatusType(category.color)}
                    label={category.label}
                    className="text-base px-4 py-1"
                  />
                  <p className="text-sm text-slate-700 max-w-sm mx-auto">
                    {category.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* BMI Scale Reference */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">
                BMI Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {BMI_CATEGORIES.map((cat, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      showResult && category?.label === cat.label
                        ? "ring-2 ring-offset-1 ring-slate-400"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          cat.color === "emerald"
                            ? "bg-emerald-500"
                            : cat.color === "amber"
                              ? "bg-amber-500"
                              : cat.color === "rose"
                                ? "bg-rose-500"
                                : "bg-sky-500"
                        }`}
                      />
                      <span className="text-sm text-slate-700">
                        {cat.label}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500">
                      {i === 0
                        ? `< ${cat.max}`
                        : i === BMI_CATEGORIES.length - 1
                          ? `≥ ${BMI_CATEGORIES[i - 1].max}`
                          : `${BMI_CATEGORIES[i - 1].max} - ${cat.max - 0.1}`}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info Alert */}
          <Alert className="bg-slate-100 border-slate-200">
            <Info className="h-4 w-4 text-slate-600" />
            <AlertTitle className="text-slate-800">About BMI</AlertTitle>
            <AlertDescription className="text-slate-600">
              BMI is a screening tool, not a diagnostic measure. It doesn&apos;t
              account for muscle mass, bone density, or overall body
              composition. For a complete health assessment, consult a
              healthcare provider.
            </AlertDescription>
          </Alert>

          <Separator />

          {/* CTA */}
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-0 text-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">
                  Want a complete health check?
                </h3>
                <p className="text-emerald-100 text-sm">
                  Take our full assessment for personalized risk scores and
                  guidance.
                </p>
                <Link href="/assessment/step-1">
                  <Button
                    variant="secondary"
                    className="bg-white text-emerald-700 hover:bg-emerald-50 gap-2"
                  >
                    Take Full Assessment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
