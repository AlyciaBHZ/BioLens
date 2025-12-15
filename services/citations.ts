export type Citation = {
  key: string;
  title: string;
  venue?: string;
  year?: number;
  url?: string;
  snippet: string;
  note?: string;
};

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/^ref:\s*/i, '')
    .replace(/^\[|\]$/g, '')
    .replace(/\s+/g, ' ');

const registry: Record<string, Citation> = {
  acmg: {
    key: 'ACMG',
    title:
      'Standards and guidelines for the interpretation of sequence variants: a joint consensus recommendation of the ACMG and AMP',
    venue: 'Genetics in Medicine',
    year: 2015,
    url: 'https://pubmed.ncbi.nlm.nih.gov/25741868/',
    snippet:
      '“This report recommends the use of specific standard terminology-"pathogenic," "likely pathogenic," "uncertain significance," "likely benign," and "benign"-to describe variants identified in genes that cause Mendelian disorders.”',
    note: 'Use for variant classification terminology and criteria framing (ACMG/AMP 2015).',
  },
  cpic: {
    key: 'CPIC',
    title: 'CPIC Guideline for CYP2C19 and Clopidogrel Therapy (Update)',
    venue: 'Clinical Pharmacology & Therapeutics',
    year: 2022,
    url: 'https://cpicpgx.org/guidelines/',
    snippet:
      'CPIC guidelines provide peer-reviewed, genotype-based drug therapy recommendations to help clinicians understand how available genetic test results should be used to optimize drug therapy.',
    note: 'Use for pharmacogenomic recommendations around CYP2C19 and antiplatelet selection.',
  },
  endo: {
    key: 'Endocrine Society (Vit D)',
    title: 'Evaluation, treatment, and prevention of vitamin D deficiency: an Endocrine Society clinical practice guideline',
    venue: 'J Clin Endocrinol Metab',
    year: 2011,
    url: 'https://pubmed.ncbi.nlm.nih.gov/21646368/',
    snippet:
      '“The Task Force also suggested the measurement of serum 25-hydroxyvitamin D level by a reliable assay as the initial diagnostic test in patients at risk for deficiency. Treatment with either vitamin D(2) or vitamin D(3) was recommended for deficient patients.”',
    note: 'Use for diagnostic/treatment framing of vitamin D deficiency (Endocrine Society 2011).',
  },
  'endo 2011': {
    key: 'Endocrine Society (Vit D)',
    title: 'Evaluation, treatment, and prevention of vitamin D deficiency: an Endocrine Society clinical practice guideline',
    venue: 'J Clin Endocrinol Metab',
    year: 2011,
    url: 'https://pubmed.ncbi.nlm.nih.gov/21646368/',
    snippet:
      '“The Task Force also suggested the measurement of serum 25-hydroxyvitamin D level by a reliable assay as the initial diagnostic test in patients at risk for deficiency. Treatment with either vitamin D(2) or vitamin D(3) was recommended for deficient patients.”',
    note: 'Use for diagnostic/treatment framing of vitamin D deficiency (Endocrine Society 2011).',
  },
  'cpic guidelines': {
    key: 'CPIC',
    title: 'CPIC Guideline for CYP2C19 and Clopidogrel Therapy (Update)',
    venue: 'Clinical Pharmacology & Therapeutics',
    year: 2022,
    url: 'https://cpicpgx.org/guidelines/',
    snippet:
      'CPIC guidelines provide peer-reviewed, genotype-based drug therapy recommendations to help clinicians understand how available genetic test results should be used to optimize drug therapy.',
    note: 'Use for pharmacogenomic recommendations around CYP2C19 and antiplatelet selection.',
  },
  'acc/aha 2022': {
    key: 'ACC/AHA 2022',
    title: 'ACC/AHA Guideline (Reference Stub)',
    year: 2022,
    url: 'https://www.ahajournals.org/',
    snippet:
      'Add the exact guideline and excerpt you want to present here (this is a placeholder stub for the demo UI).',
    note: 'Replace with the specific ACC/AHA document and quoted excerpt used by this insight.',
  },
};

export const getCitation = (rawKey: string): Citation | undefined => registry[normalize(rawKey)];

export const listCitationKeys = () => Object.keys(registry);
