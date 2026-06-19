export default function TransitionTable({ nfa }) {
  if (!nfa) return null;
  const { transitions, start, accept } = nfa;

  return (
    <div className='table-wrap'>
      <h3>Transition Table</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>From</th>
            <th>On</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          {transitions.map(([f, lbl, t], i) => (
            <tr key={i}>
              <td>{i}</td>
              <td>
                q{f}
                {f === start && (
                  <span className='badge start-badge'>start</span>
                )}
                {f === accept && (
                  <span className='badge accept-badge'>accept</span>
                )}
              </td>
              <td>
                <code>{lbl}</code>
              </td>
              <td>
                q{t}
                {t === accept && (
                  <span className='badge accept-badge'>accept</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
