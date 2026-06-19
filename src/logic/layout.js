const H_GAP = 60; // vertical distance between levels
const MIN_W = 48; // minimum horizontal space per leaf

function computeLayout(node, depth = 0) {
  if (!node) return;

  if (node.type === 'leaf') {
    node._w = MIN_W;
    node._depth = depth;
    return;
  }

  computeLayout(node.left, depth + 1);
  computeLayout(node.right, depth + 1);
  node._w = node.left._w + node.right._w;
  node._depth = depth;
}

function assignX(node, x = 0) {
  if (!node) return;
  if (node.type === 'leaf') {
    node._x = x + MIN_W / 2;
    return;
  }
  assignX(node.left, x);
  assignX(node.right, x + node.left._w);
  node._x = x + node.left._w; // center above children split
}

export function layoutTree(root) {
  computeLayout(root);
  assignX(root);

  // Collect all nodes with positions
  const nodes = [];
  const edges = [];

  function collect(node, parentX = null, parentY = null) {
    if (!node) return;
    const x = node._x;
    const y = 60 + node._depth * H_GAP;

    nodes.push({ node, x, y });

    if (parentX !== null)
      edges.push({ x1: parentX, y1: parentY, x2: x, y2: y });

    if (node.type === 'node') {
      collect(node.left, x, y);
      collect(node.right, x, y);
    }
  }

  collect(root);

  // Normalize x to fit in view
  const minX = Math.min(...nodes.map((n) => n.x));
  const maxX = Math.max(...nodes.map((n) => n.x));
  const maxY = Math.max(...nodes.map((n) => n.y));
  const offsetX = -minX + 40;

  nodes.forEach((n) => {
    n.x = n.x + offsetX;
  });
  edges.forEach((e) => {
    e.x1 += offsetX;
    e.x2 += offsetX;
  });

  return { nodes, edges, width: maxX - minX + 80, height: maxY + 60 };
}
