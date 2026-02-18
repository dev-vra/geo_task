import { Sun, Moon, Bell, Search, AlignLeft } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Role, ROLE_LABEL } from '../../types';

const ROLES: Role[] = ['ADMIN', 'COORDENADOR', 'GERENTE', 'GESTOR', 'LIDERADO'];

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { dark, setDark, T } = useTheme();
  const { user, switchRole } = useAuth();

  return (
    <div style={{
      height: 60, background: T.header,
      borderBottom: `1px solid ${T.border}`,
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0,
    }}>
      <button
        onClick={onToggleSidebar}
        style={{ background: T.inp, border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex' }}
      >
        <AlignLeft size={16} color={T.sub} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.inp, borderRadius: 10, padding: '6px 12px', flex: '0 0 220px' }}>
        <Search size={13} color={T.sub} />
        <input
          placeholder="Buscar tarefas..."
          style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: T.text, width: '100%' }}
        />
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={() => setDark(!dark)}
        style={{ background: T.inp, border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex' }}
      >
        {dark ? <Sun size={16} color={T.sub} /> : <Moon size={16} color={T.sub} />}
      </button>

      <button style={{ background: T.inp, border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex', position: 'relative' }}>
        <Bell size={16} color={T.sub} />
        <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, background: '#ef4444', borderRadius: '50%' }} />
      </button>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: T.sub }}>Perfil:</span>
          <select
            value={user.role}
            onChange={(e) => switchRole(e.target.value as Role)}
            style={{
              fontSize: 12, padding: '4px 8px', borderRadius: 8,
              border: `1px solid ${T.border}`, background: T.inp,
              color: T.text, cursor: 'pointer', outline: 'none',
            }}
          >
            {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}
