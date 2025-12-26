"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Types
export type Gender = "male" | "female" | "other";
export type ActivityLevel = "sedentary" | "moderate" | "adequate";
export type TobaccoUse = "never" | "past" | "daily";
export type AlcoholUse = "no" | "yes";
export type SugarType = "rbs" | "fbs" | "ppbs" | "hba1c";
export type WaistReference = "male" | "female";

export interface AssessmentData {
  // Step 1: Demographics
  age: number | null;
  gender: Gender | null;
  activityLevel: ActivityLevel | null;

  // Step 2: Anthropometry & Vitals
  height: number | null;
  weight: number | null;
  systolic: number | null;
  diastolic: number | null;
  sugarType: SugarType | null;
  sugarValue: number | null;

  // Step 3: NCD Risk (CBAC)
  tobaccoUse: TobaccoUse | null;
  alcoholUse: AlcoholUse | null;
  waistCircumference: number | null;
  waistReference: WaistReference | null;
  familyHistory: boolean | null;

  // Step 5: Cancer Symptoms
  generalSymptoms: Record<string, boolean>;
  womenSymptoms: Record<string, boolean>;

  // Computed flags
  bpEntered: boolean;
  sugarEntered: boolean;
  bpElevated: boolean;
  sugarElevated: boolean;
}

const initialData: AssessmentData = {
  age: null,
  gender: null,
  activityLevel: null,
  height: null,
  weight: null,
  systolic: null,
  diastolic: null,
  sugarType: null,
  sugarValue: null,
  tobaccoUse: null,
  alcoholUse: null,
  waistCircumference: null,
  waistReference: null,
  familyHistory: null,
  generalSymptoms: {},
  womenSymptoms: {},
  bpEntered: false,
  sugarEntered: false,
  bpElevated: false,
  sugarElevated: false,
};

interface AssessmentContextType {
  data: AssessmentData;
  updateData: (updates: Partial<AssessmentData>) => void;
  resetAssessment: () => void;
  calculateBMI: () => number | null;
  getBMICategory: (bmi: number) => { label: string; color: string };
  calculateCBACScore: () => number;
  hasAnyCancerSymptom: () => boolean;
  needsLifestyleGuidance: () => {
    tobacco: boolean;
    alcohol: boolean;
    activity: boolean;
  };
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined
);

// BMI Categories
export const BMI_CATEGORIES = {
  underweight: { max: 18.5, label: "Underweight", color: "sky" },
  normal: { max: 25, label: "Normal", color: "emerald" },
  overweight: { max: 30, label: "Overweight", color: "amber" },
  obese: { max: Infinity, label: "Obese", color: "rose" },
};

// BP Thresholds (configurable)
export const BP_THRESHOLDS = {
  systolicNormal: 120,
  systolicElevated: 140,
  diastolicNormal: 80,
  diastolicElevated: 90,
};

// Sugar Thresholds (configurable by type)
export const SUGAR_THRESHOLDS = {
  rbs: { normal: 140, elevated: 200 },
  fbs: { normal: 100, elevated: 126 },
  ppbs: { normal: 140, elevated: 200 },
  hba1c: { normal: 5.7, elevated: 6.5 },
};

