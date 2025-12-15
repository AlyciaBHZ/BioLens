import React, { useMemo } from 'react';

type TopologyGraphProps = {
  className?: string;
  seed?: number;
};

type TopologyNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  colorHex: string;
};

type TopologyEdge = {
  from: string;
  to: string;
  colorHex: string;
  strength: 'primary' | 'secondary';
};

const mulberry32 = (seed: number) => {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const TopologyGraph: React.FC<TopologyGraphProps> = ({ className, seed = 1337 }) => {
  const { nodes, edges, packets, stars } = useMemo(() => {
    const rand = mulberry32(seed);
    const centerX = 500;
    const centerY = 280;

    const palette = {
      blue: '#00f2ff',
      green: '#00ff9d',
      red: '#ff2a6d',
      yellow: '#ffcc00',
      purple: '#b967ff',
      dim: '#262626',
      soft: '#171717',
    };

    const core: TopologyNode = {
      id: 'core',
      label: 'BIO_CORE',
      x: centerX,
      y: centerY,
      colorHex: palette.blue,
    };

    const orbit = [
      { id: 'lab', label: 'LAB_DECODER', colorHex: palette.blue },
      { id: 'gene', label: 'GENE_INSIGHT', colorHex: palette.purple },
      { id: 'pgx', label: 'PGX_ENGINE', colorHex: palette.yellow },
      { id: 'evidence', label: 'RAG_EVIDENCE', colorHex: palette.green },
      { id: 'wearable', label: 'WEARABLE_STREAM', colorHex: palette.blue },
      { id: 'phenotype', label: 'PHENOTYPE_LOG', colorHex: palette.red },
      { id: 'copilot', label: 'CLINICIAN_COPILOT', colorHex: palette.yellow },
      { id: 'vault', label: 'SECURE_VAULT', colorHex: palette.green },
    ];

    const orbitNodes: TopologyNode[] = orbit.map((n, idx) => {
      const angle = (idx / orbit.length) * Math.PI * 2;
      const radiusX = 330;
      const radiusY = 210;
      const jitterX = (rand() - 0.5) * 28;
      const jitterY = (rand() - 0.5) * 22;
      const x = centerX + Math.cos(angle) * radiusX + jitterX;
      const y = centerY + Math.sin(angle) * radiusY + jitterY;
      return { ...n, x, y };
    });

    const innerNodes: TopologyNode[] = [
      { id: 'normalize', label: 'NORMALIZE', colorHex: palette.dim },
      { id: 'link', label: 'LINK', colorHex: palette.soft },
      { id: 'reason', label: 'REASON', colorHex: palette.dim },
      { id: 'act', label: 'ACT', colorHex: palette.soft },
    ].map((n, idx) => {
      const angle = (idx / 4) * Math.PI * 2 + Math.PI / 4;
      const radiusX = 140;
      const radiusY = 95;
      const jitterX = (rand() - 0.5) * 18;
      const jitterY = (rand() - 0.5) * 14;
      return {
        ...n,
        x: centerX + Math.cos(angle) * radiusX + jitterX,
        y: centerY + Math.sin(angle) * radiusY + jitterY,
      };
    });

    const allNodes = [core, ...orbitNodes, ...innerNodes];
    const byId = new Map(allNodes.map((n) => [n.id, n]));

    const allEdges: TopologyEdge[] = [
      ...orbitNodes.map((n) => ({
        from: core.id,
        to: n.id,
        colorHex: n.colorHex,
        strength: 'primary' as const,
      })),
      ...innerNodes.map((n) => ({
        from: core.id,
        to: n.id,
        colorHex: palette.dim,
        strength: 'secondary' as const,
      })),
      ...orbitNodes.map((n, idx) => ({
        from: n.id,
        to: orbitNodes[(idx + 1) % orbitNodes.length].id,
        colorHex: palette.dim,
        strength: 'secondary' as const,
      })),
      { from: 'lab', to: 'evidence', colorHex: palette.blue, strength: 'secondary' },
      { from: 'gene', to: 'pgx', colorHex: palette.purple, strength: 'secondary' },
      { from: 'wearable', to: 'phenotype', colorHex: palette.green, strength: 'secondary' },
      { from: 'copilot', to: 'vault', colorHex: palette.yellow, strength: 'secondary' },
    ];

    const packetPaths = allEdges
      .filter((e) => e.strength === 'primary')
      .slice(0, 5)
      .map((e, idx) => {
        const from = byId.get(e.from);
        const to = byId.get(e.to);
        if (!from || !to) return null;
        const path = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
        return { id: `p-${idx}`, path, colorHex: e.colorHex };
      })
      .filter((p): p is { id: string; path: string; colorHex: string } => Boolean(p));

    const backgroundStars = Array.from({ length: 52 }, (_, i) => ({
      id: `s-${i}`,
      x: 80 + rand() * 840,
      y: 55 + rand() * 450,
      r: 0.7 + rand() * 1.6,
      o: 0.08 + rand() * 0.18,
    }));

    return { nodes: allNodes, edges: allEdges, packets: packetPaths, stars: backgroundStars };
  }, [seed]);

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <svg
      className={className}
      viewBox="0 0 1000 560"
      role="img"
      aria-label="BioLens Core topology graph"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="biolensGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 0.65 0
            "
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <radialGradient id="biolensCore" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.32" />
          <stop offset="60%" stopColor="#00f2ff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#00f2ff" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="biolensScan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f2ff" stopOpacity="0" />
          <stop offset="50%" stopColor="#00f2ff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#00f2ff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1000" height="560" fill="transparent" />

      {/* Background stars */}
      <g aria-hidden="true">
        {stars.map((s) => (
          <circle key={s.id} cx={s.x} cy={s.y} r={s.r} fill="#e5e5e5" opacity={s.o} />
        ))}
      </g>

      {/* Edges */}
      <g aria-hidden="true" filter="url(#biolensGlow)">
        {edges.map((e, idx) => {
          const from = nodeById.get(e.from);
          const to = nodeById.get(e.to);
          if (!from || !to) return null;
          const isPrimary = e.strength === 'primary';
          const dashClass = isPrimary ? 'biolens-edge biolens-edge--primary' : 'biolens-edge';
          const duration = isPrimary ? 4.2 + (idx % 4) * 0.8 : 7 + (idx % 3) * 0.9;
          const delay = -1.4 * (idx % 5);
          return (
            <path
              key={`${e.from}-${e.to}-${idx}`}
              d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
              className={dashClass}
              stroke={e.colorHex}
              strokeOpacity={isPrimary ? 0.5 : 0.22}
              strokeWidth={isPrimary ? 1.2 : 1}
              fill="none"
              style={{
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </g>

      {/* Data packets */}
      <g aria-hidden="true" filter="url(#biolensGlow)">
        {packets.map((p, idx) => (
          <circle key={p.id} r="2.2" fill={p.colorHex} opacity="0.75">
            <animateMotion
              dur={`${3.6 + idx * 0.6}s`}
              repeatCount="indefinite"
              path={p.path}
              keyTimes="0;1"
              keySplines="0.2 0 0.2 1"
              calcMode="spline"
            />
          </circle>
        ))}
      </g>

      {/* Nodes */}
      <g filter="url(#biolensGlow)">
        {/* Core glow */}
        <circle cx="500" cy="280" r="120" fill="url(#biolensCore)" opacity="0.9" />

        {nodes.map((n) => {
          const isCore = n.id === 'core';
          const radius = isCore ? 18 : n.id.length <= 4 ? 8 : 10;
          const ringRadius = isCore ? 34 : radius + 14;
          return (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={ringRadius}
                fill="none"
                stroke={n.colorHex}
                strokeOpacity={isCore ? 0.28 : 0.18}
                strokeWidth={1}
                className={isCore ? 'biolens-ring biolens-ring--core' : 'biolens-ring'}
              />
              <circle cx={n.x} cy={n.y} r={radius} fill="#0a0a0a" stroke={n.colorHex} strokeWidth={1.25} />
              <text
                x={n.x}
                y={n.y + (isCore ? 4 : 26)}
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
                fontSize={isCore ? 12 : 10}
                fill={isCore ? '#e5e5e5' : '#a3a3a3'}
                opacity={isCore ? 1 : 0.9}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Scanning overlay */}
      <g aria-hidden="true" className="biolens-scan">
        <animateTransform
          attributeName="transform"
          type="translate"
          from="-260 0"
          to="1260 0"
          dur="6.5s"
          repeatCount="indefinite"
        />
        <rect x="-260" y="0" width="260" height="560" fill="url(#biolensScan)" />
      </g>
    </svg>
  );
};
