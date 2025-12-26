# Healthy Life Campaign

## Health Risk Assessment Web Portal

### UX, UI, Content, and Interaction Specification (Tailwind + shadcn/ui)

---

## 0) Document Intent

This document defines an end-to-end experience for the **Healthy Life Campaign – Health Risk Assessment Web Portal**:

- The **theme and narrative** of the campaign experience
- **Information architecture** and step-by-step workflow
- **In-depth design specs** for **each page** (layout, components, states, content, validation)
- Concrete **Tailwind color usage** and **shadcn/ui component mapping**
- Accessibility, privacy, and non-functional requirements

The portal is a **self-assessment + interpretation** tool for the general public.
It **does not diagnose** disease and **does not prescribe treatment**.

---

## 1) Product Theme & Experience Principles

### 1.1 Theme: “Healthy Life Campaign”

The portal should feel:

- **Warm, trustworthy, calm**
- **Public-health oriented** (clear, simple, supportive language)
- **Actionable** (small next steps, not fear-based)
- **Non-judgmental** (neutral phrasing around weight, addiction, activity)

### 1.2 Core Promises to the User

1. **5 minutes** to understand basic health signals
2. **Instant interpretation** (BMI, optional BP, optional blood sugar)
3. **Risk signals** for NCDs and cancer symptoms (CBAC-based)
4. **Personalised guidance** for healthier habits
5. **Privacy first** (no mandatory identifiers, client-side calculations)

### 1.3 Guardrails (Must Be Visible in UI Copy)

- Not a diagnostic tool
- No treatment advice
- Encourage contact with health facilities when risk is high or symptoms exist
- Clear disclaimer on result-heavy pages (Step 2 results, Step 3 scoring result, Step 5 symptom result, Step 6 summary)

---

## 2) Global UX Rules & Navigation Model

### 2.1 Route Map (Suggested)

- `/` Landing
- `/assessment/step-1` Demographics & Activity
- `/assessment/step-2` Anthropometry & Vitals
- `/assessment/step-2/advisory` (conditional) Elevated vitals stop page
- `/assessment/step-3` NCD Risk (CBAC Part A)
- `/assessment/step-4` Lifestyle & Addiction Guidance
- `/assessment/step-5` Cancer Symptom Check
- `/assessment/step-6` Final Summary & Advice
- `/assessment/export` Download PDF (optional as dialog or page)

> If you prefer fewer routes, Step 2 advisory can be a full-page state inside Step 2.
> This doc treats it as a page because the flow requires **blocking** progression.

### 2.2 Global Layout Pattern (App Shell)

All pages use a consistent shell:

**Top Sticky Header**

- Campaign logo + title on left
- “Privacy” + “Disclaimer” quick links (open dialogs)
- Step indicator

**Main Content**

- Single-column, mobile-first
- Max width for readability

**Footer**

- Short privacy note
- Medical disclaimer (where required)
- Campaign attribution

### 2.3 Stepper / Progress Indicator

- Show “Step X of 6”
- Also show a progress bar
- Never show “completed health status” in the header (avoid anxiety); only step progress.

**shadcn/ui + Tailwind**

- `Progress`
- Custom step label row (simple flex row + badges)

### 2.4 Skippable Inputs

- BP and Blood Sugar are optional.
- Users can proceed without them.
- If entered and elevated, the portal shows advisory and **blocks proceeding** into risk scoring (as specified).

### 2.5 Client-Side Computation

- No server dependency for scoring
- Data lives in memory and optionally in `sessionStorage` to protect against refresh loss (recommended)

### 2.6 No Mandatory Personal Identifiers

- Do **not** ask name, phone, address, Aadhaar, email, etc.
- If future “Find nearest facility” is added, make location permission optional and explain.

---

## 3) Visual Design System (Tailwind Colors + shadcn/ui)

### 3.1 Color Palette (Semantic + Accessible)

Use shadcn’s token-driven approach but specify concrete Tailwind values for implementation clarity.

#### Base (Light Theme)

- Page background: `bg-slate-50`
- Surfaces / Cards: `bg-white`
- Primary text: `text-slate-900`
- Secondary text: `text-slate-600`
- Borders: `border-slate-200`
- Muted background: `bg-slate-100`

#### Brand (Healthy Life)

