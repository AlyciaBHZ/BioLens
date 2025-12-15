import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CitationDrawer } from './CitationDrawer';
import { getCitation, type Citation } from '../services/citations';

type CitationContextValue = {
  openCitation: (key: string) => void;
  closeCitation: () => void;
  activeKey: string | null;
  activeCitation: Citation | null;
};

const CitationContext = createContext<CitationContextValue | null>(null);

export const CitationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const openCitation = useCallback((key: string) => setActiveKey(key), []);
  const closeCitation = useCallback(() => setActiveKey(null), []);

  const activeCitation = useMemo<Citation | null>(() => {
    if (!activeKey) return null;
    return (
      getCitation(activeKey) ?? {
        key: activeKey,
        title: 'Unknown reference',
        snippet: 'No citation registered for this reference key yet.',
        note: 'Add an entry in `services/citations.ts` to populate this drawer.',
      }
    );
  }, [activeKey]);

  const value = useMemo(
    () => ({
      openCitation,
      closeCitation,
      activeKey,
      activeCitation,
    }),
    [activeCitation, activeKey, closeCitation, openCitation]
  );

  return (
    <CitationContext.Provider value={value}>
      {children}
      <CitationDrawer open={Boolean(activeKey)} citation={activeCitation} onClose={closeCitation} />
    </CitationContext.Provider>
  );
};

export const useCitation = () => {
  const ctx = useContext(CitationContext);
  if (!ctx) throw new Error('useCitation must be used within <CitationProvider>');
  return ctx;
};

