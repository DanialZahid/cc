import { layoutNFA } from '../logic/layout';

export default function NFACanvas({ nfa }) {
  if (!nfa) return null;

  const { start, accept, transitions } = nfa;
  const { pos, R } = layoutNFA(nfa);
  const W = 700,
    H = 320;

  // Group transitions by from→to for label merging
  const edgeMap = {};
  transitions.forEach(([f, lbl, t]) => {
    const key = `${f}__${t}`;
    edgeMap[key] = edgeMap[key] || { from: f, to: t, labels: [] };
    edgeMap[key].labels.push(lbl);
  });

  const allStates = new Set([start, accept]);
  transitions.forEach(([f, , t]) => {
    allStates.add(f);
    allStates.add(t);
  });

  return (
    <div className='canvas-wrap'>
      <svg width='100%' viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <marker
            id='arr'
            markerWidth='8'
            markerHeight='8'
            refX='7'
            refY='3'
            orient='auto'
          >
            <path d='M0,0 L0,6 L8,3 z' fill='#888' />
          </marker>
          <marker
            id='arr-eps'
            markerWidth='8'
            markerHeight='8'
            refX='7'
            refY='3'
            orient='auto'
          >
            <path d='M0,0 L0,6 L8,3 z' fill='#bbb' />
          </marker>
        </defs>

        {/* Edges */}
        {Object.values(edgeMap).map(({ from, to, labels }, i) => {
          const label = labels.join(',');
          const isEps = labels.every((l) => l === 'ε');
          const col = isEps ? '#bbb' : '#555';
          const marker = isEps ? 'url(#arr-eps)' : 'url(#arr)';
          const [x1, y1] = pos[from];
          const [x2, y2] = pos[to];

          if (from === to) {
            return (
              <g key={i}>
                <path
                  d={`M${x1 + R * 0.5},${y1 - R} A${R},${R} 0 1,1 ${x1 + R},${y1 - R * 0.5}`}
                  fill='none'
                  stroke={col}
                  strokeWidth='1.5'
                  markerEnd={marker}
                />
                <text
                  x={x1 + R + 18}
                  y={y1 - R - 8}
                  fontSize='11'
                  fill={col}
                  textAnchor='middle'
                >
                  {label}
                </text>
              </g>
            );
          }

          const dx = x2 - x1,
            dy = y2 - y1;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const ux = dx / len,
            uy = dy / len;
          const sx = x1 + ux * R,
            sy = y1 + uy * R;
          const ex = x2 - ux * (R + 2),
            ey = y2 - uy * (R + 2);
          const mx = (sx + ex) / 2 - uy * 16;
          const my = (sy + ey) / 2 + ux * 16;

          return (
            <g key={i}>
              <path
                d={`M${sx},${sy} Q${mx},${my} ${ex},${ey}`}
                fill='none'
                stroke={col}
                strokeWidth='1.5'
                markerEnd={marker}
              />
              <text
                x={(sx + ex) / 2 - uy * 26}
                y={(sy + ey) / 2 + ux * 26}
                fontSize='11'
                fill={col}
                textAnchor='middle'
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* States */}
        {[...allStates].map((s) => {
          const [x, y] = pos[s];
          const isStart = s === start;
          const isAccept = s === accept;
          const fill = isStart ? '#e1f5ee' : isAccept ? '#eeedfe' : '#f5f5f3';
          const stroke = isStart ? '#0f6e56' : isAccept ? '#534ab7' : '#aaa';
          return (
            <g key={s}>
              <circle
                cx={x}
                cy={y}
                r={R}
                fill={fill}
                stroke={stroke}
                strokeWidth={isStart ? 2 : 1.5}
              />
              {isAccept && (
                <circle
                  cx={x}
                  cy={y}
                  r={R - 4}
                  fill='none'
                  stroke={stroke}
                  strokeWidth='1'
                />
              )}
              <text
                x={x}
                y={y + 4}
                fontSize='12'
                fill={stroke}
                textAnchor='middle'
                fontWeight='500'
              >
                q{s}
              </text>
              {isStart && (
                <>
                  <line
                    x1={x - R - 24}
                    y1={y}
                    x2={x - R - 2}
                    y2={y}
                    stroke='#0f6e56'
                    strokeWidth='1.5'
                    markerEnd='url(#arr)'
                  />
                  <text
                    x={x - R - 28}
                    y={y - 7}
                    fontSize='10'
                    fill='#0f6e56'
                    textAnchor='middle'
                  >
                    start
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      <div className='legend'>
        <span className='legend-item start'>● Start</span>
        <span className='legend-item accept'>◎ Accept</span>
        <span className='legend-item inter'>○ Intermediate</span>
        <span className='eps-note'>Dashed/gray arrows = ε transitions</span>
      </div>
    </div>
  );
}
