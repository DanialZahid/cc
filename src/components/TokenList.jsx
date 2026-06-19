const TYPE_LABEL = {
  NUMBER: 'Number',
  OP: 'Operator',
  LPAREN: 'Left Paren',
  RPAREN: 'Right Paren',
};

export default function TokenList({ tokens }) {
  if (!tokens || tokens.length === 0) return null;

  return (
    <div className='table-wrap'>
      <h3>Token Stream</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Token</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t, i) => (
            <tr key={i}>
              <td>{i}</td>
              <td>
                <code>{t.value}</code>
              </td>
              <td>
                <span className={`badge badge-${t.type.toLowerCase()}`}>
                  {TYPE_LABEL[t.type]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
