// Inserts explicit concatenation operator '.' between tokens
export function addConcat(re) {
  const result = [];
  const binary = new Set(['|']);
  const postfix = new Set(['*', '+', '?']);

  for (let i = 0; i < re.length; i++) {
    const c = re[i];
    result.push(c);
    if (i + 1 < re.length) {
      const next = re[i + 1];
      if (
        !binary.has(c) &&
        c !== '(' &&
        !postfix.has(next) &&
        next !== ')' &&
        !binary.has(next)
      ) {
        result.push('.');
      }
    }
  }
  return result.join('');
}

// Converts infix regex to postfix using shunting-yard
export function toPostfix(re) {
  const output = [];
  const stack = [];
  const precedence = { '|': 1, '.': 2, '?': 3, '*': 3, '+': 3 };

  for (const c of addConcat(re)) {
    if (c === '(') {
      stack.push(c);
    } else if (c === ')') {
      while (stack.length && stack[stack.length - 1] !== '(')
        output.push(stack.pop());
      stack.pop();
    } else if (precedence[c] !== undefined) {
      while (
        stack.length &&
        stack[stack.length - 1] !== '(' &&
        (precedence[stack[stack.length - 1]] ?? 0) >= precedence[c]
      )
        output.push(stack.pop());
      stack.push(c);
    } else {
      output.push(c);
    }
  }
  while (stack.length) output.push(stack.pop());
  return output.join('');
}
