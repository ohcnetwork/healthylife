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
import { StatusBadge } from "@/components/status-badge";
import { Footer } from "@/components/footer";
import {
  HeartPulse,
  Heart,
  ChevronLeft,
  Info,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

const BP_CATEGORIES = [
  {
    id: "normal",
    label: "Normal",
    systolicMax: 120,
    diastolicMax: 80,
    color: "emerald",
    status: "normal" as const,
    description:
      "Your blood pressure is within the healthy range. Keep up the healthy lifestyle!",
    tips: [
      "Maintain a balanced diet",
      "Stay physically active",
      "Continue regular check-ups",
      "If on treatment continue medication as prescribed",
    ],
  },
  {
    id: "elevated",
    label: "Elevated",
    systolicMax: 130,
    diastolicMax: 80,
    color: "amber",
    status: "elevated" as const,
    description:
      "Your blood pressure is slightly elevated. Lifestyle changes may help.",
    tips: [
      "Reduce sodium intake",
      "Increase physical activity",
      "Manage stress levels",
    ],
  },
  {
    id: "high1",
    label: "High (Stage 1)",
    systolicMax: 140,
    diastolicMax: 90,
    color: "amber",
    status: "elevated" as const,
    description:
      "Your blood pressure is high. Consider consulting a healthcare provider.",
    tips: [
      "Consult a doctor",
      "Monitor BP regularly",
      "Consider medication if advised",
    ],
  },
  {
    id: "high2",
    label: "High (Stage 2)",
    systolicMax: 180,
    diastolicMax: 120,
    color: "rose",
    status: "high" as const,
    description:
      "Your blood pressure is significantly high. Please see a doctor soon.",
    tips: [
      "See a doctor promptly",
      "Follow prescribed treatment",
      "Monitor daily",
    ],
  },
  {
    id: "crisis",
    label: "Hypertensive Crisis",
    systolicMax: Infinity,
    diastolicMax: Infinity,
    color: "rose",
    status: "high" as const,
    description:
      "This is a medical emergency. Seek immediate medical attention!",
    tips: [
      "Seek emergency care immediately",
      "Do not wait",
      "Call emergency services if needed",
    ],
  },
];

export default function BPCheckerPage() {
  const [systolic, setSystolic] = useState<string>("");
  const [diastolic, setDiastolic] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    if (!sys || !dia || sys <= 0 || dia <= 0) return null;

    // Crisis
    if (sys > 180 || dia > 120) return BP_CATEGORIES[4];
    // High Stage 2
    if (sys >= 140 || dia >= 90) return BP_CATEGORIES[3];
    // High Stage 1
    if (sys >= 130 || dia >= 80) return BP_CATEGORIES[2];
    // Elevated
    if (sys >= 120 && dia < 80) return BP_CATEGORIES[1];
    // Normal
    return BP_CATEGORIES[0];
  }, [systolic, diastolic]);

  const handleCheck = () => {
    if (result) setShowResult(true);
  };

  const handleReset = () => {
    setSystolic("");
    setDiastolic("");
    setShowResult(false);
  };

  const isCrisis = result?.id === "crisis";

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-slate-50">
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
              className="bg-rose-100 text-rose-700 border-rose-200"
            >
              <HeartPulse className="w-3 h-3 mr-1" />
              BP Tool
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/30">
              <HeartPulse className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              Blood Pressure Interpreter
            </h1>
            <p className="text-slate-600">
              Understand what your BP reading means
            </p>
          </div>

          {/* Input Card */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-600" />
                Enter your BP reading
              </CardTitle>
              <CardDescription>
                Enter the numbers shown on your BP monitor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systolic">Systolic (top number)</Label>
                  <Input
                    id="systolic"
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g., 120"
                    value={systolic}
                    onChange={(e) => {
                      setSystolic(e.target.value);
                      setShowResult(false);
                    }}
                    className="text-lg text-center"
                  />
                  <p className="text-xs text-slate-500 text-center">mmHg</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolic">Diastolic (bottom number)</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g., 80"
                    value={diastolic}
                    onChange={(e) => {
                      setDiastolic(e.target.value);
                      setShowResult(false);
                    }}
                    className="text-lg text-center"
                  />
                  <p className="text-xs text-slate-500 text-center">mmHg</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCheck}
                  disabled={!result}
                  className="flex-1 bg-rose-600 hover:bg-rose-700"
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
                    <p className="text-sm text-slate-600 mb-1">Your Reading</p>
                    <p className="text-4xl font-bold tabular-nums text-slate-900">
                      {systolic}/{diastolic}
                      <span className="text-lg font-normal text-slate-500 ml-2">
                        mmHg
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

                  {isCrisis && (
                    <Alert className="bg-rose-100 border-rose-300 text-left">
                      <AlertTriangle className="h-5 w-5 text-rose-600" />
                      <AlertTitle className="text-rose-900 font-semibold">
                        Seek Immediate Medical Attention
                      </AlertTitle>
                      <AlertDescription className="text-rose-800">
                        A reading this high requires emergency care. Please go
                        to the nearest hospital or call emergency services
                        immediately.
                      </AlertDescription>
                    </Alert>
                  )}

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

          {/* BP Categories Reference */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">
                Blood Pressure Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 text-xs text-slate-500 pb-2 border-b">
                  <span>Category</span>
                  <span className="text-center">Systolic</span>
                  <span className="text-center">Diastolic</span>
                </div>
                {BP_CATEGORIES.slice(0, 4).map((cat, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-3 items-center py-2 rounded-lg ${
                      showResult && result?.id === cat.id
                        ? "bg-slate-100 ring-1 ring-slate-300"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          cat.color === "emerald"
                            ? "bg-emerald-500"
                            : cat.color === "amber"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                        }`}
                      />
                      <span className="text-slate-700">{cat.label}</span>
                    </div>
                    <span className="text-slate-500 text-center">
                      {i === 0
                        ? `< ${cat.systolicMax}`
                        : `${BP_CATEGORIES[i - 1].systolicMax}-${cat.systolicMax - 1}`}
                    </span>
                    <span className="text-slate-500 text-center">
                      {i === 0
                        ? `< ${cat.diastolicMax}`
                        : i === 1
                          ? `< ${cat.diastolicMax}`
                          : `${BP_CATEGORIES[i - 1].diastolicMax}-${cat.diastolicMax - 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info Alert */}
          <Alert className="bg-slate-100 border-slate-200">
            <Info className="h-4 w-4 text-slate-600" />
            <AlertTitle className="text-slate-800">
              Tips for accurate readings
            </AlertTitle>
            <AlertDescription className="text-slate-600">
              Ensure the person has not exercised, had tea/coffee, or used
              tobacco in the last 30 minutes Person should rest comfortably and
              quietly for 5 minutes before the reading.
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
