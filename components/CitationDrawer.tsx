import React, { useEffect, useRef } from 'react';
import { ExternalLink, X } from 'lucide-react';
import type { Citation } from '../services/citations';

type CitationDrawerProps = {
  open: boolean;
  citation: Citation | null;
  onClose: () => void;
};

export const CitationDrawer: React.FC<CitationDrawerProps> = ({ open, citation, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  const label = citation?.key ?? 'REF';
  const title = citation?.title ?? 'Unknown reference';

  return (
    <div className={`fixed inset-0 z-[200] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <button
        type="button"
        aria-label="Close citation drawer"
        className={`absolute inset-0 bg-science-950/60 backdrop-blur-sm transition-opacity ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Citation drawer: ${label}`}
        className={`absolute right-0 top-0 h-full w-[440px] max-w-[88vw] bg-science-900 border-l border-science-700 shadow-2xl transform transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <header className="p-4 border-b border-science-800 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-science-500 uppercase tracking-widest">Citation Drawer</div>
              <div className="mt-1 font-mono text-sm font-bold text-science-100 truncate">{label}</div>
              <div className="mt-2 text-xs text-science-300 leading-relaxed">{title}</div>
              <div className="mt-2 text-[10px] text-science-500 font-mono">
                {citation?.venue ? citation.venue : null}
                {citation?.venue && citation?.year ? ' • ' : null}
                {citation?.year ? citation.year : null}
              </div>
              {citation?.url ? (
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono text-bio-blue hover:underline"
                >
                  OPEN_SOURCE <ExternalLink className="w-3 h-3" />
                </a>
              ) : null}
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="p-2 rounded-sm text-science-400 hover:text-science-100 hover:bg-science-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div className="bg-science-950 border border-science-800 rounded-sm p-3">
              <div className="text-[10px] font-mono text-science-500 uppercase tracking-widest mb-2">
                Evidence Snippet
              </div>
              <div className="text-xs font-mono text-science-200 leading-relaxed whitespace-pre-wrap">
                {citation?.snippet ?? 'No citation registered for this reference yet.'}
              </div>
            </div>

            {citation?.note ? <div className="text-[11px] text-science-400 leading-relaxed">{citation.note}</div> : null}
          </div>

          <footer className="p-4 border-t border-science-800 bg-science-900/60 text-[10px] text-science-500 font-mono">
            Evidence-linked output • Click any `[Ref: …]` to inspect sources
          </footer>
        </div>
      </aside>
    </div>
  );
};

