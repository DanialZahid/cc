const EXAMPLES = ['a*b', '(a|b)*', 'ab+', 'a?(b|c)*', '(a|b)*ab', 'a+|b+'];

export default function RegexInput({ value, onChange, onSubmit, error }) {
  return (
    <div className='input-section'>
      <div className='input-row'>
        <input
          type='text'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder='Enter regex e.g. (a|b)*ab'
          className={error ? 'has-error' : ''}
          spellCheck={false}
        />
        <button onClick={onSubmit}>Build NFA</button>
      </div>

      {error && <p className='error'>{error}</p>}

      <div className='chips'>
        <span className='chips-label'>Examples:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            className='chip'
            onClick={() => {
              onChange(ex);
              onSubmit(ex);
            }}
          >
            {ex}
          </button>
        ))}
      </div>

      <p className='supported'>
        Supported: literals · <code>|</code> union · <code>*</code> star ·{' '}
        <code>+</code> plus · <code>?</code> optional · <code>()</code> grouping
      </p>
    </div>
  );
}
