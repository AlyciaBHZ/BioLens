import { PatientProfile, ResearchPaper, ClinicianActionItem } from '../types';

export const mockPatient: PatientProfile = {
  id: 'P-1024',
  name: 'Jane Doe',
  age: 34,
  healthScore: 78,
  riskLevel: 'Medium',
  lastVisit: '2023-10-15',
  labResults: [
    {
      id: 'L1',
      name: 'LDL Cholesterol',
      value: 145,
      unit: 'mg/dL',
      range: [0, 100],
      status: 'warning',
      aiAnalysis: "Elevated. Correlates with APOE ε4 variant presence.",
    },
    {
      id: 'L2',
      name: 'Vitamin D (25-OH)',
      value: 18,
      unit: 'ng/mL',
      range: [30, 100],
      status: 'critical',
      aiAnalysis: "Critical deficiency. VDR Taq1 homozygote suggests 30% reduced receptor density.",
    },
    {
      id: 'L3',
      name: 'hs-CRP',
      value: 0.8,
      unit: 'mg/L',
      range: [0, 1],
      status: 'optimal',
      aiAnalysis: "Inflammatory baseline nominal.",
    }
  ],
  geneTraits: [
    {
      gene: 'VDR',
      variant: 'rs731236 (Taq1)',
      impact: 'Receptor Density',
      description: 'Homozygous variant associated with reduced Vitamin D receptor density and lower circulating levels.',
    },
    {
      gene: 'CYP2C19',
      variant: '*2/*3',
      impact: 'Poor Metabolizer',
      description: 'Loss-of-function alleles. FDA Table 1 Actionable Pharmacogenetic interaction.',
      drugInteraction: {
        drug: 'Clopidogrel',
        warning: 'Therapeutic failure likely. Risk of stent thrombosis.',
        severity: 'high'
      }
    }
  ],
  wearableData: [
    { date: '2023-11-01', sleepQuality: 65, stressLevel: 45 },
    { date: '2023-11-02', sleepQuality: 70, stressLevel: 40 },
    { date: '2023-11-03', sleepQuality: 55, stressLevel: 75 },
    { date: '2023-11-04', sleepQuality: 80, stressLevel: 30 },
    { date: '2023-11-05', sleepQuality: 75, stressLevel: 35 },
    { date: '2023-11-06', sleepQuality: 85, stressLevel: 20 },
    { date: '2023-11-07', sleepQuality: 82, stressLevel: 25 },
  ]
};

// Historical data for charts
export const vitaminDHistory = [
  { date: 'Jan', value: 28, range: [30, 100] },
  { date: 'Mar', value: 25, range: [30, 100] },
  { date: 'May', value: 22, range: [30, 100] },
  { date: 'Jul', value: 20, range: [30, 100] },
  { date: 'Sep', value: 19, range: [30, 100] },
  { date: 'Nov', value: 18, range: [30, 100] },
];

export const symptomHeatmap = Array.from({ length: 28 }, (_, i) => ({
  day: i + 1,
  intensity: Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0, // 0-4 scale
  type: Math.random() > 0.5 ? 'Migraine' : 'Fatigue'
}));

export const mockPatientsList: PatientProfile[] = [
  mockPatient,
  {
    ...mockPatient,
    id: 'P-1025',
    name: 'Robert Fox',
    age: 52,
    healthScore: 45,
    riskLevel: 'High',
  },
  {
    ...mockPatient,
    id: 'P-1026',
    name: 'Esther Howard',
    age: 28,
    healthScore: 92,
    riskLevel: 'Low',
  },
];

export const relevantPapers: ResearchPaper[] = [
  {
    title: "CPIC Guideline for CYP2C19 and Clopidogrel Therapy",
    journal: "Clinical Pharmacology & Therapeutics",
    year: 2022,
    relevance: "Guideline",
    url: "#"
  }
];