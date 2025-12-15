export type Role = 'patient' | 'clinician' | null;

export interface LabResult {
  id: string;
  name: string;
  value: number;
  unit: string;
  range: [number, number]; // min, max
  status: 'optimal' | 'warning' | 'critical';
  aiAnalysis: string;
}

export interface GeneTrait {
  gene: string;
  variant: string;
  impact: string;
  description: string;
  drugInteraction?: {
    drug: string;
    warning: string;
    severity: 'low' | 'medium' | 'high';
  };
}

export interface DailyLog {
  date: string;
  painLevel: number; // 1-10
  symptoms: string[];
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  healthScore: number; // 0-100
  riskLevel: 'Low' | 'Medium' | 'High';
  lastVisit: string;
  labResults: LabResult[];
  geneTraits: GeneTrait[];
  wearableData: {
    date: string;
    sleepQuality: number; // 0-100
    stressLevel: number; // 0-100
  }[];
}

export interface ClinicianActionItem {
  id: string;
  patientName: string;
  action: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ResearchPaper {
  title: string;
  journal: string;
  year: number;
  relevance: string;
  url: string;
}