- Primary brand: `emerald`
  - Primary button: `bg-emerald-600 hover:bg-emerald-700 text-white`
  - Links: `text-emerald-700 hover:text-emerald-800`
  - Focus ring: `focus-visible:ring-emerald-500`

#### Status Colors (Never color-only; always include icon + label)

- **Good / Normal:** `emerald`
  - Badge: `bg-emerald-50 text-emerald-800 border border-emerald-200`

- **Caution / Elevated:** `amber`
  - Badge: `bg-amber-50 text-amber-900 border border-amber-200`

- **High Risk / Danger:** `rose`
  - Alert: `bg-rose-50 text-rose-900 border border-rose-200`

- **Info:** `sky`
  - Tip panels: `bg-sky-50 text-sky-900 border border-sky-200`

#### Color-blind friendly reinforcement

- Pair every status color with:
  - A distinct icon (✓ / ! / ⚠)
  - A text label (“Normal”, “Elevated”, “High”)
  - Optional pattern/border style (solid vs dashed) if needed

### 3.2 Typography (Tailwind)

- App title: `text-lg font-semibold tracking-tight`
- Page title: `text-2xl font-bold tracking-tight`
- Section title: `text-base font-semibold`
- Body: `text-sm leading-6 text-slate-700`
- Helper text: `text-xs text-slate-500`
- Numerical highlights: `text-3xl font-semibold tabular-nums`

### 3.3 Spacing and Layout

- Main container: `max-w-xl mx-auto px-4 py-6`
- Card spacing: `space-y-4`
- Form row spacing: `space-y-2`
- Section separation: `pt-2` + `Separator`

### 3.4 shadcn/ui Component Palette (Canonical)

Use these components throughout:

- Layout: `Card`, `Separator`, `ScrollArea` (optional)
- Inputs: `Input`, `Label`, `RadioGroup`, `Select`, `Checkbox`, `Textarea`
- Feedback: `Alert`, `Badge`, `Progress`, `Toast` (Sonner)
- Overlays: `Dialog`, `Popover`, `Tooltip`, `Sheet` (for help drawers)
- Navigation: `Button`, (optional) `Breadcrumb`
- Content: `Accordion`, `Tabs`

---

## 4) Content Style Guide (Health-Literate Public)

### 4.1 Language Principles

- Use short sentences, avoid jargon
- Prefer: “higher than normal” over “hypertensive”
- Avoid shaming language
- Always propose next steps:
  - “Consider…”
  - “It may help to…”
  - “If you can, speak to…”

### 4.2 Disclaimer Copy (Standard)

A consistent disclaimer block, used on result-heavy pages:

**Title:** “Important”
**Body:** “This tool provides general risk information and is not a diagnosis. It does not provide treatment advice. If you have symptoms or concerns, consult a doctor or visit your nearest health facility.”

Implement as an `Alert` with `bg-slate-100 border-slate-200 text-slate-800`, or as a caution-styled `Alert` when risk is high.

### 4.3 Privacy Copy (Standard)

**“Privacy note”**
“We do not ask for your name or phone number. Your answers are processed on your device. Downloading a PDF saves a copy on your device.”

---

## 5) Page-by-Page Specification

---

# Page 1 — Landing Page (Entry Point)

### Purpose

- Establish campaign credibility
- Set expectations (5 minutes, not diagnosis)
- Start the assessment

### Layout

**Header**

- Campaign logo mark + “Healthy Life Campaign”
- Optional small “Government/Partner logos” row (if applicable)

**Hero Section**

- Big headline + one-line promise
- Primary CTA

**Trust & Privacy**

- Short disclaimer
- Privacy note

**Footer**

- Links: Privacy, Disclaimer, Accessibility

### shadcn/ui Components

- `Card` (hero container)
- `Button` (primary CTA)
- `Alert` (disclaimer + privacy)
- `Dialog` (Privacy details, Disclaimer details)
- `Separator`

### Tailwind Design Details

- Page: `min-h-screen bg-slate-50 text-slate-900`
- Hero Card: `bg-white border border-slate-200 shadow-sm rounded-xl`
- Primary CTA:
  - `Button` default styled as:
  - `bg-emerald-600 hover:bg-emerald-700 text-white`

- Secondary action (optional “How it works”):
  - `Button variant="outline"` → `border-slate-300 text-slate-800`

### Suggested Content (Exact)

