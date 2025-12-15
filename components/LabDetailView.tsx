import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { ArrowLeft, Dna, FileText, Share2, Info, Activity } from 'lucide-react';
import { vitaminDHistory } from '../services/mockData';

interface LabDetailViewProps {
  onBack: () => void;
}

export const LabDetailView: React.FC<LabDetailViewProps> = ({ onBack }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Navigation Header */}
      <div className="flex items-center gap-4 border-b border-science-800 pb-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-science-800 text-science-300 hover:text-science-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-mono font-bold text-science-100 tracking-wide uppercase">
            Vitamin D (25-OH) Analysis
          </h1>
          <div className="flex items-center gap-2 text-xs font-mono text-science-400">
             <span>LOINC: 1871-0</span>
             <span className="text-science-700">|</span>
             <span>Last Updated: 2023-11-15</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-science-900 border border-science-700 text-xs font-mono text-science-300 hover:text-bio-blue hover:border-bio-blue transition-colors">
                <Share2 className="w-3 h-3" /> EXPORT_PDF
            </button>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Current Value - Big Display */}
          <div className="md:col-span-1 bg-science-900 border-l-4 border-bio-red p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity className="w-16 h-16 text-bio-red" />
              </div>
              <h3 className="text-xs font-mono text-science-400 uppercase mb-2">Current Level</h3>
              <div className="text-5xl font-mono font-bold text-bio-red tracking-tighter">
                  18.0 <span className="text-sm text-science-500 font-normal">ng/mL</span>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 px-2 py-1 bg-bio-red/10 text-bio-red text-xs font-mono font-bold border border-bio-red/20 uppercase">
                  Critical Deficiency
              </div>
          </div>

          {/* Polygenic Risk Score */}
          <div className="md:col-span-3 bg-science-900 border border-science-800 p-6 flex items-center justify-between">
              <div className="max-w-md">
                   <div className="flex items-center gap-2 mb-2 text-bio-purple">
                      <Dna className="w-5 h-5" />
                      <h3 className="text-sm font-mono font-bold uppercase">Genomic Context: VDR</h3>
                   </div>
                   <p className="text-sm text-science-300 leading-relaxed">
                      Variant <span className="text-science-100 font-mono font-bold">rs731236 (Taq1)</span> detected. 
                      This genotype is associated with <span className="text-science-100">30-40% lower receptor density</span>. 
                      Standard supplementation protocols often fail to achieve target serum levels in this cohort.
                   </p>
              </div>
              
              {/* Visual Weighting */}
              <div className="hidden md:flex flex-col items-center gap-2">
                  <div className="text-xs font-mono text-science-500 uppercase">Impact Factor</div>
                  <div className="relative w-32 h-4 bg-science-800 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-science-700 to-bio-purple w-[75%]"></div>
                  </div>
                  <div className="text-xs font-mono text-bio-purple font-bold">High Genetic Relevance</div>
              </div>
          </div>
      </div>

      {/* Scientific Chart */}
      <div className="bg-science-900 border border-science-800 p-6">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono font-bold text-science-300 uppercase tracking-widest">Longitudinal Serum Analysis</h3>
              <div className="flex gap-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-bio-green/20 border border-bio-green/50"></span>
                      <span className="text-science-400">Optimal Range (30-100)</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <span className="w-3 h-1 bg-bio-red"></span>
                      <span className="text-science-400">Patient Data</span>
                  </div>
              </div>
          </div>

          <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={vitaminDHistory} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                      <XAxis 
                          dataKey="date" 
                          stroke="#525252" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          fontFamily="JetBrains Mono" 
                      />
                      <YAxis 
                          stroke="#525252" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          fontFamily="JetBrains Mono" 
                          domain={[0, 120]} 
                      />
                      <Tooltip 
                          contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', fontFamily: 'JetBrains Mono' }}
                          itemStyle={{ color: '#e5e5e5' }}
                          formatter={(value: number) => [`${value} ng/mL`, 'Serum Level']}
                      />
                      
                      {/* Reference Range (Green Zone) */}
                      <ReferenceLine y={30} stroke="#059669" strokeDasharray="3 3" label={{ position: 'right', value: 'Min Target', fill: '#059669', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                      <ReferenceLine y={100} stroke="#059669" strokeDasharray="3 3" />
                      <Area 
                          type="monotone" 
                          dataKey="range" 
                          fill="#10b981" 
                          fillOpacity={0.05} 
                          stroke="none" 
                          data={vitaminDHistory.map(d => ({ ...d, range: [30, 100] }))} // Hack to draw the area
                      />
                      
                      {/* Patient Line */}
                      <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#ff2a6d" 
                          strokeWidth={3} 
                          dot={{ r: 6, fill: '#0a0a0a', stroke: '#ff2a6d', strokeWidth: 2 }} 
                          activeDot={{ r: 8, fill: '#ff2a6d' }} 
                      />
                  </ComposedChart>
              </ResponsiveContainer>
          </div>
      </div>

      {/* Action Plan */}
      <div className="bg-science-950 border border-l-2 border-bio-green p-4">
          <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-bio-green mt-0.5" />
              <div>
                  <h4 className="text-sm font-mono font-bold text-bio-green uppercase mb-1">Recommended Intervention</h4>
                  <p className="text-sm text-science-300">
                      Based on <span className="text-science-100 font-bold">VDR Taq1</span> genotype, standard 2000 IU dosing is projected to be insufficient.
                      <br/>
                      <span className="text-science-100">Protocol Update:</span> Increase to <span className="text-science-100 font-bold">5000 IU D3 + 100mcg K2</span> daily. Retest in 12 weeks.
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};