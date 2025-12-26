"use client";

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
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ChevronLeft,
  ChevronRight,
  Cigarette,
  Wine,
  Activity,
  CheckCircle2,
  Heart,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import { useAssessment } from "@/lib/assessment-context";
import Link from "next/link";

export default function Step4Page() {
  const router = useRouter();
  const { data, needsLifestyleGuidance } = useAssessment();

  const guidance = needsLifestyleGuidance();
  const hasAnyTrigger =
    guidance.tobacco || guidance.alcohol || guidance.activity;

  const handleNext = () => {
    router.push("/assessment/step-5");
  };

  return (
    <AppShell currentStep={4} totalSteps={6}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Lifestyle guidance
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Personalised tips based on your answers
          </p>
        </div>

        {/* Summary Card */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Your focus areas
            </CardTitle>
            <CardDescription>
              {hasAnyTrigger
                ? "Based on your answers, here are areas where small changes can help"
                : "You're on a good track! Here are tips to maintain your healthy habits"}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              {!hasAnyTrigger && (
                <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Healthy habits
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tobacco Module */}
        {guidance.tobacco && (
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Cigarette className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Support to reduce or stop tobacco
                    </CardTitle>
                    <CardDescription>
                      Small steps can make a big difference
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Recommended
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-900">
                  Quick actions:
                </p>
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
                    Ask a health worker about cessation support
                  </li>
                </ul>
              </div>
              <Accordion type="single" collapsible>
                <AccordionItem value="resources" className="border-0">
                  <AccordionTrigger className="text-sm text-emerald-700 hover:text-emerald-800 py-2">
                    Resources & support
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-600">
                    <p>
                      Government tobacco cessation services are available
                      through health facilities. Ask at your nearest{" "}
                      <strong>Janakeeya Arogya Kendram</strong> about quit
                      programs and counseling support.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Alcohol Module */}
        {guidance.alcohol && (
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Wine className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Support to reduce daily alcohol use
                    </CardTitle>
                    <CardDescription>
                      Reducing alcohol improves long-term health
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Recommended
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-900">
                  Quick actions:
                </p>
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
              </div>
              <Alert className="bg-sky-50 border-sky-200">
                <Lightbulb className="h-4 w-4 text-sky-600" />
                <AlertDescription className="text-sky-800 text-sm">
                  If you find it difficult to reduce on your own, professional
                  support is available. Speak with a healthcare provider about
                  options.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Activity Module */}
        {guidance.activity && (
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Move more, safely
                    </CardTitle>
                    <CardDescription>
                      Build activity gradually for lasting change
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Recommended
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-900">
                  Starter plan:
                </p>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <Badge variant="outline" className="text-xs">
                      Week 1
                    </Badge>
                    <span>10 minutes walking per day, 5 days/week</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <Badge variant="outline" className="text-xs">
                      Week 2
                    </Badge>
                    <span>15 minutes walking per day, 5 days/week</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <Badge variant="outline" className="text-xs">
                      Week 3+
                    </Badge>
                    <span>Build toward 150 minutes/week total</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-800">
                  <strong>Add strength:</strong> Try simple bodyweight exercises
                  (squats, wall push-ups) 2 days/week for added benefit.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No triggers - positive message */}
        {!hasAnyTrigger && (
          <Card className="bg-emerald-50 border border-emerald-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-emerald-900">
                    You&apos;re on a good track!
                  </CardTitle>
                  <CardDescription className="text-emerald-700">
                    Keep up your healthy habits
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="tips" className="border-0">
                  <AccordionTrigger className="text-sm text-emerald-700 hover:text-emerald-800 py-2">
                    Maintenance tips
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-emerald-800 space-y-2">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        Continue regular physical activity
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        Maintain a balanced diet with plenty of vegetables
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        Get regular health check-ups
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        Manage stress with relaxation techniques
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-3 pt-4">
          <Link href="/assessment/step-3">
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