- Title: **“Healthy Life Campaign”**
- Headline: **“Check your health risks in 5 minutes”**
- Subtext: “Answer a few questions and get instant, personalised guidance.”
- CTA: **“Start Assessment”**
- Disclaimer snippet: (see standard disclaimer)
- Privacy snippet: (see standard privacy)

### Interaction Notes

- On “Start Assessment” → Step 1
- “Privacy” opens `Dialog` with:
  - What is collected (answers)
  - What is not collected (name, phone, identifiers)
  - Client-side processing statement

---

# Page 2 — Step 1 of 6: Basic Demographics & Activity Level

### Purpose

Collect:

- Age (completed years)
- Gender
- Physical activity level
  Used for CBAC scoring and lifestyle advice.

### Layout

- Title + short instruction
- One `Card` for inputs
- Bottom navigation (Back disabled here or goes to Landing)

### shadcn/ui Components

- `Card`, `CardHeader`, `CardContent`, `CardFooter`
- `Input` (Age)
- `RadioGroup` (Gender)
- `RadioGroup` (Activity level)
- `Button` (Next)
- `Progress` + custom step label row
- `Tooltip` (clarify “completed years”)
- `Toast` (optional validation feedback)

### Tailwind Design Details

- Step badge row:
  - “Step 1 of 6” as `Badge` with `bg-slate-100 text-slate-700`

- Inputs:
  - `Input` with `border-slate-300 focus-visible:ring-emerald-500`

- Radio items:
  - Use full-width tap targets:
  - `flex items-start gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50`

### Content and Microcopy

**Page title:** “About you”
**Helper:** “This helps us tailor your risk score and tips.”

**Age**

- Label: “Age (completed years)”
- Placeholder: “e.g., 42”
- Helper: “Enter your age in full years.”

**Gender**

- Options:
  - Male
  - Female
  - Other

**Physical activity level**

- Sedentary: “Very little activity”
- Moderate: “Some activity, under 150 minutes/week”
- Adequate: “150 minutes/week or more”

### Validation Rules

- Age required
- Numeric only
- Range suggestion: `1–120` (soft guard)
- If user < 18: show non-blocking info alert:
  - “This tool is designed for adults. You can continue, but results may be less relevant.”

### Navigation

- Back: to Landing
- Next: Step 2

---

# Page 3 — Step 2 of 6: Anthropometry & Vital Parameters

### Purpose

Collect:

- Height, weight → compute **BMI**
- Optional BP
- Optional blood sugar (choose one type)

Show immediate interpretation feedback inline.
**If BP or Blood Sugar is elevated** → show advisory and block moving to risk scoring.

### Layout (Recommended)

Use **three stacked cards**:

1. Body measurements (Height/Weight/BMI)
2. Blood Pressure (optional)
3. Blood Sugar (optional, with type selector)

Keep “Next” sticky at bottom on mobile.

### shadcn/ui Components

- `Card`
- `Input` for height/weight/systolic/diastolic/sugar value
- `Select` for sugar type (RBS/FBS/PPBS/HbA1c)
- `Badge` for BMI category + BP status + sugar status
- `Alert` for advisory triggers
- `Separator`
- `Button` (Next / Skip section)
- `Dialog` / `Popover` (help for measuring; units; sugar types)
- `Progress`

### Tailwind Design Details

**BMI Result Display**

- Numeric BMI big: `text-3xl font-semibold tabular-nums`
- Category badge (color-coded):
  - Underweight: `bg-sky-50 text-sky-900 border border-sky-200`
  - Normal: `bg-emerald-50 text-emerald-800 border border-emerald-200`
  - Overweight: `bg-amber-50 text-amber-900 border border-amber-200`
  - Obese: `bg-rose-50 text-rose-900 border border-rose-200`

**Inline interpretation rows**

- Use `flex items-center justify-between rounded-lg border border-slate-200 p-3`
- Status on right as a `Badge`

**Advisory banner**

- `Alert` styled as warning/danger depending on severity:
  - Elevated: `bg-amber-50 border-amber-200 text-amber-900`
  - High: `bg-rose-50 border-rose-200 text-rose-900`

### BMI Logic (Client-side)

- Formula: `BMI = weight_kg / (height_m^2)`
- Round display to 1 decimal
- Category defaults (configurable):
  - Underweight: < 18.5
  - Normal: 18.5–24.9
  - Overweight: 25.0–29.9
  - Obese: ≥ 30.0
    _(Make these constants configurable for local guidelines.)_

