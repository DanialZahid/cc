export function layoutNFA(nfa) {
  const { start, accept, transitions } = nfa;

  // Collect all states
  const all = new Set([start, accept]);
  transitions.forEach(([f, , t]) => {
    all.add(f);
    all.add(t);
  });
  const states = [...all];

  // BFS order from start for left-to-right feel
  const visited = new Set();
  const order = [];
  const queue = [start];
  while (queue.length) {
    const s = queue.shift();
    if (visited.has(s)) continue;
    visited.add(s);
    order.push(s);
    transitions.filter(([f]) => f === s).forEach(([, , t]) => queue.push(t));
  }
  // Any states not reached by BFS
  states.forEach((s) => {
    if (!visited.has(s)) order.push(s);
  });

  const W = 700,
    H = 320,
    R = 24,
    PAD = 70;
  const n = order.length;
  const cols = Math.min(n, Math.ceil(Math.sqrt(n * 2)));
  const rows = Math.ceil(n / cols);
  const cw = n > 1 ? (W - PAD * 2) / (cols - 1 || 1) : 0;
  const rh = rows > 1 ? (H - PAD * 2) / (rows - 1) : 0;

  const pos = {};
  order.forEach((s, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    pos[s] = [PAD + col * cw, PAD + row * rh];
  });

  return { states: order, pos, R };
}
