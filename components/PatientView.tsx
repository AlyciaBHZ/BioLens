import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceArea } from 'recharts';
import { AlertTriangle, Database, Zap, ArrowRight, Dna, Activity, Terminal, ChevronRight } from 'lucide-react';
import { mockPatient, vitaminDHistory, symptomHeatmap } from '../services/mockData';
import { CitationText } from './CitationText';

// --- VISUALIZATION COMPONENTS ---

type GenomicTrackProps = {
  gene: string;
  variant: string;
  impact: string;
  isLinked?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
};

const GenomicTrack: React.FC<GenomicTrackProps> = ({ gene, variant, impact, isLinked, onHoverStart, onHoverEnd }) => (
  <div
    onMouseEnter={onHoverStart}
    onMouseLeave={onHoverEnd}
    className={`bg-science-900 border rounded-sm p-3 mb-3 relative overflow-hidden group transition-colors ${
      isLinked ? 'border-bio-blue shadow-glow-blue' : 'border-science-800 hover:border-science-700'
    }`}
  >
    <div className="flex justify-between items-center mb-2">
       <div className="flex items-center gap-2">
          <Dna className="w-4 h-4 text-bio-purple" />
          <span className="relative inline-flex items-center">
            <span className="absolute inset-0 rounded-sm border border-science-800 bg-science-950/60 bg-[repeating-linear-gradient(90deg,rgba(163,163,163,0.18)_0,rgba(163,163,163,0.18)_1px,transparent_1px,transparent_10px)]"></span>
            <span className="absolute inset-y-0 left-1/2 w-px bg-bio-blue/30"></span>
            <span className="relative px-2 py-0.5 text-sm font-mono font-bold text-science-100">{gene}</span>
          </span>
       </div>
       <span className="text-xs font-mono text-bio-red bg-bio-red/10 px-2 py-0.5 border border-bio-red/20 rounded-sm">{variant}</span>
    </div>
    
    {/* Abstract representation of a gene track */}
    <div className="relative h-8 w-full bg-science-950 border border-science-800 flex items-center px-2 mb-2">
       {/* Gene Body */}
       <div className="h-2 w-full bg-science-800 rounded-sm relative">
          {/* Exons */}
          <div className="absolute left-[10%] w-[15%] h-full bg-science-600"></div>
          <div className="absolute left-[35%] w-[10%] h-full bg-science-600"></div>
          <div className="absolute left-[60%] w-[20%] h-full bg-science-600"></div>
          
          {/* Variant Marker (The Red Line) */}
          <div className="absolute left-[65%] -top-2 h-6 w-0.5 bg-bio-red shadow-[0_0_8px_rgba(255,42,109,0.8)] animate-pulse"></div>
       </div>
       {/* Coordinates */}
       <span className="absolute bottom-0 right-1 text-[9px] font-mono text-science-700">chr12:48,231,211</span>
    </div>

    <div className="flex items-center justify-between text-xs text-science-300">
       <span>Impact: <span className="text-science-100 font-bold">{impact}</span></span>
       <span className="text-[10px] font-mono">CLINVAR_SIG: PATHOGENIC</span>
    </div>
  </div>
);

