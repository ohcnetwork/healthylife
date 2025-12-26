"use client";

import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DisclaimerAlert } from "@/components/disclaimer-alert";
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useAssessment } from "@/lib/assessment-context";
import Link from "next/link";

const GENERAL_SYMPTOMS = [
  {
    id: "non_healing_ulcer",
    label: "Non-healing ulcer (wound that doesn't heal for more than 2 weeks)",
  },
  { id: "lumps", label: "Lumps or swellings anywhere in the body" },
  { id: "difficulty_swallowing", label: "Difficulty swallowing" },
  {
    id: "voice_change",
    label: "Change in voice (hoarseness lasting more than 2 weeks)",
  },
  { id: "weight_loss", label: "Unexplained weight loss" },
  { id: "blood_sputum", label: "Blood in sputum (coughed-up mucus)" },
  { id: "persistent_cough", label: "Persistent cough (more than 2 weeks)" },
];

const WOMEN_SYMPTOMS = [
  { id: "breast_lump", label: "Lump in the breast" },
  {
    id: "nipple_discharge",
    label: "Nipple discharge (other than breast milk)",
  },
  { id: "breast_shape", label: "Change in breast shape or size" },
  { id: "postmenopausal_bleeding", label: "Bleeding after menopause" },
  { id: "bleeding_intercourse", label: "Bleeding after intercourse" },
];

export default function Step5Page() {
  const router = useRouter();
  const { data, updateData } = useAssessment();

  const [generalSymptoms, setGeneralSymptoms] = useState<
    Record<string, boolean>
  >(data.generalSymptoms || {});
  const [womenSymptoms, setWomenSymptoms] = useState<Record<string, boolean>>(
    data.womenSymptoms || {}
  );

  const showWomenSection = data.gender === "female";

  const hasAnySymptom =
    Object.values(generalSymptoms).some((v) => v) ||
    Object.values(womenSymptoms).some((v) => v);

  const handleSymptomChange = (
    id: string,
    value: boolean,
    isWomen: boolean = false
  ) => {
    if (isWomen) {
      setWomenSymptoms((prev) => ({ ...prev, [id]: value }));
    } else {
      setGeneralSymptoms((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleNext = () => {
    updateData({
      generalSymptoms,
      womenSymptoms,
    });
    router.push("/assessment/step-4");
  };

  return (
    <AppShell currentStep={5} totalSteps={5}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Cancer symptom check
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Early detection helps. Answer honestly — this is for your awareness.
          </p>
        </div>

        {/* General Symptoms */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
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
                  value={
                    generalSymptoms[symptom.id] === true
                      ? "yes"
                      : generalSymptoms[symptom.id] === false
                        ? "no"
                        : ""
                  }
                  onValueChange={(v) =>
                    handleSymptomChange(symptom.id, v === "yes")
                  }
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
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Women-specific symptoms
              </CardTitle>
              <CardDescription>Additional symptoms to check</CardDescription>
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
                    value={
                      womenSymptoms[symptom.id] === true
                        ? "yes"
                        : womenSymptoms[symptom.id] === false
                          ? "no"
                          : ""
                    }
                    onValueChange={(v) =>
                      handleSymptomChange(symptom.id, v === "yes", true)
                    }
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

        {/* Result Banner */}
        {hasAnySymptom ? (
          <Alert className="bg-rose-50 border-rose-200">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <AlertTitle className="text-rose-900 font-semibold">
              Please consult a doctor
            </AlertTitle>
            <AlertDescription className="text-rose-800">
              You reported one or more symptoms that need medical evaluation.
              Please consult a doctor at the nearest health facility for further
              evaluation. Early detection can make a significant difference.
            </AlertDescription>
          </Alert>
        ) : (
          <Card className="bg-emerald-50 border border-emerald-200">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900">
                    No symptoms reported
                  </p>
                  <p className="text-sm text-emerald-800 mt-1">
                    Consider routine screening once every 5 years. If you notice
                    new symptoms later, consult a health facility promptly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Self-breast exam info for women */}
        {showWomenSection && !hasAnySymptom && (
          <Accordion
            type="single"
            collapsible
            className="bg-white border border-slate-200 rounded-lg"
          >
            <AccordionItem value="breast-exam" className="border-0">
              <AccordionTrigger className="px-4 py-3 text-sm font-medium text-slate-900 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-600" />
                  Self-breast examination guide
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-slate-700">
                <div className="space-y-3">
                  <p className="font-medium">
                    How to perform a self-breast examination:
                  </p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>
                      Stand in front of a mirror with shoulders straight and
                      arms on hips
                    </li>
                    <li>
                      Look for any changes in size, shape, or color of breasts
                    </li>
                    <li>Raise your arms and look for the same changes</li>
                    <li>
                      While lying down, use your right hand to feel your left
                      breast and vice versa
                    </li>
                    <li>
                      Use firm, smooth touches with finger pads in circular
                      motions
                    </li>
                    <li>
                      Cover the entire breast from top to bottom, side to side
                    </li>
                    <li>
                      Feel your breasts while standing or sitting, such as in
                      the shower
                    </li>
                  </ol>
                  <Alert className="bg-sky-50 border-sky-200 mt-4">
                    <Info className="h-4 w-4 text-sky-600" />
                    <AlertDescription className="text-sky-800 text-sm">
                      Seek help if you find a new lump, thickening, or any
                      change. Monthly self-exams help you know what&apos;s
                      normal for your body.
                    </AlertDescription>
                  </Alert>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        <DisclaimerAlert />

        {/* Navigation */}
        <div className="flex justify-between gap-3 pt-4">
          <Link href="/assessment/step-4">
            <Button variant="outline" className="gap-1">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <Button
            onClick={handleNext}
            className="gap-1 bg-emerald-600 hover:bg-emerald-700"
          >
            View Summary
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
