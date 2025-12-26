"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart,
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Info,
  RefreshCw,
  ArrowRight,
  Ribbon
} from "lucide-react";

const GENERAL_SYMPTOMS = [
  { id: "non_healing_ulcer", label: "Non-healing ulcer (wound that doesn't heal for more than 2 weeks)" },
  { id: "lumps", label: "Lumps or swellings anywhere in the body" },
  { id: "difficulty_swallowing", label: "Difficulty swallowing" },
  { id: "voice_change", label: "Change in voice (hoarseness lasting more than 2 weeks)" },
  { id: "weight_loss", label: "Unexplained weight loss" },
  { id: "blood_sputum", label: "Blood in sputum (coughed-up mucus)" },
  { id: "persistent_cough", label: "Persistent cough (more than 2 weeks)" },
];

const WOMEN_SYMPTOMS = [
  { id: "breast_lump", label: "Lump in the breast" },
  { id: "nipple_discharge", label: "Nipple discharge (other than breast milk)" },
  { id: "breast_shape", label: "Change in breast shape or size" },
  { id: "postmenopausal_bleeding", label: "Bleeding after menopause" },
  { id: "bleeding_intercourse", label: "Bleeding after intercourse" },
];

export default function CancerScreeningPage() {
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [generalSymptoms, setGeneralSymptoms] = useState<Record<string, boolean>>({});
  const [womenSymptoms, setWomenSymptoms] = useState<Record<string, boolean>>({});
  const [showResult, setShowResult] = useState(false);

  const showWomenSection = gender === "female";

  const hasAnySymptom = 
    Object.values(generalSymptoms).some(v => v) || 
    Object.values(womenSymptoms).some(v => v);

  const allQuestionsAnswered = 
    gender !== null &&
    GENERAL_SYMPTOMS.every(s => generalSymptoms[s.id] !== undefined) &&
    (!showWomenSection || WOMEN_SYMPTOMS.every(s => womenSymptoms[s.id] !== undefined));

  const handleSymptomChange = (
    id: string, 
    value: boolean, 
    isWomen: boolean = false
  ) => {
    if (isWomen) {
      setWomenSymptoms(prev => ({ ...prev, [id]: value }));
    } else {
      setGeneralSymptoms(prev => ({ ...prev, [id]: value }));
    }
    setShowResult(false);
  };

  const handleCheck = () => {
    setShowResult(true);
  };

  const handleReset = () => {
    setGender(null);
    setGeneralSymptoms({});
    setWomenSymptoms({});
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-slate-50">
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
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
              <Ribbon className="w-3 h-3 mr-1" />
              Screening Tool
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>

        <div className="space-y-6">
          {/* Hero */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
              <Ribbon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              Cancer Symptom Checker
            </h1>
            <p className="text-slate-600">
              Early detection saves lives. Answer honestly — this is for your awareness.
            </p>
          </div>

          {/* Gender Selection */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">First, tell us your gender</CardTitle>
              <CardDescription>
                This helps us ask the right questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setGender("male");
                    setWomenSymptoms({});
                    setShowResult(false);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    gender === "male"
                      ? "border-purple-500 bg-purple-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="text-2xl mb-2 block">👨</span>
                  <span className={`font-medium ${gender === "male" ? "text-purple-700" : "text-slate-700"}`}>
                    Male
                  </span>
                </button>
                <button
                  onClick={() => {
                    setGender("female");
                    setShowResult(false);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    gender === "female"
                      ? "border-purple-500 bg-purple-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="text-2xl mb-2 block">👩</span>
                  <span className={`font-medium ${gender === "female" ? "text-purple-700" : "text-slate-700"}`}>
                    Female
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Symptoms Section */}
          {gender && (
            <>
              {/* General Symptoms */}
              <Card className="bg-white border-slate-200 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-purple-600" />
                    General symptoms
                  </CardTitle>
                  <CardDescription>
                    Have you experienced any of these in the past few months?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {GENERAL_SYMPTOMS.map((symptom) => (
                    <div
                      key={symptom.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
                    >
                      <Label className="text-sm text-slate-700 flex-1 cursor-pointer">
                        {symptom.label}
                      </Label>
                      <RadioGroup
                        value={generalSymptoms[symptom.id] === true ? "yes" : generalSymptoms[symptom.id] === false ? "no" : ""}
                        onValueChange={(v) => handleSymptomChange(symptom.id, v === "yes")}
                        className="flex gap-2"
                      >
                        <label
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border cursor-pointer text-sm transition-colors ${
                            generalSymptoms[symptom.id] === true
                              ? "bg-rose-50 border-rose-200 text-rose-800"
                              : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <RadioGroupItem value="yes" className="sr-only" />
                          Yes
                        </label>
                        <label
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border cursor-pointer text-sm transition-colors ${
                            generalSymptoms[symptom.id] === false
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                              : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <RadioGroupItem value="no" className="sr-only" />
                          No
                        </label>
                      </RadioGroup>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Women-specific Symptoms */}
              {showWomenSection && (
                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Ribbon className="w-5 h-5 text-pink-600" />
                      Women-specific symptoms
                    </CardTitle>
                    <CardDescription>
                      Additional symptoms to check
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {WOMEN_SYMPTOMS.map((symptom) => (
                      <div
                        key={symptom.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
                      >
                        <Label className="text-sm text-slate-700 flex-1 cursor-pointer">
                          {symptom.label}
                        </Label>
                        <RadioGroup
                          value={womenSymptoms[symptom.id] === true ? "yes" : womenSymptoms[symptom.id] === false ? "no" : ""}
                          onValueChange={(v) => handleSymptomChange(symptom.id, v === "yes", true)}
                          className="flex gap-2"
                        >
                          <label
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border cursor-pointer text-sm transition-colors ${
                              womenSymptoms[symptom.id] === true
                                ? "bg-rose-50 border-rose-200 text-rose-800"
                                : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <RadioGroupItem value="yes" className="sr-only" />
                            Yes
                          </label>
                          <label
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border cursor-pointer text-sm transition-colors ${
                              womenSymptoms[symptom.id] === false
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <RadioGroupItem value="no" className="sr-only" />
                            No
                          </label>
                        </RadioGroup>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Check Button */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleCheck}
                  disabled={!allQuestionsAnswered}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  Check Symptoms
                </Button>
                {showResult && (
                  <Button variant="outline" onClick={handleReset} size="lg">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Results */}
          {showResult && (
            <>
              {hasAnySymptom ? (
                <Alert className="bg-rose-50 border-rose-200">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                  <AlertTitle className="text-rose-900 font-semibold">Please consult a doctor</AlertTitle>
                  <AlertDescription className="text-rose-800">
                    <p className="mb-3">
                      You reported one or more symptoms that need medical evaluation. 
                      Please consult a doctor at the nearest health facility for further evaluation. 
                      Early detection can make a significant difference.
                    </p>
                    <Button className="bg-rose-600 hover:bg-rose-700 gap-2">
                      <Stethoscope className="w-4 h-4" />
                      Find nearby health facility
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : (
                <Card className="bg-emerald-50 border border-emerald-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-emerald-900 text-lg">No symptoms reported</p>
                        <p className="text-sm text-emerald-800 mt-1">
                          That&apos;s good news! Consider routine screening once every 5 years. 
                          If you notice new symptoms later, consult a health facility promptly.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Self-breast exam info for women */}
          {gender === "female" && (
            <Accordion type="single" collapsible className="bg-white border border-slate-200 rounded-lg shadow-lg">
              <AccordionItem value="breast-exam" className="border-0">
                <AccordionTrigger className="px-4 py-3 text-sm font-medium text-slate-900 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-pink-600" />
                    Self-breast examination guide
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-sm text-slate-700">
                  <div className="space-y-3">
                    <p className="font-medium">How to perform a self-breast examination:</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Stand in front of a mirror with shoulders straight and arms on hips</li>
                      <li>Look for any changes in size, shape, or color of breasts</li>
                      <li>Raise your arms and look for the same changes</li>
                      <li>While lying down, use your right hand to feel your left breast and vice versa</li>
                      <li>Use firm, smooth touches with finger pads in circular motions</li>
                      <li>Cover the entire breast from top to bottom, side to side</li>
                      <li>Feel your breasts while standing or sitting, such as in the shower</li>
                    </ol>
                    <Alert className="bg-pink-50 border-pink-200 mt-4">
                      <Info className="h-4 w-4 text-pink-600" />
                      <AlertDescription className="text-pink-800 text-sm">
                        Seek help if you find a new lump, thickening, or any change. 
                        Monthly self-exams help you know what&apos;s normal for your body.
                      </AlertDescription>
                    </Alert>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {/* Info Alert */}
          <Alert className="bg-slate-100 border-slate-200">
            <Info className="h-4 w-4 text-slate-600" />
            <AlertTitle className="text-slate-800">About this screening</AlertTitle>
            <AlertDescription className="text-slate-600">
              This tool helps identify potential warning signs that may need medical attention. 
              It is not a diagnosis. Many symptoms can have causes other than cancer. 
              Only a healthcare professional can provide a proper diagnosis.
            </AlertDescription>
          </Alert>

          <Separator />

          {/* CTA */}
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-0 text-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Want a complete health check?</h3>
                <p className="text-emerald-100 text-sm">
                  Take our full assessment for personalized NCD risk scores and guidance.
                </p>
                <Link href="/assessment/step-1">
                  <Button variant="secondary" className="bg-white text-emerald-700 hover:bg-emerald-50 gap-2">
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
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-xl mx-auto px-4 py-4">
          <p className="text-xs text-slate-500 text-center">
            This tool provides general information and is not a medical diagnosis.
            <br />
            © {new Date().getFullYear()} Healthy Life Campaign
          </p>
        </div>
      </footer>
    </div>
  );
}