const LabTrendChart = ({ title, data, unit, color }: { title: string, data: any[], unit: string, color: string }) => (
  <div className="bg-science-900 border border-science-800 rounded-sm p-3 pointer-events-none">
    <div className="flex justify-between items-end mb-2">
      <h3 className="text-xs font-mono text-science-300 uppercase tracking-widest">{title}</h3>
      <span className="text-lg font-mono font-bold text-science-100 tabular-nums">
        {data[data.length - 1].value} <span className="text-xs text-science-500 font-normal">{unit}</span>
      </span>
    </div>
    <div className="h-28 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
          <XAxis dataKey="date" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} fontFamily="JetBrains Mono" />
          <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} width={25} fontFamily="JetBrains Mono" domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', fontSize: '12px', fontFamily: 'JetBrains Mono' }}
            itemStyle={{ color: '#e5e5e5' }}
          />
          {/* Reference Range Band */}
          <ReferenceArea y1={30} y2={100} fill="#10b981" fillOpacity={0.05} />
          <Line 
            type="step" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2} 
            dot={{fill: '#0a0a0a', stroke: color, strokeWidth: 2, r: 3}} 
            activeDot={{r: 5, fill: color}}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const HeatmapLog = () => (
    <div className="bg-science-900 border border-science-800 rounded-sm p-3 h-full">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-mono text-science-300 uppercase tracking-widest">Phenotype Log</h3>
            <button className="text-[10px] font-mono text-bio-blue border border-bio-blue/30 px-2 py-0.5 hover:bg-bio-blue/10 transition-colors">
                + LOG_ENTRY
            </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-3">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-[10px] text-center text-science-500 font-mono">{d}</div>
            ))}
            {symptomHeatmap.map((day, i) => (
                <div 
                    key={i} 
                    className={`aspect-square w-full relative group
                        ${day.intensity === 0 ? 'bg-science-800/30' : 
                          day.intensity < 3 ? 'bg-bio-blue/30 border border-bio-blue/50' : 
                          'bg-bio-red/40 border border-bio-red/60 animate-pulse-slow'}
                    `}
                >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-science-950 border border-science-700 text-[10px] text-science-100 whitespace-nowrap hidden group-hover:block z-10 font-mono">
                        Day {day.day}: {day.intensity > 0 ? `${day.type} (${day.intensity}/5)` : 'No Symptoms'}
                    </div>
                </div>
            ))}
        </div>
        
        <div className="space-y-1.5 pt-3 border-t border-science-800">
             <div className="flex items-center gap-2 text-[11px] text-science-300 font-mono">
                <span className="w-2 h-2 bg-bio-red/40 border border-bio-red/60"></span>
                <span>HIGH_INTENSITY</span>
             </div>
             <div className="flex items-center gap-2 text-[11px] text-science-300 font-mono">
                <span className="w-2 h-2 bg-bio-blue/30 border border-bio-blue/50"></span>
                <span>LOW_INTENSITY</span>
             </div>
        </div>
    </div>
);

interface AlertCardProps {
    title: string;
    source: string;
    detail: string;
    type?: 'warning' | 'info';
    onClick?: () => void;
    isLinked?: boolean;
}

