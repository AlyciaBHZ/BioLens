import { mockPatient } from './mockData';

export type AskSignal = 'CYP2C19' | 'VDR';

export type AskAction =
  | { type: 'navigate'; to: 'patient-lab' | 'patient-dashboard'; label: string };

export type AskResult = {
  title: string;
  source: string;
  detail: string;
  type: 'warning' | 'info';
  signal?: AskSignal;
  actions?: AskAction[];
  followUps?: string[];
};

const includesAny = (haystack: string, needles: string[]) => needles.some((n) => haystack.includes(n));

export const defaultAskSuggestions = [
  'Can I take clopidogrel?',
  'Why is my Vitamin D low?',
  'Do I have risky variants?',
  'What should I do next?',
  '我可以吃氯吡格雷（波立维）吗？',
  '我的维生素 D 为什么这么低？',
  '我有哪些高风险基因变异？',
];

export const routeMockAsk = (raw: string): AskResult => {
  const question = raw.trim();
  const normalized = question.toLowerCase();
  const truncated = question.length > 64 ? `${question.slice(0, 64)}…` : question;
  const source = `QUERY: ${truncated}`;

  const vitaminDLab = mockPatient.labResults.find((l) => l.name.toLowerCase().includes('vitamin d'));
  const vdrTrait = mockPatient.geneTraits.find((t) => t.gene === 'VDR');
  const cypTrait = mockPatient.geneTraits.find((t) => t.gene === 'CYP2C19');

  const wantsClopidogrel = includesAny(normalized, ['clopidogrel', 'plavix', 'cyp2c19', '氯吡格雷', '波立维']);
  if (wantsClopidogrel && cypTrait) {
    return {
      title: 'PGx: Clopidogrel response risk',
      source,
      detail: `Detected genotype ${cypTrait.gene} ${cypTrait.variant} (${cypTrait.impact}). Clopidogrel activation may be reduced; consider guideline-backed alternatives and clinician review. [Ref: CPIC]`,
      type: 'warning',
      signal: 'CYP2C19',
      followUps: [
        'What alternative antiplatelets are recommended for CYP2C19 poor metabolizers?',
        'Should I change dose or switch drugs?',
      ],
    };
  }

  const asksVitaminD = includesAny(normalized, [
    'vitamin d',
    'vit d',
    '25-oh',
    '25 oh',
    '25(oh)d',
    'vdr',
    '维生素d',
    '维生素 d',
    '25羟维生素d',
    '25-羟维生素d',
  ]);
  if (asksVitaminD && vitaminDLab) {
    const range = vitaminDLab.range ? `${vitaminDLab.range[0]}-${vitaminDLab.range[1]}` : 'n/a';
    const vdr = vdrTrait ? `${vdrTrait.gene} ${vdrTrait.variant}` : 'VDR variant';
    return {
      title: 'Lab: Vitamin D deficiency (guided)',
      source,
      detail: `Latest 25(OH)D: ${vitaminDLab.value} ${vitaminDLab.unit} (target range ${range}). Genomic context: ${vdr}. Recommended next step is evidence-linked testing + dosing plan and scheduled re-check. [Ref: ENDO 2011]`,
      type: 'warning',
      signal: 'VDR',
      actions: [{ type: 'navigate', to: 'patient-lab', label: 'Open Vitamin D lab detail' }],
      followUps: ['How much Vitamin D should I take?', 'How long until I re-test 25(OH)D?'],
    };
  }

  const asksBrca = includesAny(normalized, [
    'brca1',
    'brca2',
    'brca',
    'hereditary breast',
    'hereditary ovarian',
    '乳腺癌',
    '卵巢癌',
    '遗传性',
  ]);
  if (asksBrca) {
    return {
      title: 'Genetics: BRCA1/2 risk framing (demo)',
      source,
      detail:
        'BRCA1/2 are tumor-suppressor genes associated with hereditary breast/ovarian cancer predisposition. Risk depends on the *specific* variant and its classification (pathogenic/likely pathogenic/VUS) plus family history. Upload your 23andMe (.txt) or VCF to flag BRCA loci and attach an evidence trail for interpretation framing. [Ref: ACMG]',
      type: 'info',
      followUps: [
        'What does VUS mean for BRCA?',
        'Should I confirm a BRCA finding with a clinical lab?',
        'Which file should I upload (23andMe vs VCF)?',
      ],
    };
  }

  const mentionsAspirin = includesAny(normalized, ['aspirin', 'asa', '阿司匹林']);
  const mentionsResistance = includesAny(normalized, [
    'resistance',
    'nonresponse',
    'non-response',
    '耐药',
    '无效',
    '不起作用',
  ]);
  if (mentionsAspirin && mentionsResistance) {
    return {
      title: 'Drug response: Aspirin “resistance” (demo)',
      source,
      detail:
        '“Aspirin resistance” is not a single diagnosis; apparent non-response can be driven by adherence, dosing, drug interactions, and platelet biology. In this demo, treat it as a prompt to review therapy with a clinician and consider (when appropriate) platelet function testing rather than changing meds based on genetics alone. If you meant clopidogrel response, ask about CYP2C19. [Ref: ACC/AHA 2022]',
      type: 'info',
      followUps: [
        'What can cause aspirin non-response?',
        'Do genetics predict aspirin response?',
        'How is platelet function testing done?',
      ],
    };
  }

  const asksVariants = includesAny(normalized, [
    'mutation',
    'mutations',
    'variant',
    'variants',
    'genome',
    'vcf',
    '基因',
    '突变',
    '变异',
  ]);
  if (asksVariants) {
    const list = mockPatient.geneTraits.map((t) => `${t.gene} ${t.variant} (${t.impact})`).join(' · ');
    return {
      title: 'Detected loci (summary)',
      source,
      detail: `Flagged items in this demo profile: ${list}. Variant interpretation labels should follow standard terminology and criteria. [Ref: ACMG]`,
      type: 'info',
      followUps: ['Which variants are actionable?', 'What does "pathogenic" vs "VUS" mean?'],
    };
  }

  const asksNext = includesAny(normalized, [
    'what should i do',
    'next step',
    'next',
    'what now',
    '怎么办',
    '我该怎么办',
    '下一步',
    '我该怎么做',
  ]);
  if (asksNext) {
    return {
      title: 'Guided next steps',
      source,
      detail:
        '1) Review medication response risks (PGx) for CYP2C19 before taking clopidogrel. [Ref: CPIC]\n2) Treat vitamin D deficiency and re-check 25(OH)D on schedule. [Ref: ENDO 2011]',
      type: 'info',
      actions: [{ type: 'navigate', to: 'patient-dashboard', label: 'Open dashboard signals' }],
      followUps: ['Summarize my top risks in one paragraph.', 'Which lab should I repeat first?'],
    };
  }

  const asksUpload = includesAny(normalized, [
    'upload',
    'pdf',
    'bloodwork',
    'report',
    'lab report',
    'vcf',
    '23andme',
    '23 and me',
    'raw data',
    'txt',
    'png',
    'jpg',
    'jpeg',
    'image',
    '上传',
    '报告',
    '化验单',
    '体检',
    '检验',
    '图片',
  ]);
  if (asksUpload) {
    return {
      title: 'Upload intake (demo)',
      source,
      detail:
        'Use the paperclip icon to upload lab reports (PDF/PNG/JPG) or genome data (23andMe .txt / VCF). Files are queued for analysis in this demo UI.',
      type: 'info',
      followUps: ['What file types are supported?', 'Can you parse 23andMe raw data?', 'Can I upload a lab PDF?'],
    };
  }

  return {
    title: 'Ask BioLens (examples)',
    source,
    detail: `Try:\n- "Can I take clopidogrel?"\n- "Why is my Vitamin D low?"\n- "Do I have risky variants?"\n- "What should I do next?"`,
    type: 'info',
    followUps: defaultAskSuggestions,
  };
};