### BP & Sugar Cutoffs

Because cutoffs vary by guideline and program, implement as configurable constants and show “higher than normal” style copy. Example default references can be included in an internal config file, but UI should remain guideline-agnostic unless you have an approved source.

### Content and Microcopy

**Card 1: Height & Weight**

- Title: “Body measurements”
- Height label: “Height (cm)”
- Weight label: “Weight (kg)”
- BMI result block:
  - “Your BMI: 24.1” + badge “Normal”
  - Helper: “BMI is a screening measure and doesn’t diagnose illness.”

**Card 2: Blood Pressure (Optional)**

- Title: “Blood pressure (optional)”
- Inputs: Systolic / Diastolic
- Skip button: “I don’t know my BP”
- Inline status text examples:
  - “Your BP is within normal limits”
  - “Your BP is higher than normal”

**Card 3: Blood Sugar (Optional)**

- Title: “Blood sugar (optional)”
- Select: RBS / FBS / PPBS / HbA1c
- Input label updates based on type:
  - “Enter value (mg/dL)” or “Enter value (%)” for HbA1c

- Skip button: “I don’t know my blood sugar”
- Inline status text examples:
  - “Your blood sugar is within normal limits”
  - “Your blood sugar is higher than normal”

### Gating Rule (Critical)

If **any entered** BP or Sugar value is interpreted as elevated:

- Show **prominent advisory alert**
- Replace “Next” with:
  - Primary: “Find a nearby health facility” (optional future)
  - Primary now: “Consult a doctor at your nearest Family Health Centre”
  - Secondary: “Download my measurements”
  - Secondary: “Restart assessment”

- **Do not allow proceeding** to Step 3 (as per workflow)

### Accessibility Notes

- Do not rely only on color for BMI category; show explicit label.
- Inputs must have unit helper text.
- Large numeric fields should support numeric keypad on mobile.

---

# Page 3A — Step 2 Advisory Stop Page (Conditional)

### When it appears

Triggered when:

- BP elevated **OR**
- Blood sugar elevated
  (Only if user entered those fields)

### Purpose

- Clearly instruct next step: consult a doctor
- Prevent continued scoring to reduce false reassurance
- Allow user to save/download what they entered

### shadcn/ui Components

- `Alert` (primary content)
- `Card` summarising entered vitals
- `Button` group
- `Separator`
- `Dialog` (“Why am I seeing this?”)

### Tailwind Design Details

- Use strong visual hierarchy:
  - Icon + title: `text-rose-900`
  - Background: `bg-rose-50 border-rose-200`

- Buttons:
  - Primary: `bg-emerald-600 hover:bg-emerald-700 text-white` (action-oriented)
  - Secondary: `variant="outline"` for download/restart

### Content

**Title:** “We recommend speaking to a doctor”
**Body:**
“Your entered blood pressure or blood sugar is higher than normal. This tool can’t interpret risk scores safely when these are high. Please consult a doctor at your nearest Family Health Centre for further evaluation.”

**Actions**

- “Download my measurements”
- “Restart assessment”

**Disclaimer block** (required)

---

# Page 4 — Step 3 of 6: NCD Risk Assessment (CBAC – Part A)

### Purpose

Collect CBAC questions, compute score, interpret:

- Score > 4 → high NCD risk → consult advice
- Score ≤ 4 → proceed to lifestyle risk analysis (Step 4)

### Layout

- One card for questions
- A “Score preview” panel at bottom (updates live)
- After submit: show result summary + next action

### shadcn/ui Components

- `Card`
- `RadioGroup` for each question
- `Input` (waist circumference numeric)
- `Popover` or `Dialog` (waist measuring infographic)
- `Badge` for score level
- `Alert` for interpretation
- `Progress`
- `Button` Next

### Tailwind Design Details

**Question blocks**

- Each question in a bordered container:
  - `rounded-lg border border-slate-200 p-4 space-y-3`

- Make radio options full-width and tappable:
  - `rounded-md border border-slate-200 p-3 hover:bg-slate-50`

**Score preview**

- Sticky footer panel (optional on mobile):
  - `bg-white border-t border-slate-200 p-4`

- Score number:
  - `text-2xl font-semibold tabular-nums`

### CBAC Questions & Scoring (As Provided)

1. **Age band score**

