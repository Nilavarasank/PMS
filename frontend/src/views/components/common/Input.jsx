export default function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  required = false,
}) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">
        {label}
        {required ? <span className="required"> *</span> : null}
      </span>
      <input
        id={id}
        className={`field-input ${error ? 'has-error' : ''}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}
