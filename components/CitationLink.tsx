import React from 'react';
import { useCitation } from './CitationContext';

type CitationLinkProps = {
  refKey: string;
  children?: React.ReactNode;
  className?: string;
};

export const CitationLink: React.FC<CitationLinkProps> = ({ refKey, children, className }) => {
  const { openCitation } = useCitation();
  const label = children ?? `[Ref: ${refKey}]`;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        openCitation(refKey);
      }}
      className={`inline-flex items-center font-mono text-[10px] text-bio-green hover:text-bio-blue underline decoration-dotted underline-offset-2 transition-colors ${className ?? ''}`}
      aria-label={`Open citation: ${refKey}`}
    >
      {label}
    </button>
  );
};