- 30–39 → 1
- 40–49 → 2
- 50–59 → 3
- ≥60 → 4
  _(For <30, score 0 — recommended for completeness.)_

2. **Tobacco use**

- Never → 0
- Past/occasional → 1
- Daily → 2

3. **Alcohol (daily)**

- No → 0
- Yes → 1

4. **Waist circumference**

- Show gender-based thresholds
- Include infographic help

Female:

- ≤80 → 0
- 81–90 → 1
- > 90 → 2

Male:

- ≤90 → 0
- 91–100 → 1
- > 100 → 2

**Gender = Other handling (recommended UI)**

- Show a `Select`: “Choose reference chart for waist scoring”
  - “Use female thresholds”
  - “Use male thresholds”

- Explain: “We ask this only to calculate the checklist score.”

5. **Physical activity**

- ≥150 min/week → 0
- <150 min/week → 1

6. **Family history (HTN/DM/Heart disease)**

- No → 0
- Yes → 2

### Decision Rule

- **CBAC Score > 4** → high NCD risk
  - Show consult advice prominently
  - Allow continuation to Step 4/5/6 if program wants (but always keep consult CTA visible)

- **CBAC Score ≤ 4**
  - Encourage lifestyle page

### Content

**Title:** “NCD Risk Check”
**Helper:** “This checklist estimates risk. It does not diagnose disease.”

**Result copy examples**

- Low/Moderate: “Your CBAC score is 3 (lower risk). Focus on healthy habits to reduce future risk.”
- High: “Your CBAC score is 6 (higher risk). Please consult a doctor at a nearby health facility for further evaluation.”

**Disclaimer block** (required)

---

# Page 5 — Step 4 of 6: Lifestyle & Addiction Counselling

### Purpose

Show tailored guidance modules if any trigger is present:

- Tobacco use ≠ Never
- Alcohol use = Yes (daily)
- Physical activity < 150 min/week

If none triggered, show reinforcement and optional “recommended habits” content.

### Layout

- A summary header card: “Your focus areas”
- Then a stack of modules (each module is a card)
- Each module has: why it matters + small action steps + resources

### shadcn/ui Components

- `Card` modules
- `Accordion` for “Learn more”
- `Tabs` (optional) for “Quick tips / Support services”
- `Badge` for “Recommended”
- `Button` (Next)
- `Alert` (gentle tone)

### Tailwind Design Details

- Module cards:
  - `bg-white border border-slate-200 rounded-xl`

- Module headers:
  - Icon + title in `text-slate-900`

- “Recommended” badge:
  - `bg-emerald-50 text-emerald-800 border border-emerald-200`

### Tailored Modules (Content Blueprint)

#### Module A — Tobacco Cessation (triggered)

**Title:** “Support to reduce or stop tobacco”
**Tone:** supportive, non-judgmental
**Quick actions:**

- “Set a quit date”
- “Reduce triggers (after meals, stress moments)”
- “Ask a health worker about cessation support”
  **Resources section:**
- “Government cessation services” (leave link placeholder for local program)

#### Module B — Alcohol De-addiction (triggered)

**Title:** “Support to reduce daily alcohol use”
**Quick actions:**

- “Track how often you drink”
- “Plan alcohol-free days”
- “Seek de-addiction support if cutting down is difficult”
  **Safety note:** If user indicates dependence (optional future question), recommend professional support.

#### Module C — Physical Activity Plan (triggered if <150)

**Title:** “Move more, safely”
**Starter plan examples:**

- Week 1: 10 minutes/day walking, 5 days/week
- Week 2: 15 minutes/day
- Week 3+: Build toward 150 minutes/week
  **Add strength suggestion:** 2 days/week simple bodyweight exercises (gentle)

#### If no triggers

Show:

- “You’re on a good track. Keep it up.”
- Provide optional “Maintenance tips” accordion

---

# Page 6 — Step 5 of 6: Cancer Risk Screening (CBAC Symptoms)

### Purpose

Ask symptom checklist:

- General symptoms (all)
- Women-specific symptoms (only if gender = Female, and optionally if user selects female reference)

If **any** answer = Yes:

- Advise consultation at nearest health facility for evaluation

If all = No:

- Advise screening once in 5 years
- If female: provide self-breast examination information

### Layout

- One card per section:
  - General symptoms
  - Women-specific (conditional)

- Each symptom as a yes/no radio row
- Result banner at bottom after completion