const AlertCard: React.FC<AlertCardProps> = ({ title, source, detail, type = 'warning', onClick, isLinked }) => {
    const linkedAccent =
      type === 'warning'
        ? 'ring-1 ring-bio-red/40 shadow-glow-red bg-bio-red/10'
        : 'ring-1 ring-bio-blue/40 shadow-glow-blue bg-bio-blue/10';

    return (
    <div 
        onClick={onClick}
        className={`p-3 rounded-sm border-l-2 ${type === 'warning' ? 'border-bio-red bg-bio-red/5' : 'border-bio-blue bg-bio-blue/5'} mb-2 hover:bg-science-800/50 transition-colors cursor-pointer group relative overflow-hidden ${
          isLinked ? linkedAccent : ''
        }`}
    >
        {/* Interactive Hover Highlight */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        
        <div className="flex items-start gap-2">
            <div className={`mt-0.5 ${type === 'warning' ? 'text-bio-red' : 'text-bio-blue'}`}>
                {type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
            </div>
            <div className="flex-1">
                <h4 className={`text-xs font-bold font-mono uppercase mb-0.5 ${type === 'warning' ? 'text-bio-red' : 'text-bio-blue'}`}>
                    {title}
                </h4>
                <p className="text-[11px] text-science-300 mb-1.5 leading-relaxed">
                    SOURCE: <span className="text-science-100 font-mono">{source}</span>
                </p>
                <p className="text-[13px] text-science-100 leading-relaxed border-l border-science-700 pl-2">
                    <CitationText text={detail} />
                </p>
                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-science-500 font-mono underline cursor-pointer hover:text-bio-blue">VIEW_DATA_SOURCE_&gt;&gt;</span>
                </div>
            </div>
        </div>
    </div>
    );
};

interface PatientViewProps {
    onNavigate: (path: 'patient-dashboard' | 'patient-lab') => void;
}

export const PatientView: React.FC<PatientViewProps> = ({ onNavigate }) => {
  type LinkedSignal = 'CYP2C19' | 'VDR';

  const [linkedSignal, setLinkedSignal] = useState<LinkedSignal | null>(null);
  const [pinnedSignal, setPinnedSignal] = useState<LinkedSignal | null>(null);
  const [queryText, setQueryText] = useState('');
  const [queryResult, setQueryResult] = useState<{
    title: string;
    source: string;
    detail: string;
    type: 'warning' | 'info';
    signal?: LinkedSignal;
    onClick?: () => void;
  } | null>(null);

  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const feedRef = useRef<HTMLDivElement | null>(null);
  const geneCypRef = useRef<HTMLDivElement | null>(null);
  const geneVdrRef = useRef<HTMLDivElement | null>(null);
  const alertCypRef = useRef<HTMLDivElement | null>(null);
  const alertVdrRef = useRef<HTMLDivElement | null>(null);
  const overlayRafRef = useRef<number | null>(null);

  const [linkOverlay, setLinkOverlay] = useState<{
    id: 'CYP2C19' | 'VDR';
    path: string;
    color: string;
    width: number;
    height: number;
  } | null>(null);

  const computeOverlay = useCallback((signal: 'CYP2C19' | 'VDR') => {
    const container = dashboardRef.current;
    const source = signal === 'CYP2C19' ? geneCypRef.current : geneVdrRef.current;
    const target = signal === 'CYP2C19' ? alertCypRef.current : alertVdrRef.current;
    if (!container || !source || !target) return null;

    const containerRect = container.getBoundingClientRect();
    const sourceRect = source.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const x1 = sourceRect.right - containerRect.left;
    const y1 = sourceRect.top + sourceRect.height * 0.35 - containerRect.top;
    const x2 = targetRect.left - containerRect.left;
    const y2 = targetRect.top + targetRect.height * 0.35 - containerRect.top;

    const dx = Math.min(320, Math.max(90, Math.abs(x2 - x1) * 0.45));
    const sign = x2 >= x1 ? 1 : -1;
    const c1x = x1 + sign * dx;
    const c1y = y1;
    const c2x = x2 - sign * dx;
    const c2y = y2;

    return {
      id: signal,
      path: `M ${x1} ${y1} C ${c1x} ${c1y} ${c2x} ${c2y} ${x2} ${y2}`,
      color: signal === 'CYP2C19' ? '#ff2a6d' : '#00f2ff',
      width: Math.max(0, containerRect.width),
      height: Math.max(0, containerRect.height),
    };
  }, []);

  const scheduleOverlayUpdate = useCallback(() => {
    if (overlayRafRef.current != null) return;
    overlayRafRef.current = window.requestAnimationFrame(() => {
      overlayRafRef.current = null;
      if (!linkedSignal) {
        setLinkOverlay(null);
        return;
      }
      setLinkOverlay(computeOverlay(linkedSignal));
    });
  }, [computeOverlay, linkedSignal]);

  useEffect(() => {
    scheduleOverlayUpdate();
  }, [linkedSignal, scheduleOverlayUpdate]);

  useEffect(() => {
    const onResize = () => scheduleOverlayUpdate();
    window.addEventListener('resize', onResize);
    const feed = feedRef.current;
    feed?.addEventListener('scroll', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      feed?.removeEventListener('scroll', onResize);
      if (overlayRafRef.current != null) {
        window.cancelAnimationFrame(overlayRafRef.current);
        overlayRafRef.current = null;
      }
    };
  }, [scheduleOverlayUpdate]);

  const clearPinned = useCallback(() => {
    setPinnedSignal(null);
    setLinkedSignal(null);
  }, []);

  const routeQuery = useCallback(
    (raw: string) => {
      const question = raw.trim();
      const normalized = question.toLowerCase();
      const truncated = question.length > 64 ? `${question.slice(0, 64)}…` : question;
      const source = `QUERY: ${truncated}`;

      const vitaminDLab = mockPatient.labResults.find((l) => l.name.toLowerCase().includes('vitamin d'));
      const vdrTrait = mockPatient.geneTraits.find((t) => t.gene === 'VDR');
      const cypTrait = mockPatient.geneTraits.find((t) => t.gene === 'CYP2C19');

      const wantsClopidogrel =
        normalized.includes('clopidogrel') ||
        normalized.includes('plavix') ||
        normalized.includes('cyp2c19') ||
        normalized.includes('氯吡格雷') ||
        normalized.includes('波立维') ||
        normalized.includes('抗血小板');

      if (wantsClopidogrel && cypTrait) {
        return {
          title: 'PGX: Clopidogrel response risk',
          source,
          detail: `Detected genotype ${cypTrait.gene} ${cypTrait.variant} (${cypTrait.impact}). Clopidogrel activation may be reduced; consider guideline-backed alternatives and clinician review. [Ref: CPIC]`,
          type: 'warning' as const,
          signal: 'CYP2C19' as const,
        };
      }

      const asksVitaminD =
        normalized.includes('vitamin d') ||
        normalized.includes('25-oh') ||
        normalized.includes('25 oh') ||
        normalized.includes('vdr') ||
        normalized.includes('维生素d') ||
        normalized.includes('维生素 d') ||
        normalized.includes('维d') ||
        normalized.includes('维 d');

      if (asksVitaminD && vitaminDLab) {
        const range = vitaminDLab.range ? `${vitaminDLab.range[0]}–${vitaminDLab.range[1]}` : '—';
        const vdr = vdrTrait ? `${vdrTrait.gene} ${vdrTrait.variant}` : 'VDR variant';
        return {
          title: 'Lab: Vitamin D deficiency (guided)',
          source,
          detail: `Latest 25(OH)D: ${vitaminDLab.value} ${vitaminDLab.unit} (target range ${range}). Genomic context: ${vdr}. Recommended next step is evidence-linked testing + dosing plan and scheduled re-check. [Ref: ENDO 2011]`,
          type: 'warning' as const,
          signal: 'VDR' as const,
          onClick: () => onNavigate('patient-lab'),
        };
      }

      const asksVariants =
        normalized.includes('mutation') ||
        normalized.includes('mutations') ||
        normalized.includes('variant') ||
        normalized.includes('variants') ||
        normalized.includes('genome') ||
        normalized.includes('基因') ||
        normalized.includes('突变') ||
        normalized.includes('变异');

      if (asksVariants) {
        const list = mockPatient.geneTraits
          .map((t) => `${t.gene} ${t.variant} (${t.impact})`)
          .join(' • ');
        return {
          title: 'Detected loci (summary)',
          source,
          detail: `Flagged items in this demo profile: ${list}. Variant interpretation labels should follow standard terminology and criteria. [Ref: ACMG]`,
          type: 'info' as const,
        };
      }

      const asksNext =
        normalized.includes('what should i do') ||
        normalized.includes('next step') ||
        normalized.includes('next') ||
        normalized.includes('怎么办') ||
        normalized.includes('下一步') ||
        normalized.includes('怎么做');

      if (asksNext) {
        return {
          title: 'Guided next steps',
          source,
          detail:
            '1) Review medication response risks (PGx) for CYP2C19 before taking clopidogrel. [Ref: CPIC]\n2) Treat vitamin D deficiency and re-check 25(OH)D on schedule. [Ref: ENDO 2011]',
          type: 'info' as const,
        };
      }

      return {
        title: 'Ask BioLens (examples)',
        source,
        detail:
          'Try: “Can I take clopidogrel?” • “Why is my Vitamin D low?” • “Do I have risky variants?” • “What should I do next?”',
        type: 'info' as const,
      };
    },
    [onNavigate]
  );

  const submitQuery = useCallback(
    (raw: string) => {
      const cleaned = raw.trim();
      if (!cleaned) return;
      const result = routeQuery(cleaned);
      setQueryResult(result);
      setQueryText('');
      setPinnedSignal(result.signal ?? null);
      setLinkedSignal(result.signal ?? null);
      window.requestAnimationFrame(() => {
        feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
    [routeQuery]
  );

  useEffect(() => {
    const onAsk = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail !== 'string') return;
      submitQuery(detail);
    };
    window.addEventListener('biolens:ask', onAsk as EventListener);
    return () => window.removeEventListener('biolens:ask', onAsk as EventListener);
  }, [submitQuery]);

  return (
    <div
      ref={dashboardRef}
      className="relative grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1600px] mx-auto animate-in fade-in duration-500"
    >
      {linkOverlay ? (
        <svg
          className="absolute inset-0 pointer-events-none z-0"
          width={linkOverlay.width}
          height={linkOverlay.height}
          viewBox={`0 0 ${linkOverlay.width} ${linkOverlay.height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="biolens-link-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={linkOverlay.color} stopOpacity="0.12" />
              <stop offset="50%" stopColor={linkOverlay.color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={linkOverlay.color} stopOpacity="0.12" />
            </linearGradient>
            <filter id="biolens-link-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            id="biolens-link-path"
            d={linkOverlay.path}
            fill="none"
            stroke="url(#biolens-link-gradient)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="8 10"
            strokeDashoffset={0}
            filter="url(#biolens-link-glow)"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="1.15s" repeatCount="indefinite" />
          </path>

          <circle r={3.5} fill={linkOverlay.color} opacity="0.9" filter="url(#biolens-link-glow)">
            <animateMotion dur="1.15s" repeatCount="indefinite">
              <mpath href="#biolens-link-path" />
            </animateMotion>
          </circle>
        </svg>
      ) : null}
      
      {/* COLUMN 1: BIO-CONTEXT (Gene + Lab) - Width 4/12 */}
      <div className="lg:col-span-4 space-y-4 relative z-10">
         <div className="flex items-center gap-2 mb-2 text-science-300">
            <Database className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">Integrated Biomarkers</span>
         </div>

         {/* Stack 1: VDR / Vitamin D */}
         <div
           ref={geneVdrRef}
           className="group cursor-pointer"
           onClick={() => onNavigate('patient-lab')}
           onMouseEnter={() => setLinkedSignal('VDR')}
           onMouseLeave={() => setLinkedSignal(pinnedSignal)}
         >
             <GenomicTrack
               gene="VDR"
               variant="rs731236 (Taq1)"
               impact="REDUCED_DENSITY"
               isLinked={linkedSignal === 'VDR'}
             />
             <div className="relative -mt-2 ml-3 border-l border-dashed border-science-700 pl-3 pb-2 group-hover:border-bio-red transition-colors">
                 <div className="absolute -left-[5px] top-1/2 w-2 h-2 bg-science-700 rounded-full group-hover:bg-bio-red transition-colors"></div>
                 <LabTrendChart 
                    title="SERUM_25_OH_VITAMIN_D" 
                    data={vitaminDHistory} 
                    unit="ng/mL" 
                    color="#ff2a6d" // Clinical Red for low
                />
             </div>
         </div>

         {/* Stack 2: CYP2C19 (Just Genomic for now) */}
         <div ref={geneCypRef} className="group">
              <GenomicTrack
                 gene="CYP2C19"
                 variant="*2/*3"
                 impact="POOR_METABOLIZER"
                 isLinked={linkedSignal === 'CYP2C19'}
                 onHoverStart={() => setLinkedSignal('CYP2C19')}
                 onHoverEnd={() => setLinkedSignal(pinnedSignal)}
              />
         </div>
       </div>

      {/* COLUMN 2: INTELLIGENCE FEED (Center) - Width 5/12 */}
      <div className="lg:col-span-5 flex flex-col h-[calc(100vh-8rem)] relative z-10">
          <div className="flex items-center gap-2 mb-3 text-science-300">
            <Zap className="w-4 h-4 text-bio-yellow" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">AI Analysis & Insights</span>
         </div>
         
         <div ref={feedRef} className="flex-1 bg-science-900 border border-science-800 rounded-sm overflow-y-auto custom-scrollbar p-1">
            <div className="sticky top-0 bg-science-900/95 backdrop-blur z-10 p-2 border-b border-science-800 mb-2">
               <div className="text-[10px] font-mono text-science-500 flex justify-between">
                  <span>LAST_UPDATE: 10:42:05 UTC</span>
                  <span className="text-bio-green">● LIVE</span>
               </div>
            </div>

            <div ref={alertCypRef}>
              <AlertCard 
                  title="Pharmacogenomic Interaction"
                  source="CYP2C19 GENOTYPE (*2/*3)"
                  detail="Clopidogrel (Plavix) efficacy is significantly reduced. Active metabolite formation is impaired. Standard dosing may lead to insufficient platelet inhibition. [Ref: CPIC]"
                  type="warning"
                  isLinked={linkedSignal === 'CYP2C19'}
              />
            </div>

            <AlertCard 
                title="Symptom Correlation Detected"
                source="LAB_DATA (Mg) + PAIN_LOG"
                detail="Analysis of the last 28 days reveals a 92% correlation between 'Migraine' log entries and Vitamin D nadir. While not causal, correction of deficiency is prioritized."
                type="info"
                onClick={() => onNavigate('patient-lab')}
            />
            
            <div ref={alertVdrRef}>
              <AlertCard 
                  title="Protocol Recommendation"
                  source="BIOLENS_CORE"
                  detail="Initiate Vitamin D3 5000 IU + K2 daily. Re-test serum levels in 12 weeks. Monitor for hypercalcemia symptoms."
                  type="info"
                  isLinked={linkedSignal === 'VDR'}
              />
            </div>

         </div>
         
         {/* Command Input */}
         <div className="mt-3 relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Terminal className="h-4 w-4 text-bio-blue" />
             </div>
             <input 
                type="text" 
                placeholder="EXECUTE ANALYSIS..."
                className="w-full bg-science-900 border border-science-800 rounded-sm text-science-100 font-mono text-sm py-2 pl-10 pr-4 focus:ring-1 focus:ring-bio-blue focus:border-bio-blue shadow-glow-blue transition-shadow"
             />
         </div>
      </div>

      {/* COLUMN 3: PHENOTYPE TRACKING - Width 3/12 */}
      <div className="lg:col-span-3 space-y-4 relative z-10">
         <div className="flex items-center gap-2 mb-2 text-science-300">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">Phenotypic Log</span>
         </div>
         
         <div className="h-[360px]">
             <HeatmapLog />
         </div>

         {/* Quick Data Entry */}
         <div className="bg-science-900 border border-science-800 rounded-sm p-3">
             <h3 className="text-xs font-mono text-science-300 uppercase tracking-widest mb-2">Quick Input</h3>
             <div className="grid grid-cols-2 gap-2">
                 <button className="bg-science-800 hover:bg-science-700 text-science-100 py-1.5 px-2.5 text-xs font-mono border border-science-700 rounded-sm flex items-center justify-between group">
                    <span>MIGRAINE</span>
                    <span className="text-bio-red opacity-0 group-hover:opacity-100">+</span>
                 </button>
                 <button className="bg-science-800 hover:bg-science-700 text-science-100 py-1.5 px-2.5 text-xs font-mono border border-science-700 rounded-sm flex items-center justify-between group">
                    <span>FATIGUE</span>
                    <span className="text-bio-yellow opacity-0 group-hover:opacity-100">+</span>
                 </button>
                 <button className="bg-science-800 hover:bg-science-700 text-science-100 py-1.5 px-2.5 text-xs font-mono border border-science-700 rounded-sm flex items-center justify-between group">
                    <span>NAUSEA</span>
                    <span className="text-bio-blue opacity-0 group-hover:opacity-100">+</span>
                 </button>
                 <button className="bg-science-800 hover:bg-science-700 text-science-100 py-1.5 px-2.5 text-xs font-mono border border-science-700 rounded-sm flex items-center justify-between group">
                    <span>BP_READ</span>
                    <span className="text-bio-green opacity-0 group-hover:opacity-100">+</span>
                 </button>
             </div>
         </div>
      </div>

    </div>
  );
};
