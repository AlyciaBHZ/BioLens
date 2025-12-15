import React from 'react';
import { CitationLink } from './CitationLink';

type CitationTextProps = {
  text: string;
};

export const CitationText: React.FC<CitationTextProps> = ({ text }) => {
  const refRegex = /\[Ref:\s*([^\]]+)\]/g;
  const nodes: React.ReactNode[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null = null;
  while ((match = refRegex.exec(text)) !== null) {
    const full = match[0];
    const key = match[1] ?? '';
    const start = match.index;
    if (start > lastIndex) nodes.push(text.slice(lastIndex, start));
    nodes.push(
      <CitationLink key={`${key}-${start}`} refKey={key}>
        {full}
      </CitationLink>
    );
    lastIndex = start + full.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));

  return <>{nodes}</>;
};

