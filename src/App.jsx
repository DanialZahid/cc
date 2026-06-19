import { useState, useCallback } from 'react';
import RegexInput from './components/RegexInput';
import NFACanvas from './components/NFACanvas';
import TransitionTable from './components/TransitionTable';
import { toPostfix } from './logic/parser';
import { buildNFA } from './logic/thompson';

function validate(re) {
  if (!re.trim()) return 'Please enter a regular expression.';
  if (/[^a-zA-Z0-9|*+?()\s]/.test(re)) return `Invalid character in regex.`;
  let depth = 0;
  for (const c of re) {
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (depth < 0) return 'Mismatched parentheses.';
  }
  if (depth !== 0) return 'Unclosed parenthesis.';
  if (/^[|*+?]/.test(re)) return 'Regex cannot start with an operator.';
  if (/[|][|]/.test(re)) return 'Invalid: consecutive | operators.';
  return null;
}

export default function App() {
  const [input, setInput] = useState('(a|b)*ab');
  const [nfa, setNfa] = useState(null);
  const [error, setError] = useState(null);

  const build = useCallback(
    (val) => {
      const re = (typeof val === 'string' ? val : input).trim();
      const err = validate(re);
      if (err) {
        setError(err);
        setNfa(null);
        return;
      }
      try {
        const postfix = toPostfix(re);
        const result = buildNFA(postfix);
        setNfa(result);
        setError(null);
      } catch (e) {
        setError(e.message);
        setNfa(null);
      }
    },
    [input],
  );

  // Build on first load
  useState(() => build('(a|b)*ab'));

  return (
    <div className='app'>
      <header>
        <h1>Regex → NFA Visualizer</h1>
        <p>
          Thompson's Construction — enter a regular expression to visualize its
          NFA
        </p>
      </header>

      <main>
        <RegexInput
          value={input}
          onChange={setInput}
          onSubmit={build}
          error={error}
        />
        <NFACanvas nfa={nfa} />
        <TransitionTable nfa={nfa} />
      </main>
    </div>
  );
}
