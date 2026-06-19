let stateId = 0;
const newState = () => stateId++;

function frag(start, accept, transitions) {
  return { start, accept, transitions };
}

function literal(ch) {
  const s = newState(),
    e = newState();
  return frag(s, e, [[s, ch, e]]);
}

function epsilon() {
  const s = newState(),
    e = newState();
  return frag(s, e, [[s, 'ε', e]]);
}

function concat(a, b) {
  return frag(a.start, b.accept, [
    ...a.transitions,
    ...b.transitions,
    [a.accept, 'ε', b.start],
  ]);
}

function union(a, b) {
  const s = newState(),
    e = newState();
  return frag(s, e, [
    ...a.transitions,
    ...b.transitions,
    [s, 'ε', a.start],
    [s, 'ε', b.start],
    [a.accept, 'ε', e],
    [b.accept, 'ε', e],
  ]);
}

function star(a) {
  const s = newState(),
    e = newState();
  return frag(s, e, [
    ...a.transitions,
    [s, 'ε', a.start],
    [s, 'ε', e],
    [a.accept, 'ε', a.start],
    [a.accept, 'ε', e],
  ]);
}

function plus(a) {
  // a+ = a.a*  (one a, then a*)
  const astar = star({ ...a, transitions: a.transitions.map((t) => [...t]) });
  return frag(a.start, astar.accept, [
    ...a.transitions,
    ...astar.transitions,
    [a.accept, 'ε', astar.start],
  ]);
}

function optional(a) {
  const s = newState(),
    e = newState();
  return frag(s, e, [
    ...a.transitions,
    [s, 'ε', a.start],
    [s, 'ε', e],
    [a.accept, 'ε', e],
  ]);
}

export function buildNFA(postfix) {
  stateId = 0;
  const stack = [];

  for (const c of postfix) {
    if (c === '.') {
      const b = stack.pop(),
        a = stack.pop();
      stack.push(concat(a, b));
    } else if (c === '|') {
      const b = stack.pop(),
        a = stack.pop();
      stack.push(union(a, b));
    } else if (c === '*') {
      stack.push(star(stack.pop()));
    } else if (c === '+') {
      stack.push(plus(stack.pop()));
    } else if (c === '?') {
      stack.push(optional(stack.pop()));
    } else {
      stack.push(literal(c));
    }
  }

  return stack[0] || epsilon();
}