### shadcn/ui Components

- `Card`
- `RadioGroup` for each symptom (Yes/No)
- `Alert` for interpretation
- `Accordion` for “Self-breast exam steps”
- `Badge` “Symptoms reported” / “No symptoms reported”
- `Button` Next
- `Progress`

### Tailwind Design Details

- Symptom rows:
  - `flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3`

- Yes/No controls:
  - Use two `RadioGroupItem` options styled as segmented controls (optional):
    - Yes: highlight with `bg-rose-50 border-rose-200`
    - No: neutral `bg-slate-50 border-slate-200`

### Content: General Symptoms (Men & Women)

- Non-healing ulcers
- Lumps or swellings
- Difficulty swallowing
- Change in voice
- Unexplained weight loss
- Blood in sputum
- Persistent cough (>2 weeks)

### Content: Women-Specific Symptoms (Conditional)

- Lump in the breast
- Nipple discharge
- Change in breast shape
- Post-menopausal bleeding
- Bleeding after intercourse

### Logic & Output Copy

**If any YES**

- Title: “Please consult a doctor”
- Body: “You reported one or more symptoms that need medical evaluation. Please consult a doctor at the nearest health facility for further evaluation.”
- Disclaimer block (required)

**If all NO**

- Title: “No symptoms reported”
- Body: “Consider routine screening once every 5 years. If you notice new symptoms later, consult a health facility.”
- For females: show “Self-breast examination” accordion with simple steps and “Seek help if you find a new lump or change.”

---

# Page 7 — Step 6 of 6: Final Summary & Personalised Advice

### Purpose

Provide a single consolidated output:

1. Parameters entered
2. Risk scores
3. Key advice
4. Customised diet & exercise guidance
   Plus exit options:

- Download PDF
- Restart
- Find nearest facility (future)

### Layout (Highly Scannable)

Use a **dashboard-like** approach:

1. **Summary Header Card**
   - “Your Summary”
   - Date/time (optional)
   - Disclaimer

2. **Section: Measurements**
   - BMI status
   - BP status (if entered)
   - Blood sugar status (if entered)

3. **Section: Risk Scores**
   - CBAC score + interpretation
   - Cancer symptoms flag

4. **Section: Key Advice**
   - Consult CTA (if applicable)
   - Lifestyle advice bullets
   - Addiction advice bullets

5. **Section: Diet & Exercise Plan**
   - Diet tips based on BMI + sugar status
   - Activity plan based on activity level

6. **Actions**
   - Download PDF
   - Restart

### shadcn/ui Components

- `Card` for each section
- `Badge` for statuses
- `Alert` for consult recommendation
- `Separator`
- `Button` (Download, Restart)
- `Accordion` (Diet details, Exercise details)
- `Toast` (“PDF downloaded”)
- `Dialog` (Full disclaimer)

### Tailwind Design Details

- Summary page background: `bg-slate-50`
- Cards: `bg-white border border-slate-200 rounded-xl`
- High risk consult alert:
  - `bg-amber-50 border-amber-200 text-amber-900` (if advisory)
  - `bg-rose-50 border-rose-200 text-rose-900` (if symptoms/high)

- Download button:
  - Primary: `bg-emerald-600 hover:bg-emerald-700 text-white`

- Restart button:
  - `variant="outline"` with `border-slate-300`

### Summary Content Rules

#### 1) Parameters Entered

- Always show BMI
- BP: show either
  - “Not entered” (muted badge) or interpreted status

- Blood sugar: show either
  - “Not entered” or interpreted status + type chosen

#### 2) Risk Scores

- CBAC score: numeric + label
  - `<=4` “Lower risk”
  - `>4` “Higher risk”

- Cancer symptoms:
  - “Symptoms reported: Yes/No”

#### 3) Key Advice (Auto-generated)

Examples of rule-based advice text:

- If BP/sugar elevated earlier: user would not reach here (blocked), unless program later changes gating.
- If CBAC > 4:
  “Please consult a doctor at a nearby health facility for further evaluation.”
- If any cancer symptom YES:
  “Please consult a doctor for evaluation.”
- If tobacco:
  “Consider seeking cessation support; reducing tobacco lowers risk over time.”
- If alcohol daily:
  “Reducing daily alcohol can improve long-term health; consider support services if needed.”
- If low activity:
  “Aim for at least 150 minutes/week of moderate activity, starting gradually.”

