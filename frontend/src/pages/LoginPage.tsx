import { useState } from 'react';
import { MapPin, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Role, ROLE_LABEL } from '../types';

const ROLES: Role[] = ['ADMIN', 'COORDENADOR', 'GERENTE', 'GESTOR', 'LIDERADO'];

export default function LoginPage() {
  const { dark, setDark, T } = useTheme();
  const { login } = useAuth();
  const [loginRole, setLoginRole] = useState<Role>('ADMIN');

  return (
    <div style={{
      minHeight: '100vh',
      background: dark ? '#030712' : 'linear-gradient(135deg,#ede9fe,#dbeafe)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui,sans-serif',
    }}>
      <div style={{
        width: '100%', maxWidth: 400, background: T.card,
        borderRadius: 20, padding: 36,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        border: `1px solid ${T.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, background: '#4f46e5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={20} color="white" />
          </div>
          <span style={{ fontSize: 24, fontWeight: 700, color: T.text }}>GeoTask</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: T.sub, display: 'block', marginBottom: 6 }}>E-MAIL</label>
            <input
              defaultValue="admin@geotask.com"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.inp, color: T.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: T.sub, display: 'block', marginBottom: 6 }}>SENHA</label>
            <input
              type="password"
              defaultValue="123456"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.inp, color: T.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: T.sub, display: 'block', marginBottom: 6 }}>PERFIL</label>
            <select
              value={loginRole}
              onChange={(e) => setLoginRole(e.target.value as Role)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.inp, color: T.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            >
              {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
            </select>
          </div>
          <button
            onClick={() => login(loginRole)}
            style={{ padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
          >
            Entrar
          </button>
        </div>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button
            onClick={() => setDark(!dark)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.sub, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            {dark ? <Sun size={13} /> : <Moon size={13} />}
            {dark ? ' Modo claro' : ' Modo escuro'}
          </button>
        </div>
      </div>
    </div>
  );
}
