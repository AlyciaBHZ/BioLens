import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceArea } from 'recharts';
import { AlertTriangle, Database, Zap, ArrowRight, Dna, Activity, Terminal, ChevronRight } from 'lucide-react';
import { mockPatient, vitaminDHistory, symptomHeatmap } from '../services/mockData';

// --- VISUALIZATION COMPONENTS ---

const GenomicTrack = ({ gene, variant, impact }: { gene: string, variant: string, impact: string }) => (
  <div className="bg-science-900 border border-science-800 p-4 mb-4 relative overflow-hidden group hover:border-science-700 transition-colors">
    <div className="flex justify-between items-center mb-3">
       <div className="flex items-center gap-2">
          <Dna className="w-4 h-4 text-bio-purple" />
          <span className="text-sm font-mono font-bold text-science-100">{gene}</span>
       </div>
       <span className="text-xs font-mono text-bio-red bg-bio-red/10 px-2 py-0.5 border border-bio-red/20">{variant}</span>
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
  <div className="bg-science-900 border border-science-800 p-4 pointer-events-none">
    <div className="flex justify-between items-end mb-4">
      <h3 className="text-xs font-mono text-science-300 uppercase tracking-widest">{title}</h3>
      <span className="text-lg font-mono font-bold text-science-100 tabular-nums">
        {data[data.length - 1].value} <span className="text-xs text-science-500 font-normal">{unit}</span>
      </span>
    </div>
    <div className="h-32 w-full">
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
    <div className="bg-science-900 border border-science-800 p-4 h-full">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-mono text-science-300 uppercase tracking-widest">Phenotype Log</h3>
            <button className="text-[10px] font-mono text-bio-blue border border-bio-blue/30 px-2 py-1 hover:bg-bio-blue/10 transition-colors">
                + LOG_ENTRY
            </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-4">
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
        
        <div className="space-y-2 pt-4 border-t border-science-800">
             <div className="flex items-center gap-2 text-xs text-science-300 font-mono">
                <span className="w-2 h-2 bg-bio-red/40 border border-bio-red/60"></span>
                <span>HIGH_INTENSITY</span>
             </div>
             <div className="flex items-center gap-2 text-xs text-science-300 font-mono">
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
}

