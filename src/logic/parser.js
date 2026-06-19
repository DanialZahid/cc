// Precedence levels:
// expr     → term ((+|-) term)*
// term     → factor ((*|/) factor)*
// factor   → base (^ factor)?      (right-associative)
// base     → NUMBER | '(' expr ')'

let tokens = [];
let pos = 0;

function peek() {
  return tokens[pos];
}
function consume() {
  return tokens[pos++];
}

function parseExpr() {
  let left = parseTerm();
  while (peek() && peek().type === 'OP' && '+-'.includes(peek().value)) {
    const op = consume().value;
    const right = parseTerm();
    left = { type: 'node', op, left, right };
  }
  return left;
}

function parseTerm() {
  let left = parseFactor();
  while (peek() && peek().type === 'OP' && '*/'.includes(peek().value)) {
    const op = consume().value;
    const right = parseFactor();
    left = { type: 'node', op, left, right };
  }
  return left;
}

function parseFactor() {
  const left = parseBase();
  if (peek() && peek().type === 'OP' && peek().value === '^') {
    const op = consume().value;
    const right = parseFactor(); // right-associative
    return { type: 'node', op, left, right };
  }
  return left;
}

function parseBase() {
  const t = peek();
  if (!t) throw new Error('Unexpected end of expression');

  if (t.type === 'NUMBER') {
    consume();
    return { type: 'leaf', value: t.value };
  }

  if (t.type === 'LPAREN') {
    consume();
    const node = parseExpr();
    if (!peek() || peek().type !== 'RPAREN')
      throw new Error('Missing closing parenthesis');
    consume();
    return node;
  }

  throw new Error(`Unexpected token: '${t.value}'`);
}

export function buildTree(tokenList) {
  tokens = tokenList;
  pos = 0;
  const tree = parseExpr();
  if (peek()) throw new Error(`Unexpected token: '${peek().value}'`);
  return tree;
}

export function evaluate(node) {
  if (node.type === 'leaf') return parseFloat(node.value);
  const l = evaluate(node.left);
  const r = evaluate(node.right);
  switch (node.op) {
    case '+':
      return l + r;
    case '-':
      return l - r;
    case '*':
      return l * r;
    case '/':
      return l / r;
    case '^':
      return Math.pow(l, r);
  }
}
