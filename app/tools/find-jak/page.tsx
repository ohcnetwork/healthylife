"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Heart,
  ChevronLeft,
  Building2,
  MapPin,
  Search,
  Clock,
  Phone,
  Stethoscope,
  CheckCircle2,
  Info,
  ArrowRight,
  Navigation,
  Users,
  Pill,
  Activity
} from "lucide-react";

// Kerala districts for the dropdown
const KERALA_DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod"
];

export default function FindJAKPage() {
  const [district, setDistrict] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setHasSearched(true);
    // TODO: Implement actual search when data is available
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-slate-50">
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
            <Badge variant="secondary" className="bg-teal-100 text-teal-700 border-teal-200">
              <Building2 className="w-3 h-3 mr-1" />
              Find JAK
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/30">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              Find Your Janakeeya Arogya Kendram
            </h1>
            <p className="text-slate-600">
              Locate the nearest primary health centre in your area
            </p>
          </div>

          {/* What is JAK */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-teal-600" />
                What is Janakeeya Arogya Kendram?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Janakeeya Arogya Kendram (JAK)</strong> is Kerala&apos;s network of 
                family health centres that provide comprehensive primary healthcare services 
                to communities. These centres are the first point of contact for preventive, 
                promotive, and curative healthcare.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                JAKs operate under the National Health Mission and offer free consultations, 
                essential medicines, diagnostic services, and referral support.
              </p>
            </CardContent>
          </Card>

          {/* Services Available */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Services Available at JAK</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Stethoscope, text: "General OPD" },
                  { icon: Activity, text: "NCD Screening" },
                  { icon: Pill, text: "Free Medicines" },
                  { icon: Users, text: "Family Health" },
                  { icon: Clock, text: "Lab Services" },
                  { icon: Phone, text: "Teleconsultation" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                    <item.icon className="w-4 h-4 text-teal-600" />
                    <span className="text-sm text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search Section */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="w-5 h-5 text-teal-600" />
                Search for JAK
              </CardTitle>
              <CardDescription>
                Find a Janakeeya Arogya Kendram near you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select District</Label>
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your district" />
                  </SelectTrigger>
                  <SelectContent>
                    {KERALA_DISTRICTS.map((d) => (
                      <SelectItem key={d} value={d.toLowerCase()}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">Search by name or location</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="e.g., Panchayat name, area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleSearch}
                className="w-full bg-teal-600 hover:bg-teal-700 gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
            </CardContent>
          </Card>

          {/* Search Results Placeholder */}
          {hasSearched && (
            <Alert className="bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800 font-semibold">Coming Soon</AlertTitle>
              <AlertDescription className="text-amber-700">
                We&apos;re working on adding the complete directory of Janakeeya Arogya Kendrams. 
                In the meantime, please contact your local ASHA worker or visit the nearest 
                government health facility for assistance.
              </AlertDescription>
            </Alert>
          )}

          {/* Alternative Options */}
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Other Ways to Find Help</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Health Helpline</p>
                  <p className="text-sm text-slate-600">Call 104 for health information</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Contact ASHA Worker</p>
                  <p className="text-sm text-slate-600">Your local ASHA can guide you to the nearest facility</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Navigation className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Visit PHC/CHC</p>
                  <p className="text-sm text-slate-600">Go to your nearest Primary Health Centre</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                Typical Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Monday - Saturday</span>
                  <span className="font-medium text-slate-900">8:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Emergency Services</span>
                  <span className="font-medium text-slate-900">24/7 (at select centres)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">Sunday & Holidays</span>
                  <span className="font-medium text-slate-500">Emergency only</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                * Hours may vary by location. Please call ahead to confirm.
              </p>
            </CardContent>
          </Card>

          {/* What to Bring */}
          <Card className="bg-teal-50 border-teal-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-teal-900">What to Bring</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "Aadhaar card or any government ID",
                  "UHID card (if you have one)",
                  "Previous medical records (if any)",
                  "List of current medications",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-teal-800">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Separator />

          {/* Full Assessment CTA */}
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-0 text-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Check your health first</h3>
                <p className="text-emerald-100 text-sm">
                  Take our quick assessment before your visit to understand your risk factors.
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
            Janakeeya Arogya Kendrams are operated by the Government of Kerala.
            <br />
            © {new Date().getFullYear()} Healthy Life Campaign
          </p>
        </div>
      </footer>
    </div>
  );
}

