import React from 'react';

type BioCoreTotemProps = {
  className?: string;
};

export const BioCoreTotem: React.FC<BioCoreTotemProps> = ({ className }) => {
  const paths = {
    dnaIn: 'M 78 66 C 118 54 142 70 168 90 C 178 98 186 108 192 120',
    docIn: 'M 78 120 C 118 120 146 120 192 120',
    ecgIn: 'M 78 174 C 118 186 142 170 168 150 C 178 142 186 132 192 120',
    out1: 'M 192 120 C 226 96 254 86 286 82 C 304 80 316 80 332 80',
    out2: 'M 192 120 C 234 120 270 120 332 120',
    out3: 'M 192 120 C 226 144 254 154 286 158 C 304 160 316 160 332 160',
  } as const;

  return (
    <svg
      className={className}
      viewBox="0 0 360 240"
      role="img"
      aria-label="BioLens data flow into BioCore"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="biolensTotemGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 0.75 0
            "
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="flowDna" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b967ff" stopOpacity="0.15" />
          <stop offset="45%" stopColor="#b967ff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#00f2ff" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="flowDoc" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.12" />
          <stop offset="45%" stopColor="#00f2ff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#00ff9d" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="flowEcg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff2a6d" stopOpacity="0.12" />
          <stop offset="45%" stopColor="#ff2a6d" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffcc00" stopOpacity="0.16" />
        </linearGradient>
        <linearGradient id="flowOut" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#e5e5e5" stopOpacity="0.12" />
        </linearGradient>

        <radialGradient id="coreFill" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#00f2ff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#00f2ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Subtle grid */}
      <g aria-hidden="true" opacity="0.08">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h-${i}`} x1="10" y1={20 + i * 24} x2="350" y2={20 + i * 24} stroke="#262626" />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`v-${i}`} x1={20 + i * 32} y1="14" x2={20 + i * 32} y2="226" stroke="#262626" />
        ))}
      </g>

      {/* Streams + core */}
      <g filter="url(#biolensTotemGlow)">
        {/* Incoming lines */}
        <path
          d={paths.dnaIn}
          fill="none"
          stroke="url(#flowDna)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="10 14"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-220" dur="3.8s" repeatCount="indefinite" />
        </path>
        <path
          d={paths.docIn}
          fill="none"
          stroke="url(#flowDoc)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="10 14"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-220" dur="3.1s" repeatCount="indefinite" />
        </path>
        <path
          d={paths.ecgIn}
          fill="none"
          stroke="url(#flowEcg)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="10 14"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-220" dur="3.5s" repeatCount="indefinite" />
        </path>

        {/* Outgoing lines */}
        {[paths.out1, paths.out2, paths.out3].map((d, idx) => (
          <path
            key={`out-${idx}`}
            d={d}
            fill="none"
            stroke="url(#flowOut)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="8 14"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-260" dur={`${4.4 + idx * 0.6}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.22;0.44;0.22" dur={`${3.2 + idx * 0.5}s`} repeatCount="indefinite" />
          </path>
        ))}

        {/* Data packets in */}
        {[
          { id: 'p-dna-1', path: paths.dnaIn, color: '#b967ff', dur: '2.7s', begin: '0s' },
          { id: 'p-dna-2', path: paths.dnaIn, color: '#00f2ff', dur: '2.7s', begin: '-1.3s' },
          { id: 'p-doc-1', path: paths.docIn, color: '#00f2ff', dur: '2.3s', begin: '-0.4s' },
          { id: 'p-doc-2', path: paths.docIn, color: '#00ff9d', dur: '2.3s', begin: '-1.6s' },
          { id: 'p-ecg-1', path: paths.ecgIn, color: '#ff2a6d', dur: '2.6s', begin: '-0.9s' },
          { id: 'p-ecg-2', path: paths.ecgIn, color: '#ffcc00', dur: '2.6s', begin: '-1.9s' },
        ].map((p) => (
          <circle key={p.id} r="2.2" fill={p.color} opacity="0.8">
            <animateMotion dur={p.dur} repeatCount="indefinite" path={p.path} begin={p.begin} />
          </circle>
        ))}

        {/* Data packets out */}
        {[
          { id: 'p-out-1', path: paths.out1, color: '#00f2ff', dur: '2.8s', begin: '-0.8s' },
          { id: 'p-out-2', path: paths.out2, color: '#00ff9d', dur: '2.4s', begin: '-1.4s' },
          { id: 'p-out-3', path: paths.out3, color: '#b967ff', dur: '3.0s', begin: '-1.1s' },
        ].map((p) => (
          <circle key={p.id} r="2.0" fill={p.color} opacity="0.65">
            <animateMotion dur={p.dur} repeatCount="indefinite" path={p.path} begin={p.begin} />
          </circle>
        ))}

        {/* Left icons */}
        <g aria-hidden="true" transform="translate(28 42)">
          {/* DNA helix */}
          <path
            d="M 18 8 C 30 18 30 34 18 44 C 6 54 6 70 18 80"
            fill="none"
            stroke="#b967ff"
            strokeOpacity="0.7"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="6 10"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-120" dur="3.6s" repeatCount="indefinite" />
          </path>
          <path
            d="M 34 8 C 22 18 22 34 34 44 C 46 54 46 70 34 80"
            fill="none"
            stroke="#00f2ff"
            strokeOpacity="0.6"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="6 10"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-120" dur="3.2s" repeatCount="indefinite" />
          </path>
          {Array.from({ length: 6 }, (_, i) => (
            <line
              key={`rung-${i}`}
              x1="18"
              y1={18 + i * 12}
              x2="34"
              y2={18 + i * 12}
              stroke="#262626"
              strokeOpacity="0.9"
              strokeWidth="1"
            />
          ))}
        </g>

        <g aria-hidden="true" transform="translate(26 102)">
          {/* Documents */}
          <rect x="8" y="8" width="34" height="42" fill="none" stroke="#00f2ff" strokeOpacity="0.55" strokeWidth="1.2" />
          <rect x="14" y="2" width="34" height="42" fill="none" stroke="#00ff9d" strokeOpacity="0.35" strokeWidth="1.2" />
          <line x1="14" y1="18" x2="38" y2="18" stroke="#262626" strokeWidth="1" />
          <line x1="14" y1="26" x2="44" y2="26" stroke="#262626" strokeWidth="1" />
          <line x1="14" y1="34" x2="40" y2="34" stroke="#262626" strokeWidth="1" />
        </g>

        <g aria-hidden="true" transform="translate(22 162)">
          {/* ECG wave */}
          <path
            d="M 10 26 L 20 26 L 26 18 L 32 38 L 40 12 L 48 26 L 62 26"
            fill="none"
            stroke="#ff2a6d"
            strokeOpacity="0.7"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray="18 16"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-220" dur="2.2s" repeatCount="indefinite" />
          </path>
          <line x1="10" y1="26" x2="62" y2="26" stroke="#262626" strokeOpacity="0.7" strokeWidth="1" />
        </g>

        {/* Right nodes */}
        {[
          { y: 80, label: 'PGX' },
          { y: 120, label: 'PLAN' },
          { y: 160, label: 'EVID' },
        ].map((n) => (
          <g key={n.label} aria-hidden="true">
            <circle cx="336" cy={n.y} r="6.5" fill="#0a0a0a" stroke="#262626" strokeWidth="1" />
            <circle cx="336" cy={n.y} r="3.2" fill="#00f2ff" opacity="0.45">
              <animate attributeName="opacity" values="0.25;0.65;0.25" dur="2.6s" repeatCount="indefinite" />
            </circle>
            <text
              x="350"
              y={n.y + 4}
              fontFamily="JetBrains Mono, monospace"
              fontSize="10"
              fill="#a3a3a3"
              opacity="0.95"
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* Core */}
        <circle cx="192" cy="120" r="64" fill="url(#coreFill)" opacity="0.9" />
        <circle cx="192" cy="120" r="18" fill="#0a0a0a" stroke="#00f2ff" strokeOpacity="0.85" strokeWidth="1.5" />
        <circle cx="192" cy="120" r="26" fill="none" stroke="#00f2ff" strokeOpacity="0.25" strokeWidth="1">
          <animate attributeName="stroke-opacity" values="0.15;0.4;0.15" dur="2.3s" repeatCount="indefinite" />
        </circle>
        {[
          { r0: 28, r1: 46, dur: '2.8s', begin: '0s' },
          { r0: 32, r1: 52, dur: '2.8s', begin: '-1.3s' },
        ].map((ring, idx) => (
          <circle
            key={`pulse-${idx}`}
            cx="192"
            cy="120"
            r={ring.r0}
            fill="none"
            stroke="#00f2ff"
            strokeOpacity="0.3"
            strokeWidth="1"
          >
            <animate attributeName="r" from={ring.r0.toString()} to={ring.r1.toString()} dur={ring.dur} repeatCount="indefinite" begin={ring.begin} />
            <animate attributeName="opacity" values="0.35;0" dur={ring.dur} repeatCount="indefinite" begin={ring.begin} />
          </circle>
        ))}
        <text
          x="192"
          y="124"
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize="10"
          fill="#e5e5e5"
        >
          BIO_CORE
        </text>
        <text
          x="192"
          y="138"
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
          fill="#737373"
        >
          LIVE_FUSION
        </text>
      </g>
    </svg>
  );
};

