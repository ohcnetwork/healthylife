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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { Footer } from "@/components/footer";
import {
  Droplet,
  Heart,
  ChevronLeft,
  Info,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

type SugarType = "fbs" | "rbs" | "hba1c";

const SUGAR_TESTS = [
  {
    value: "fbs",
    label: "Fasting Blood Sugar (FBS)",
    unit: "mg/dL",
    description: "Measured after 8+ hours of fasting",
  },
  {
    value: "rbs",
    label: "Random Blood Sugar (RBS)",
    unit: "mg/dL",
    description: "Measured at any time of day",
  },
  {
    value: "hba1c",
    label: "HbA1c",
    unit: "%",
    description: "Average blood sugar over 2-3 months",
  },
];

const SUGAR_THRESHOLDS = {
  fbs: { normal: 100, prediabetes: 126 },
  rbs: { normal: 140, prediabetes: 200 },
  hba1c: { normal: 5.7, prediabetes: 6.5 },
};

const getResult = (type: SugarType, value: number) => {
  const thresholds = SUGAR_THRESHOLDS[type];

  if (value < thresholds.normal) {
    return {
      status: "normal" as const,
      label: "Normal",
      color: "emerald",
      description: "Your blood sugar is within the healthy range.",
      tips: [
        "Maintain a balanced diet",
        "Stay physically active",
        "Continue regular check-ups",
      ],
    };
  } else if (value < thresholds.prediabetes) {
    return {
      status: "elevated" as const,
      label: "Pre-diabetes Range",
      color: "amber",
      description:
        "Your blood sugar is higher than normal. Lifestyle changes can help prevent diabetes.",
      tips: [
        "Reduce sugar and refined carbs",
        "Increase physical activity",
        "Monitor blood sugar regularly",
        "Consult a healthcare provider",
      ],
    };
  } else {
    return {
      status: "high" as const,
      label: "Diabetes Range",
      color: "rose",
      description:
        "Your blood sugar is in the diabetes range. Please consult a doctor for proper diagnosis.",
      tips: [
        "Consult a doctor for diagnosis",
        "Get additional tests done",
        "Follow prescribed treatment",
        "Monitor blood sugar regularly",
      ],
    };
  }
};

export default function SugarCheckerPage() {
  const [testType, setTestType] = useState<SugarType | "">("");
  const [value, setValue] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  const selectedTest = SUGAR_TESTS.find((t) => t.value === testType);

  const result = useMemo(() => {
    if (!testType || !value) return null;
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return null;
    return getResult(testType as SugarType, numValue);
  }, [testType, value]);

  const handleCheck = () => {
    if (result) setShowResult(true);
  };

  const handleReset = () => {
    setTestType("");
    setValue("");
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-slate-50">
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
              className="bg-amber-100 text-amber-700 border-amber-200"
            >
              <Droplet className="w-3 h-3 mr-1" />
              Sugar Tool
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
              <Droplet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              Blood Sugar Interpreter
            </h1>
            <p className="text-slate-600">
              Understand what your blood sugar reading means
            </p>
          </div>

          {/* Input Card */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Droplet className="w-5 h-5 text-amber-600" />
                Enter your reading
              </CardTitle>
              <CardDescription>
                Select the test type and enter your value
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Test Type</Label>
                <Select
                  value={testType}
                  onValueChange={(v) => {
                    setTestType(v as SugarType);
                    setShowResult(false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUGAR_TESTS.map((test) => (
                      <SelectItem key={test.value} value={test.value}>
                        <div>
                          <span>{test.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTest && (
                  <p className="text-xs text-slate-500">
                    {selectedTest.description}
                  </p>
                )}
              </div>

              {testType && (
                <div className="space-y-2">
                  <Label htmlFor="value">Value ({selectedTest?.unit})</Label>
                  <Input
                    id="value"
                    type="number"
                    inputMode="decimal"
                    placeholder={
                      testType === "hba1c" ? "e.g., 5.6" : "e.g., 100"
                    }
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setShowResult(false);
                    }}
                    className="text-lg"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleCheck}
                  disabled={!result}
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                >
                  Check Reading
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
          {showResult && result && (
            <Card
              className={`border-2 ${
                result.color === "emerald"
                  ? "border-emerald-200 bg-emerald-50"
                  : result.color === "amber"
                    ? "border-amber-200 bg-amber-50"
                    : "border-rose-200 bg-rose-50"
              }`}
            >
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">
                      Your {selectedTest?.label}
                    </p>
                    <p className="text-4xl font-bold tabular-nums text-slate-900">
                      {value}
                      <span className="text-lg font-normal text-slate-500 ml-2">
                        {selectedTest?.unit}
                      </span>
                    </p>
                  </div>
                  <StatusBadge
                    status={result.status}
                    label={result.label}
                    className="text-base px-4 py-1"
                  />
                  <p className="text-sm text-slate-700 max-w-sm mx-auto">
                    {result.description}
                  </p>

                  <div className="text-left bg-white/50 rounded-lg p-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      Recommendations:
                    </p>
                    <ul className="space-y-1">
                      {result.tips.map((tip, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <CheckCircle2
                            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              result.color === "emerald"
                                ? "text-emerald-600"
                                : result.color === "amber"
                                  ? "text-amber-600"
                                  : "text-rose-600"
                            }`}
                          />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reference Table */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">
                Blood Sugar Reference Ranges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SUGAR_TESTS.map((test) => {
                  const thresholds = SUGAR_THRESHOLDS[test.value as SugarType];
                  return (
                    <div
                      key={test.value}
                      className={`p-3 rounded-lg ${
                        testType === test.value
                          ? "bg-amber-50 ring-1 ring-amber-200"
                          : "bg-slate-50"
                      }`}
                    >
                      <p className="font-medium text-slate-800 text-sm mb-2">
                        {test.label}
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-slate-600">
                            Normal: &lt;{thresholds.normal}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-slate-600">
                            Pre: {thresholds.normal}-
                            {thresholds.prediabetes -
                              (test.value === "hba1c" ? 0.1 : 1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-rose-500" />
                          <span className="text-slate-600">
                            High: ≥{thresholds.prediabetes}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Info Alert */}
          <Alert className="bg-slate-100 border-slate-200">
            <Info className="h-4 w-4 text-slate-600" />
            <AlertTitle className="text-slate-800">Important Note</AlertTitle>
            <AlertDescription className="text-slate-600">
              A single reading isn&apos;t enough for diagnosis. Diabetes is
              typically confirmed with two separate tests. Always consult a
              healthcare provider for proper diagnosis and treatment.
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
