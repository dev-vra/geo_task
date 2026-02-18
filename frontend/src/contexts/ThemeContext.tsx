import { createContext, useContext, useState, ReactNode } from 'react';

export interface Theme {
  bg: string; sb: string; card: string; header: string;
  text: string; sub: string; border: string;
  inp: string; hover: string;
  col: string; tag: string; tagText: string; mmBg: string; section: string;
}

const darkTheme: Theme = {
  bg: '#030712', sb: '#111827', card: '#1f2937', header: '#111827',
  text: '#f9fafb', sub: '#9ca3af', border: '#374151',
  inp: '#374151', hover: 'rgba(255,255,255,0.05)',
  col: '#111827', tag: '#374151', tagText: '#d1d5db', mmBg: '#0f172a', section: '#111827',
};

const lightTheme: Theme = {
  bg: '#f8fafc', sb: '#ffffff', card: '#ffffff', header: '#ffffff',
  text: '#0f172a', sub: '#64748b', border: '#e2e8f0',
  inp: '#f1f5f9', hover: 'rgba(0,0,0,0.04)',
  col: '#f1f5f9', tag: '#e0e7ff', tagText: '#4338ca', mmBg: '#f1f5f9', section: '#f8fafc',
};

interface ThemeContextValue {
  dark: boolean;
  setDark: (v: boolean) => void;
  T: Theme;
}

const ThemeContext = createContext<ThemeContextValue>(null!);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const T = dark ? darkTheme : lightTheme;
  return (
    <ThemeContext.Provider value={{ dark, setDark, T }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
