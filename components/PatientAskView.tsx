import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ExternalLink, Terminal } from 'lucide-react';
import { mockPatient } from '../services/mockData';
import { defaultAskSuggestions, routeMockAsk, type AskResult } from '../services/askEngine';
import { CitationText } from './CitationText';

interface PatientAskViewProps {
  onNavigate: (path: 'patient-dashboard' | 'patient-lab') => void;
}

type AskTurn = {
  id: string;
  question: string;
  createdAt: number;
  result: AskResult;
};

const nowId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const PatientAskView: React.FC<PatientAskViewProps> = ({ onNavigate }) => {
  const [queryText, setQueryText] = useState('');
  const [turns, setTurns] = useState<AskTurn[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem('biolens:askTurns');
      if (!raw) return;
      const parsed = JSON.parse(raw) as AskTurn[];
      if (!Array.isArray(parsed)) return;
      setTurns(parsed);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem('biolens:askTurns', JSON.stringify(turns.slice(-24)));
    } catch {
      // ignore
    }
  }, [turns]);

  const submitQuery = useCallback((raw: string) => {
    const cleaned = raw.trim();
    if (!cleaned) return;
    const result = routeMockAsk(cleaned);
    setTurns((prev) => [...prev, { id: nowId(), question: cleaned, createdAt: Date.now(), result }]);
    setQueryText('');
  }, []);

  useEffect(() => {
    if (!turns.length) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [turns.length]);

  useEffect(() => {
    try {
      const pending = window.sessionStorage.getItem('biolens:pendingQuery');
      if (pending) {
        window.sessionStorage.removeItem('biolens:pendingQuery');
        submitQuery(pending);
      }
    } catch {
      // ignore
    }
    const onAsk = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail !== 'string') return;
      submitQuery(detail);
    };
    window.addEventListener('biolens:ask', onAsk as EventListener);
    return () => window.removeEventListener('biolens:ask', onAsk as EventListener);
  }, [submitQuery]);

  const starterChips = useMemo(() => defaultAskSuggestions.slice(0, 6), []);

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4 min-w-0">
          <div className="bg-science-900 border border-science-800 p-4">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 text-[10px] font-mono text-science-400 uppercase tracking-widest">
                <Terminal className="w-4 h-4 text-bio-blue" />
                <span>ASK_BIOLENS</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('patient-dashboard')}
                className="text-[10px] font-mono text-science-300 border border-science-700 px-2 py-1 hover:border-bio-blue hover:text-bio-blue transition-colors"
              >
                OPEN_DASHBOARD
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitQuery(queryText);
                }}
                placeholder="Ask about labs, symptoms, variants… (e.g., Vitamin D / LDL / 氯吡格雷)"
                className="w-full bg-science-950 border border-science-800 text-science-100 font-mono text-sm py-3 pl-4 pr-12 focus:ring-1 focus:ring-bio-blue focus:border-bio-blue search-glow"
              />
              <button
                type="button"
                onClick={() => submitQuery(queryText)}
                className="absolute inset-y-0 right-0 px-3 text-science-300 hover:text-bio-blue transition-colors"
                aria-label="Run query"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {starterChips.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => submitQuery(q)}
                  className="text-[10px] font-mono text-science-300 border border-science-800 rounded-sm px-2 py-1 hover:border-science-700 hover:text-science-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {turns.map((t) => {
              const primaryAction = t.result.actions?.find((a) => a.type === 'navigate') ?? null;
              return (
                <div key={t.id} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="max-w-[92%] bg-science-950 border border-science-800 px-3 py-2">
                      <div className="text-[10px] font-mono text-science-500 uppercase tracking-widest mb-1">You</div>
                      <div className="text-sm text-science-100 leading-relaxed">{t.question}</div>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="max-w-[92%] bg-science-900 border border-science-800 px-3 py-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[10px] font-mono text-science-500 uppercase tracking-widest mb-1">
                            BioLens
                          </div>
                          <div className="text-sm font-semibold text-science-100">{t.result.title}</div>
                          <div className="mt-1 text-[10px] font-mono text-science-500">{t.result.source}</div>
                        </div>
                        <div
                          className={`text-[10px] font-mono border px-2 py-1 ${
                            t.result.type === 'warning'
                              ? 'border-bio-red/30 text-bio-red bg-bio-red/10'
                              : 'border-bio-blue/30 text-bio-blue bg-bio-blue/10'
                          }`}
                        >
                          {t.result.type === 'warning' ? 'WARNING' : 'INFO'}
                        </div>
                      </div>

                      <div className="mt-3 text-[13px] text-science-100 leading-relaxed whitespace-pre-wrap">
                        <CitationText text={t.result.detail} />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {primaryAction ? (
                          <button
                            type="button"
                            onClick={() => onNavigate(primaryAction.to)}
                            className="text-[10px] font-mono text-science-200 border border-science-700 px-2 py-1 hover:border-bio-blue hover:text-bio-blue transition-colors"
                          >
                            {primaryAction.label}
                          </button>
                        ) : null}

                        {t.result.followUps?.slice(0, 3).map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => submitQuery(f)}
                            className="text-[10px] font-mono text-science-300 border border-science-800 px-2 py-1 hover:border-science-700 hover:text-science-100 transition-colors"
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-science-900 border border-science-800 p-4">
            <div className="text-[10px] font-mono text-science-500 uppercase tracking-widest">Context</div>
            <div className="mt-3">
              <div className="text-sm font-semibold text-science-100">{mockPatient.name}</div>
              <div className="mt-1 text-[10px] font-mono text-science-500">
                ID: {mockPatient.id} • AGE: {mockPatient.age} • RISK: {mockPatient.riskLevel.toUpperCase()}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={() => onNavigate('patient-lab')}
                className="w-full text-left bg-science-950 border border-science-800 p-3 hover:border-science-700 transition-colors"
              >
                <div className="text-xs font-mono text-science-400 uppercase tracking-widest">Vitamin D</div>
                <div className="mt-1 text-sm text-science-100 font-mono font-bold">
                  {mockPatient.labResults.find((l) => l.name.toLowerCase().includes('vitamin d'))?.value ?? '—'} ng/mL
                </div>
                <div className="mt-1 text-[11px] text-science-400">Open longitudinal panel</div>
              </button>

              <div className="bg-science-950 border border-science-800 p-3">
                <div className="text-xs font-mono text-science-400 uppercase tracking-widest">Key Variants</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {mockPatient.geneTraits.map((t) => (
                    <button
                      key={`${t.gene}-${t.variant}`}
                      type="button"
                      onClick={() => submitQuery(`What does ${t.gene} ${t.variant} mean?`)}
                      className="text-[10px] font-mono text-science-200 border border-science-800 px-2 py-1 hover:border-bio-blue hover:text-bio-blue transition-colors"
                    >
                      {t.gene}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-science-950 border border-l-2 border-bio-yellow p-4 text-xs text-science-300 leading-relaxed">
            Demo mode: client-only heuristics + evidence drawer. Not medical advice.
          </div>

          <a
            href="https://cpicpgx.org/guidelines/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-mono text-bio-blue hover:underline"
          >
            OPEN_CPIC_GUIDELINES <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

