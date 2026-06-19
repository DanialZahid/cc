export function tokenize(expr) {
  const tokens = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    if (ch === ' ') {
      i++;
      continue;
    }

    if (/[0-9]/.test(ch)) {
      let num = '';
      while (i < expr.length && /[0-9.]/.test(expr[i])) num += expr[i++];
      tokens.push({ type: 'NUMBER', value: num });
      continue;
    }

    if ('+-*/()^'.includes(ch)) {
      tokens.push({
        type: ch === '(' ? 'LPAREN' : ch === ')' ? 'RPAREN' : 'OP',
        value: ch,
      });
      i++;
      continue;
    }

    throw new Error(`Unknown character: '${ch}'`);
  }

  return tokens;
}
