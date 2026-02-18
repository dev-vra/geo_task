import { Theme } from '../../contexts/ThemeContext';

interface FormSelectProps {
  T: Theme;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: boolean;
}

export default function FormSelect({ T, value, onChange, options, placeholder, error }: FormSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', padding: '9px 12px', borderRadius: 8,
        border: `1px solid ${error ? '#ef4444' : T.border}`,
        background: T.inp, color: value ? T.text : T.sub,
        fontSize: 13, outline: 'none', boxSizing: 'border-box',
      }}
    >
      <option value="">{placeholder || 'Selecionar...'}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
