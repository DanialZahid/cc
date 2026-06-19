const EXAMPLES = ['3+5*2', '(3+5)*2', '10-2^3', '(1+2)*(3+4)', '100/5+3*2'];

export default function ExpressionInput({
  value,
  onChange,
  onSubmit,
  error,
  result,
}) {
  return (
    <div className='input-section'>
      <div className='input-row'>
        <input
          type='text'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder='e.g. 3 + 5 * 2'
          className={error ? 'has-error' : ''}
          spellCheck={false}
        />
        <button onClick={() => onSubmit()}>Parse</button>
      </div>

      {error && <p className='error'>{error}</p>}

      {result !== null && !error && (
        <p className='result'>
          = <strong>{result}</strong>
        </p>
      )}

      <div className='chips'>
        <span className='chips-label'>Examples:</span>
        {EXAMPLES.map((ex) => (
          <button key={ex} className='chip' onClick={() => onSubmit(ex)}>
            {ex}
          </button>
        ))}
      </div>

      <p className='supported'>
        Supported: <code>+ - * / ^</code> operators · integers · <code>()</code>{' '}
        grouping
      </p>
    </div>
  );
}
