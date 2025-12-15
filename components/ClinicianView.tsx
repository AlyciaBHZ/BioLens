import React, { useState } from 'react';
import { Search, User, ArrowRight, AlertTriangle, FileText, Sparkles, Terminal, ChevronDown, ChevronUp, Users, X, Copy } from 'lucide-react';
import { mockPatientsList } from '../services/mockData';
import { PatientProfile } from '../types';

const CohortTable = ({ onSelect, onGenerateReport }: { onSelect: (p: PatientProfile) => void, onGenerateReport: (p: PatientProfile) => void }) => (
    <div className="bg-science-900 border border-science-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-science-800 flex justify-between items-center bg-science-900/50">
            <h3 className="text-xs font-mono text-science-300 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4" /> Patient Cohort
            </h3>
            <div className="text-[10px] text-science-500 font-mono">N=3 ACTIVE</div>
        </div>
        <table className="w-full text-left text-sm">
            <thead className="bg-science-950 text-science-500 font-mono text-xs uppercase">
                <tr>
                    <th className="px-4 py-2 font-normal">ID</th>
                    <th className="px-4 py-2 font-normal">Name</th>
                    <th className="px-4 py-2 font-normal">Risk Profile</th>
                    <th className="px-4 py-2 font-normal">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-science-800">
                {mockPatientsList.map((p) => (
                    <tr 
                        key={p.id} 
                        onClick={() => onSelect(p)}
                        className="hover:bg-science-800/50 cursor-pointer transition-colors group"
                    >
                        <td className="px-4 py-3 font-mono text-bio-blue">{p.id}</td>
                        <td className="px-4 py-3 font-medium text-science-100">{p.name}</td>
                        <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-mono border uppercase
                                ${p.riskLevel === 'High' ? 'bg-bio-red/10 text-bio-red border-bio-red/30' : 
                                  p.riskLevel === 'Medium' ? 'bg-bio-yellow/10 text-bio-yellow border-bio-yellow/30' : 
                                  'bg-bio-green/10 text-bio-green border-bio-green/30'}`}>
                                {p.riskLevel === 'High' && <AlertTriangle className="w-3 h-3" />}
                                {p.riskLevel}
                            </span>
                        </td>
                        <td className="px-4 py-3 text-science-400 font-mono text-xs">
                             <button 
                                onClick={(e) => { e.stopPropagation(); onGenerateReport(p); }}
                                className="px-3 py-1 bg-science-800 hover:bg-bio-blue/20 hover:text-bio-blue border border-science-700 text-xs transition-colors flex items-center gap-1"
                             >
                                <Sparkles className="w-3 h-3" /> Report
                             </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// Report Modal Component
const ReportModal = ({ patient, onClose }: { patient: PatientProfile, onClose: () => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-science-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-science-900 border border-science-700 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-science-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-bio-purple" />
                    <span className="font-mono font-bold text-science-100 uppercase">AI Clinical SOAP Note</span>
                </div>
                <button onClick={onClose} className="text-science-500 hover:text-science-100">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <div className="p-6 overflow-y-auto font-mono text-sm leading-relaxed text-science-300 space-y-4">
                <div className="p-3 bg-bio-blue/5 border-l-2 border-bio-blue mb-4 text-xs">
                    <span className="font-bold text-bio-blue">PATIENT:</span> {patient.name} ({patient.id})
                    <span className="mx-2">|</span>
                    <span className="font-bold text-bio-blue">DATE:</span> {new Date().toLocaleDateString()}
                </div>

                <div>
                    <strong className="text-science-100 block mb-1">SUBJECTIVE:</strong>
                    Patient presents with fatigue. Self-reported logs indicate regular migraine intervals correlating with stress peaks.
                </div>
                
                <div>
                    <strong className="text-science-100 block mb-1">OBJECTIVE:</strong>
                    - LDL: {patient.labResults.find(l => l.name.includes('LDL'))?.value} mg/dL (Elevated)
                    <br/>
                    - Vit D: {patient.labResults.find(l => l.name.includes('Vitamin D'))?.value} ng/mL (Critical)
                    <br/>
                    - Genotype: CYP2C19 *2/*3 (Poor Metabolizer)
                </div>

                <div>
                    <strong className="text-science-100 block mb-1">ASSESSMENT:</strong>
                    1. Vitamin D deficiency exacerbated by VDR genetic variant.
                    <br/>
                    2. Pharmacogenetic risk for Clopidogrel therapy detected.
                    <br/>
                    3. Polygenic risk for hyperlipidemia confirmed.
                </div>

                <div>
                    <strong className="text-science-100 block mb-1">PLAN:</strong>
                    1. Initiate Vitamin D3 5000 IU daily.
                    <br/>
                    2. Avoid Clopidogrel; consider Ticagrelor [Ref: CPIC Guidelines].
                    <br/>
                    3. Follow up in 3 months.
                </div>
            </div>

            <div className="p-4 border-t border-science-800 bg-science-900 flex justify-end gap-3">
                 <button className="flex items-center gap-2 px-4 py-2 border border-science-700 text-science-300 hover:text-science-100 text-xs font-mono transition-colors">
                    <Copy className="w-4 h-4" /> COPY_TEXT
                 </button>
                 <button onClick={onClose} className="px-4 py-2 bg-bio-blue text-science-950 font-bold text-xs font-mono hover:bg-bio-blue/80 transition-colors">
                    PUSH_TO_EMR
                 </button>
            </div>
        </div>
    </div>
);

export const ClinicianView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [reportPatient, setReportPatient] = useState<PatientProfile | null>(null);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            {reportPatient && (
                <ReportModal patient={reportPatient} onClose={() => setReportPatient(null)} />
            )}

            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-science-900 border border-science-800 p-4 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertTriangle className="w-12 h-12 text-bio-red" />
                    </div>
                    <div className="text-2xl font-mono font-bold text-bio-red">3</div>
                    <div className="text-xs text-science-400 font-mono uppercase mt-1">Critical Alerts</div>
                </div>
                <div className="bg-science-900 border border-science-800 p-4 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText className="w-12 h-12 text-bio-blue" />
                    </div>
                    <div className="text-2xl font-mono font-bold text-bio-blue">12</div>
                    <div className="text-xs text-science-400 font-mono uppercase mt-1">Pending Reports</div>
                </div>
                <div className="col-span-2 flex items-end">
                     <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Terminal className="h-4 w-4 text-science-500" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="SEARCH_COHORT: GENE=CYP2C19..." 
                            className="w-full bg-science-900 border border-science-800 text-science-100 font-mono text-sm py-3 pl-10 pr-4 focus:ring-1 focus:ring-bio-green focus:border-bio-green"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Patient List */}
                <div className="lg:col-span-2">
                    <CohortTable 
                        onSelect={() => {}} 
                        onGenerateReport={setReportPatient}
                    />
                </div>

                {/* AI Assistant Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-science-900 border border-science-800 h-full p-4 flex flex-col">
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-science-800">
                            <Sparkles className="w-4 h-4 text-bio-purple" />
                            <h3 className="text-xs font-mono font-bold text-science-100 uppercase tracking-widest">Research Assistant</h3>
                        </div>
                        
                        <div className="flex-1 space-y-4">
                            <div className="bg-science-950 p-3 border-l-2 border-bio-purple">
                                <p className="text-xs text-science-300 font-mono mb-1">QUERY_RESULT:</p>
                                <p className="text-sm text-science-100 italic">
                                    "For CYP2C19 *2/*3 carriers (Poor Metabolizers), Prasugrel or Ticagrelor are recommended over Clopidogrel to reduce risk of major adverse cardiovascular events (MACE)."
                                </p>
                                <div className="mt-2 text-[10px] text-bio-purple font-mono cursor-pointer hover:underline">
                                    REF: ACC/AHA GUIDELINES 2022
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                             <input 
                                type="text" 
                                placeholder="ASK_LITERATURE..."
                                className="w-full bg-science-950 border border-science-800 text-science-100 text-xs p-2 font-mono focus:border-bio-purple focus:ring-0"
                             />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};