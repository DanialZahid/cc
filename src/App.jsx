import { useState, useCallback } from 'react';
import ExpressionInput from './components/ExpressionInput';
import TreeCanvas from './components/TreeCanvas';
import TokenList from './components/TokenList';
import { tokenize } from './logic/tokenizer';
import { buildTree, evaluate } from './logic/parser';

function getInitial(expr) {
  try {
    const toks = tokenize(expr);
    const tree = buildTree(toks);
    const res = evaluate(tree);
    return { toks, tree, res };
  } catch {
    return { toks: [], tree: null, res: null };
  }
}

const INITIAL = getInitial('3 + 5 * 2');

export default function App() {
  const [input, setInput] = useState('3 + 5 * 2');
  const [tree, setTree] = useState(INITIAL.tree);
  const [tokens, setTokens] = useState(INITIAL.toks);
  const [result, setResult] = useState(INITIAL.res);
  const [error, setError] = useState(null);

  const parse = useCallback(
    (val) => {
      const expr = (typeof val === 'string' ? val : input).trim();
      if (typeof val === 'string') setInput(val);

      if (!expr) {
        setError('Please enter an expression.');
        return;
      }

      try {
        const toks = tokenize(expr);
        const tree = buildTree(toks);
        const res = evaluate(tree);
        setTokens(toks);
        setTree(tree);
        setResult(res);
        setError(null);
      } catch (e) {
        setError(e.message);
        setTree(null);
        setTokens([]);
        setResult(null);
      }
    },
    [input],
  );

  return (
    <div className='app'>
      <header>
        <h1>Parse Tree Visualizer</h1>
        <p>
          Arithmetic Expression Parser — demonstrates tokenization, operator
          precedence &amp; syntax tree generation
        </p>
      </header>
      <main>
        <ExpressionInput
          value={input}
          onChange={setInput}
          onSubmit={parse}
          error={error}
          result={result}
        />
        <TreeCanvas tree={tree} />
        <TokenList tokens={tokens} />
      </main>
    </div>
  );
}
