import { layoutTree } from '../logic/layout';

const R = 22;

export default function TreeCanvas({ tree }) {
  if (!tree) return null;

  const { nodes, edges, width, height } = layoutTree(tree);
  const svgW = Math.max(width, 300);
  const svgH = Math.max(height + 40, 160);

  return (
    <div className='canvas-wrap'>
      <h3>Parse Tree</h3>
      <svg width='100%' viewBox={`0 0 ${svgW} ${svgH}`}>
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke='#ccc'
            strokeWidth='1.5'
          />
        ))}

        {nodes.map(({ node, x, y }, i) => {
          const isLeaf = node.type === 'leaf';
          const label = isLeaf ? node.value : node.op;
          const fill = isLeaf ? '#e1f5ee' : '#eeedfe';
          const stroke = isLeaf ? '#0f6e56' : '#534ab7';
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={R}
                fill={fill}
                stroke={stroke}
                strokeWidth='1.5'
              />
              <text
                x={x}
                y={y + 5}
                fontSize='13'
                fontWeight='500'
                fill={stroke}
                textAnchor='middle'
                fontFamily='monospace'
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