const AlertCard: React.FC<AlertCardProps> = ({ title, source, detail, type = 'warning', onClick }) => (
    <div 
        onClick={onClick}
        className={`p-4 border-l-2 ${type === 'warning' ? 'border-bio-red bg-bio-red/5' : 'border-bio-blue bg-bio-blue/5'} mb-3 hover:bg-science-800/50 transition-colors cursor-pointer group relative overflow-hidden`}
    >
        {/* Interactive Hover Highlight */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        
        <div className="flex items-start gap-3">
            <div className={`mt-0.5 ${type === 'warning' ? 'text-bio-red' : 'text-bio-blue'}`}>
                {type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
            </div>
            <div className="flex-1">
                <h4 className={`text-sm font-bold font-mono uppercase mb-1 ${type === 'warning' ? 'text-bio-red' : 'text-bio-blue'}`}>
                    {title}
                </h4>
                <p className="text-xs text-science-300 mb-2 leading-relaxed">
                    SOURCE: <span className="text-science-100 font-mono">{source}</span>
                </p>
                <p className="text-sm text-science-100 leading-relaxed border-l border-science-700 pl-3">
                    {detail}
                </p>
                <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-science-500 font-mono underline cursor-pointer hover:text-bio-blue">VIEW_DATA_SOURCE_&gt;&gt;</span>
                </div>
            </div>
        </div>
    </div>
);

interface PatientViewProps {
    onNavigate: (path: string) => void;
}

export const PatientView: React.FC<PatientViewProps> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* COLUMN 1: BIO-CONTEXT (Gene + Lab) - Width 4/12 */}
      <div className="lg:col-span-4 space-y-6">
         <div className="flex items-center gap-2 mb-2 text-science-300">
            <Database className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">Integrated Biomarkers</span>
         </div>

         {/* Stack 1: VDR / Vitamin D */}
         <div className="group cursor-pointer" onClick={() => onNavigate('patient-lab')}>
             <GenomicTrack gene="VDR" variant="rs731236 (Taq1)" impact="REDUCED_DENSITY" />
             <div className="relative -mt-2 ml-4 border-l border-dashed border-science-700 pl-4 pb-2 group-hover:border-bio-red transition-colors">
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
         <div className="group">
             <GenomicTrack gene="CYP2C19" variant="*2/*3" impact="POOR_METABOLIZER" />
         </div>
      </div>

      {/* COLUMN 2: INTELLIGENCE FEED (Center) - Width 5/12 */}
      <div className="lg:col-span-5 flex flex-col h-[calc(100vh-8rem)]">
          <div className="flex items-center gap-2 mb-4 text-science-300">
            <Zap className="w-4 h-4 text-bio-yellow" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">AI Analysis & Insights</span>
         </div>
         
         <div className="flex-1 bg-science-900 border border-science-800 overflow-y-auto custom-scrollbar p-1">
            <div className="sticky top-0 bg-science-900/95 backdrop-blur z-10 p-3 border-b border-science-800 mb-2">
               <div className="text-[10px] font-mono text-science-500 flex justify-between">
                  <span>LAST_UPDATE: 10:42:05 UTC</span>
                  <span className="text-bio-green">● LIVE</span>
               </div>
            </div>

            <AlertCard 
                title="Pharmacogenomic Interaction"
                source="CYP2C19 GENOTYPE (*2/*3)"
                detail="Clopidogrel (Plavix) efficacy is significantly reduced. Active metabolite formation is impaired. Standard dosing may lead to insufficient platelet inhibition."
                type="warning"
            />

            <AlertCard 
                title="Symptom Correlation Detected"
                source="LAB_DATA (Mg) + PAIN_LOG"
                detail="Analysis of the last 28 days reveals a 92% correlation between 'Migraine' log entries and Vitamin D nadir. While not causal, correction of deficiency is prioritized."
                type="info"
                onClick={() => onNavigate('patient-lab')}
            />
            
            <AlertCard 
                title="Protocol Recommendation"
                source="BIOLENS_CORE"
                detail="Initiate Vitamin D3 5000 IU + K2 daily. Re-test serum levels in 12 weeks. Monitor for hypercalcemia symptoms."
                type="info"
            />

         </div>
         
         {/* Command Input */}
         <div className="mt-4 relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Terminal className="h-4 w-4 text-bio-blue" />
             </div>
             <input 
                type="text" 
                placeholder="EXECUTE ANALYSIS..."
                className="w-full bg-science-900 border border-science-800 text-science-100 font-mono text-sm py-3 pl-10 pr-4 focus:ring-1 focus:ring-bio-blue focus:border-bio-blue shadow-glow-blue transition-shadow"
             />
         </div>
      </div>

      {/* COLUMN 3: PHENOTYPE TRACKING - Width 3/12 */}
      <div className="lg:col-span-3 space-y-6">
         <div className="flex items-center gap-2 mb-2 text-science-300">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">Phenotypic Log</span>
         </div>
         
         <div className="h-[400px]">
             <HeatmapLog />
         </div>

         {/* Quick Data Entry */}
         <div className="bg-science-900 border border-science-800 p-4">
             <h3 className="text-xs font-mono text-science-300 uppercase tracking-widest mb-3">Quick Input</h3>
             <div className="grid grid-cols-2 gap-2">
                 <button className="bg-science-800 hover:bg-science-700 text-science-100 py-2 px-3 text-xs font-mono border border-science-700 flex items-center justify-between group">
                    <span>MIGRAINE</span>
                    <span className="text-bio-red opacity-0 group-hover:opacity-100">+</span>
                 </button>
                 <button className="bg-science-800 hover:bg-science-700 text-science-100 py-2 px-3 text-xs font-mono border border-science-700 flex items-center justify-between group">
                    <span>FATIGUE</span>
                    <span className="text-bio-yellow opacity-0 group-hover:opacity-100">+</span>
                 </button>
                 <button className="bg-science-800 hover:bg-science-700 text-science-100 py-2 px-3 text-xs font-mono border border-science-700 flex items-center justify-between group">
                    <span>NAUSEA</span>
                    <span className="text-bio-blue opacity-0 group-hover:opacity-100">+</span>
                 </button>
                 <button className="bg-science-800 hover:bg-science-700 text-science-100 py-2 px-3 text-xs font-mono border border-science-700 flex items-center justify-between group">
                    <span>BP_READ</span>
                    <span className="text-bio-green opacity-0 group-hover:opacity-100">+</span>
                 </button>
             </div>
         </div>
      </div>

    </div>
  );
};