import { Theme } from '../../contexts/ThemeContext';

interface FormTextareaProps {
  T: Theme;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function FormTextarea({ T, value, onChange, placeholder, rows = 3 }: FormTextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', padding: '9px 12px', borderRadius: 8,
        border: `1px solid ${T.border}`, background: T.inp,
        color: T.text, fontSize: 13, outline: 'none',
        resize: 'vertical', boxSizing: 'border-box', fontFamily: 'system-ui',
      }}
    />
  );
}