// Waist thresholds
export const WAIST_THRESHOLDS = {
  female: { low: 80, high: 90 },
  male: { low: 90, high: 100 },
};

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AssessmentData>(initialData);

  // Load from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("assessmentData");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        // Invalid data, use initial
      }
    }
  }, []);

  // Save to sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem("assessmentData", JSON.stringify(data));
  }, [data]);

  const updateData = (updates: Partial<AssessmentData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetAssessment = () => {
    setData(initialData);
    sessionStorage.removeItem("assessmentData");
  };

  const calculateBMI = (): number | null => {
    if (!data.height || !data.weight) return null;
    const heightM = data.height / 100;
    return Math.round((data.weight / (heightM * heightM)) * 10) / 10;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < BMI_CATEGORIES.underweight.max) return BMI_CATEGORIES.underweight;
    if (bmi < BMI_CATEGORIES.normal.max) return BMI_CATEGORIES.normal;
    if (bmi < BMI_CATEGORIES.overweight.max) return BMI_CATEGORIES.overweight;
    return BMI_CATEGORIES.obese;
  };

  const calculateCBACScore = (): number => {
    let score = 0;

    // Age band
    const age = data.age || 0;
    if (age >= 60) score += 4;
    else if (age >= 50) score += 3;
    else if (age >= 40) score += 2;
    else if (age >= 30) score += 1;

    // Tobacco
    if (data.tobaccoUse === "daily") score += 2;
    else if (data.tobaccoUse === "past") score += 1;

    // Alcohol
    if (data.alcoholUse === "yes") score += 1;

    // Waist circumference
    const waist = data.waistCircumference;
    const reference =
      data.waistReference || (data.gender === "male" ? "male" : "female");
    if (waist) {
      const thresholds = WAIST_THRESHOLDS[reference];
      if (waist > thresholds.high) score += 2;
      else if (waist > thresholds.low) score += 1;
    }

    // Physical activity (from step 1)
    if (
      data.activityLevel === "sedentary" ||
      data.activityLevel === "moderate"
    ) {
      score += 1;
    }

    // Family history
    if (data.familyHistory) score += 2;

    return score;
  };

  const hasAnyCancerSymptom = (): boolean => {
    const generalYes = Object.values(data.generalSymptoms).some((v) => v);
    const womenYes = Object.values(data.womenSymptoms).some((v) => v);
    return generalYes || womenYes;
  };

  const needsLifestyleGuidance = () => {
    return {
      tobacco: data.tobaccoUse !== null && data.tobaccoUse !== "never",
      alcohol: data.alcoholUse === "yes",
      activity: data.activityLevel !== "adequate",
    };
  };

  return (
    <AssessmentContext.Provider
      value={{
        data,
        updateData,
        resetAssessment,
        calculateBMI,
        getBMICategory,
        calculateCBACScore,
        hasAnyCancerSymptom,
        needsLifestyleGuidance,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within AssessmentProvider");
  }
  return context;
}

// Helper to check if BP is elevated
export function isBPElevated(
  systolic: number | null,
  diastolic: number | null
): boolean {
  if (!systolic || !diastolic) return false;
  return (
    systolic >= BP_THRESHOLDS.systolicElevated ||
    diastolic >= BP_THRESHOLDS.diastolicElevated
  );
}

// Helper to check if sugar is elevated
export function isSugarElevated(
  type: SugarType | null,
  value: number | null
): boolean {
  if (!type || !value) return false;
  const threshold = SUGAR_THRESHOLDS[type];
  return value >= threshold.elevated;
}

// Helper to get BP status
export function getBPStatus(
  systolic: number | null,
  diastolic: number | null
): { label: string; color: string } {
  if (!systolic || !diastolic) return { label: "Not entered", color: "slate" };
  if (
    systolic >= BP_THRESHOLDS.systolicElevated ||
    diastolic >= BP_THRESHOLDS.diastolicElevated
  ) {
    return { label: "Higher than normal", color: "rose" };
  }
  if (
    systolic >= BP_THRESHOLDS.systolicNormal ||
    diastolic >= BP_THRESHOLDS.diastolicNormal
  ) {
    return { label: "Elevated", color: "amber" };
  }
  return { label: "Normal", color: "emerald" };
}

// Helper to get sugar status
export function getSugarStatus(
  type: SugarType | null,
  value: number | null
): { label: string; color: string } {
  if (!type || !value) return { label: "Not entered", color: "slate" };
  const threshold = SUGAR_THRESHOLDS[type];
  if (value >= threshold.elevated) {
    return { label: "Higher than normal", color: "rose" };
  }
  if (value >= threshold.normal) {
    return { label: "Elevated", color: "amber" };
  }
  return { label: "Normal", color: "emerald" };
}