#### 4) Customised Diet & Exercise Guidance (Examples)

Keep advice general and safe.

**Based on BMI**

- Underweight:
  - “Add nutrient-dense meals/snacks”
  - “Include protein sources daily”

- Overweight/Obese:
  - “Reduce sugary drinks”
  - “Half plate vegetables”
  - “Portion control”

- Salt reduction (especially if BP elevated was ever entered high—if you later allow summary):
  - “Limit salty packaged foods; taste food before adding salt”

**Based on Blood Sugar status (if entered)**

- If higher than normal:
  - “Choose whole grains, limit sweets”
  - “Don’t skip meals; prefer steady meal timing”
  - “Consult a doctor for proper testing”

**Based on activity level**

- Sedentary:
  - “Start with 10 minutes/day walking”

- Moderate:
  - “Add 1–2 longer walks/week”

- Adequate:
  - “Maintain; add strength twice weekly”

### Disclaimer (Required)

Place at top of summary and again before download:
“This tool provides general risk information and is not a diagnosis…”

---

## 6) Download Summary (PDF) — Output Design

### Trigger

From Step 6: “Download summary (PDF)”

### Contents

- Campaign header (logo + title)
- Date generated
- Parameters entered + statuses
- CBAC score + interpretation
- Cancer symptom flag
- Key advice (consult/lifestyle)
- Disclaimer and privacy note

### Design

- Clean A4 layout, big headings, clear sections
- Use the same semantic color cues but ensure print-friendly:
  - Use icons + labels rather than only color

- Include QR/code placeholder for “Find nearest facility” (future)

### shadcn/ui UX Pattern

- Use `Dialog` to confirm:
  - “This PDF will be saved on your device.”
  - Buttons: “Download” / “Cancel”

---

## 7) Cross-Cutting: States, Validation, and Accessibility

### 7.1 Form Validation (All Steps)

- Inline validation below fields (`text-xs text-rose-600`)
- Do not use scary error language
- Examples:
  - “Please enter a valid height in cm.”
  - “This value looks unusual—please double-check.”

### 7.2 Empty / Skipped States

- Use `Badge` with muted styling:
  - `bg-slate-100 text-slate-600 border border-slate-200`

- Label: “Not entered”

### 7.3 Accessibility Requirements

- Minimum tap target height: `min-h-11`
- Color is never the only signal
- All inputs have labels (`Label`)
- Stepper uses both number and text (“Step 3 of 6”)
- Dialogs trap focus (shadcn default)
- Icons must include screen-reader labels where needed

---

## 8) Developer Notes (Non-Functional Requirements)

### 8.1 Mobile-first

- Single column, sticky bottom action bar for Next
- Avoid long scrolling inside dialogs; use `ScrollArea` if needed

### 8.2 Performance

- No heavy libraries
- Keep computations simple and local
- Debounce derived calculations (BMI) for smooth typing

### 8.3 Analytics (Optional, Anonymised)

Only track:

- Assessment started
- Step completion counts
- How many users skipped BP/sugar
- How many users triggered advisory / high CBAC / symptom yes
  No raw values, no identifiers.

### 8.4 Data Handling

- Store in memory; optionally `sessionStorage`
- Clear storage on “Restart”
- PDF generation uses current session state

---

## 9) Component-Level Blueprint (Quick Mapping)

- **AppShell**
  - Header: logo + stepper (`Progress`, `Badge`)
  - Main: `Card` based sections
  - Footer: privacy/disclaimer links

- **Reusable Blocks**
  - `DisclaimerAlert` (required on results pages)
  - `StatusBadge` (Normal/Elevated/High)
  - `InlineInterpretationRow` (label + result + badge)
  - `HelpPopover` (waist measuring / sugar type info)

---

## 10) What “Done” Looks Like (Acceptance Criteria)

- Landing page clearly communicates 5-minute self-check + disclaimer + privacy
- Stepper works and reflects 1–6
- BP and sugar are truly optional
- Entering elevated BP/sugar reliably routes to advisory stop state and prevents Step 3
- CBAC scoring matches provided scoring table and threshold (>4)
- Lifestyle guidance displays only relevant modules (and a positive message when none)
- Cancer symptom logic triggers consult advice if any yes
- Final summary compiles all states correctly and supports PDF export
- Accessible on mobile, color-blind friendly, and does not collect identifiers
