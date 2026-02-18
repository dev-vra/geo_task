import { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export default function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <div>
      <label
        style={{
          fontSize: 11, fontWeight: 700,
          color: error ? '#ef4444' : '#9ca3af',
          display: 'flex', alignItems: 'center', gap: 4,
          marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em',
        }}
      >
        {label}
        {required && <span style={{ color: '#ef4444' }}>*</span>}
        {error && (
          <span style={{ fontSize: 10, fontWeight: 600, color: '#ef4444', marginLeft: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <AlertCircle size={10} />{error}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
