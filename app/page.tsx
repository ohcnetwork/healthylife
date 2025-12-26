"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  Calculator,
  ClipboardCheck,
  Activity,
  Utensils,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
  HeartPulse,
  Droplet,
  Users,
  ArrowRight,
  Ribbon,
  IdCard,
  Building2
} from "lucide-react";
import { useAssessment } from "@/lib/assessment-context";

export default function LandingPage() {
  const { resetAssessment } = useAssessment();

  const handleStartAssessment = () => {
    resetAssessment();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Healthy Life
                </span>
                <p className="text-xs text-slate-500 -mt-0.5">Health & Wellness Tools</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="#tools" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Tools
              </Link>
              <Link href="#assessment" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Assessment
              </Link>
              <Link href="/assessment/step-1" onClick={handleStartAssessment}>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Start Assessment
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100 via-transparent to-transparent opacity-60" />
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              Free Health Tools
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              Your health journey
              <span className="block text-emerald-600">starts here</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              Free tools to understand your health better. Calculate your BMI, 
              assess your health risks, and get personalized guidance — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/assessment/step-1" onClick={handleStartAssessment}>
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 gap-2 w-full sm:w-auto">
                  Take Full Assessment
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/tools/bmi-calculator">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Calculator className="w-5 h-5" />
                  Quick BMI Check
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Clock, label: "5 min assessment", value: "Quick" },
              { icon: Shield, label: "100% private", value: "Secure" },
              { icon: Calculator, label: "Instant results", value: "Free" },
              { icon: Users, label: "For everyone", value: "Easy" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
                <stat.icon className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-slate-100 text-slate-700 border-slate-200 mb-4">
              Health Tools
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Quick health calculators
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Use our free tools to get instant insights about your health metrics.
              No sign-up required, and your data stays on your device.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* BMI Calculator */}
            <Link href="/tools/bmi-calculator" className="group">
              <Card className="h-full bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                    <Calculator className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">BMI Calculator</CardTitle>
                  <CardDescription className="text-slate-600">
                    Calculate your Body Mass Index and understand what it means for your health.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-emerald-700 font-medium group-hover:gap-2 transition-all">
                    Calculate now <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* BP Tracker */}
            <Link href="/tools/bp-checker" className="group">
              <Card className="h-full bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mb-4 shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                    <HeartPulse className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">BP Interpreter</CardTitle>
                  <CardDescription className="text-slate-600">
                    Enter your blood pressure reading and understand if it&apos;s within healthy range.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-rose-700 font-medium group-hover:gap-2 transition-all">
                    Check now <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Blood Sugar Checker */}
            <Link href="/tools/sugar-checker" className="group">
              <Card className="h-full bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                    <Droplet className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">Blood Sugar Check</CardTitle>
                  <CardDescription className="text-slate-600">
                    Interpret your blood sugar readings (FBS, RBS, PPBS, or HbA1c) instantly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-amber-700 font-medium group-hover:gap-2 transition-all">
                    Check now <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Cancer Screening */}
            <Link href="/tools/cancer-screening" className="group">
              <Card className="h-full bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                    <Ribbon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">Cancer Symptom Check</CardTitle>
                  <CardDescription className="text-slate-600">
                    Screen for early warning signs. Early detection saves lives.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-purple-700 font-medium group-hover:gap-2 transition-all">
                    Check now <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* UHID Registration */}
            <Link href="/tools/uhid-registration" className="group">
              <Card className="h-full bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform">
                    <IdCard className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">Generate UHID</CardTitle>
                  <CardDescription className="text-slate-600">
                    Get your Unique Health ID for Kerala&apos;s digital health system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sky-700 font-medium group-hover:gap-2 transition-all">
                    Get started <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Find JAK */}
            <Link href="/tools/find-jak" className="group">
              <Card className="h-full bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">Find JAK</CardTitle>
                  <CardDescription className="text-slate-600">
                    Locate your nearest Janakeeya Arogya Kendram health centre.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-teal-700 font-medium group-hover:gap-2 transition-all">
                    Find now <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Full Assessment Section */}
      <section id="assessment" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 mb-4">
                Comprehensive Check
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6">
                Complete Health Risk Assessment
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Take our 5-minute comprehensive assessment to understand your health risks 
                and get personalized recommendations. Based on the Community-Based Assessment 
                Checklist (CBAC), this tool screens for non-communicable disease risks and 
                early warning signs.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Calculator, text: "BMI calculation & interpretation" },
                  { icon: HeartPulse, text: "Blood pressure & sugar tracking" },
                  { icon: ClipboardCheck, text: "NCD risk scoring (CBAC)" },
                  { icon: Activity, text: "Lifestyle & activity guidance" },
                  { icon: Utensils, text: "Personalized diet tips" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link href="/assessment/step-1" onClick={handleStartAssessment}>
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                  Start Full Assessment
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl blur-3xl" />
              <Card className="relative bg-white border-slate-200 shadow-2xl shadow-slate-200/50">
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <ClipboardCheck className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Health Assessment</CardTitle>
                  <CardDescription>4 steps • 5 minutes • Free</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { step: 1, title: "Basic Information", desc: "Age, gender, activity" },
                    { step: 2, title: "Body Measurements", desc: "Height, weight, vitals" },
                    { step: 3, title: "Risk Factors", desc: "CBAC questionnaire" },
                    { step: 4, title: "Summary & Guidance", desc: "Results, tips & advice" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield className="w-12 h-12 text-emerald-200 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Your privacy is our priority
          </h2>
          <p className="text-emerald-100 max-w-2xl mx-auto mb-8">
            We don&apos;t ask for your name, phone number, or any personal identifiers. 
            All calculations happen on your device, and your data never leaves your browser.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["No sign-up required", "No data stored", "No tracking", "100% anonymous"].map((item, i) => (
              <Badge key={i} className="bg-emerald-500/30 text-white border-emerald-400/50 py-1.5 px-3">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">Healthy Life</span>
            </div>
            <p className="text-sm text-center md:text-right">
              This tool provides general health information and is not a medical diagnosis.
              <br />
              Always consult a healthcare professional for medical advice.
            </p>
          </div>
          <Separator className="my-8 bg-slate-800" />
          <p className="text-center text-sm">
            © {new Date().getFullYear()} Healthy Life Campaign. All tools are free to use.
          </p>
        </div>
      </footer>
    </div>
  );
}
