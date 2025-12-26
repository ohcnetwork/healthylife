"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Heart,
  ChevronLeft,
  ExternalLink,
  IdCard,
  CheckCircle2,
  Smartphone,
  Shield,
  Building2,
  FileText,
  Info,
  ArrowRight,
  Fingerprint
} from "lucide-react";

export default function UHIDRegistrationPage() {
  const handleRedirect = () => {
    window.open("https://ehealth.kerala.gov.in/portal/", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50">
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
            <Badge variant="secondary" className="bg-sky-100 text-sky-700 border-sky-200">
              <IdCard className="w-3 h-3 mr-1" />
              UHID Tool
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-500/30">
              <IdCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              Generate Your UHID
            </h1>
            <p className="text-slate-600">
              Your Unique Health Identifier for Kerala&apos;s digital health ecosystem
            </p>
          </div>

          {/* What is UHID */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-sky-600" />
                What is UHID?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>UHID (Unique Health Identifier)</strong> is a unique identification number 
                assigned to every citizen under Kerala&apos;s State Digital Health Mission. It serves 
                as your digital health identity across all government healthcare facilities in Kerala.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                With UHID, all your health records from government hospitals, PHCs, and health centers 
                are linked together, making healthcare delivery smoother and more efficient.
              </p>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Benefits of UHID</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  { icon: FileText, text: "Access all your medical records in one place" },
                  { icon: Building2, text: "Seamless care across Kerala's government hospitals" },
                  { icon: Shield, text: "Secure and private health data storage" },
                  { icon: Smartphone, text: "Easy access through mobile and web portal" },
                  { icon: CheckCircle2, text: "Faster registration at healthcare facilities" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-sky-600" />
                    </div>
                    <span className="text-sm text-slate-700 pt-1.5">{item.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* How to Register */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-sky-600" />
                How to Register
              </CardTitle>
              <CardDescription>
                You&apos;ll need your Aadhaar number linked with a mobile number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {[
                  "Click the button below to visit the eHealth Kerala portal",
                  "Select 'Create UHID / Link Mobile Number with UHID'",
                  "Enter your Aadhaar number",
                  "Verify using OTP sent to your Aadhaar-linked mobile",
                  "Confirm your details and your UHID will be generated",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-slate-700 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <Button 
            onClick={handleRedirect}
            size="lg"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-500/30 gap-2"
          >
            Go to eHealth Kerala Portal
            <ExternalLink className="w-5 h-5" />
          </Button>

          {/* Already have UHID */}
          <Alert className="bg-emerald-50 border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-emerald-800 font-semibold">Already have a UHID?</AlertTitle>
            <AlertDescription className="text-emerald-700">
              You can use the same portal to log in, view your health records, 
              and manage your profile.
            </AlertDescription>
          </Alert>

          {/* FAQ */}
          <Accordion type="single" collapsible className="bg-white border border-slate-200 rounded-lg shadow-lg">
            <AccordionItem value="faq-1" className="border-b border-slate-200">
              <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                What if my mobile isn&apos;t linked with Aadhaar?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-slate-600">
                If your mobile number is not linked with Aadhaar, you can visit the nearest 
                government hospital reception desk to create your UHID with assistance from 
                healthcare staff.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2" className="border-b border-slate-200">
              <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                Is my health data secure?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-slate-600">
                Yes. The State Digital Health Mission follows strict data protection guidelines. 
                Your health records are encrypted and can only be accessed by authorized healthcare 
                providers when you visit a facility.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3" className="border-0">
              <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                Can I use UHID at private hospitals?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-slate-600">
                Currently, UHID is primarily used in government healthcare facilities. 
                However, integration with private hospitals is being expanded under the 
                State Digital Health Mission.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          {/* Full Assessment CTA */}
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-0 text-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Want a health check?</h3>
                <p className="text-emerald-100 text-sm">
                  Take our quick assessment for personalized risk scores and guidance.
                </p>
                <Link href="/assessment/step-1">
                  <Button variant="secondary" className="bg-white text-emerald-700 hover:bg-emerald-50 gap-2">
                    Take Health Assessment
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
            UHID is managed by the State Digital Health Mission, Kerala.
            <br />
            © {new Date().getFullYear()} Healthy Life Campaign
          </p>
        </div>
      </footer>
    </div>
  );
}

