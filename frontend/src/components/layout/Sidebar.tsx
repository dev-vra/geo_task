import {
  LayoutDashboard, Layers, Map, Calendar, FileText, Settings,
  MapPin, LogOut, AlignLeft,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  page: string;
  setPage: (p: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

export default function Sidebar({ page, setPage, open, setOpen }: SidebarProps) {
  const { T } = useTheme();
  const { user, logout } = useAuth();
  if (!user) return null;

  const canAccess = (p: string) => {
    if (p === 'templates' && user.role === 'LIDERADO') return false;
    if (p === 'settings' && user.role !== 'ADMIN') return false;
    return true;
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kanban', label: 'Kanban', icon: Layers },
    { id: 'mindmap', label: 'Mapa Mental', icon: Map },
    { id: 'cronograma', label: 'Cronograma', icon: Calendar },
    ...(canAccess('templates') ? [{ id: 'templates', label: 'Templates', icon: FileText }] : []),
    ...(canAccess('settings') ? [{ id: 'settings', label: 'Configurações', icon: Settings }] : []),
  ];

  return (
    <div style={{
      width: open ? 220 : 60, flexShrink: 0, background: T.sb,
      borderRight: `1px solid ${T.border}`, display: 'flex',
      flexDirection: 'column', transition: 'width 0.2s',
    }}>
      <div style={{
        height: 60, display: 'flex', alignItems: 'center',
        justifyContent: open ? 'flex-start' : 'center',
        padding: open ? '0 16px' : '0',
        borderBottom: `1px solid ${T.border}`, gap: 10,
      }}>
        <div style={{
          width: 34, height: 34, background: '#4f46e5', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <MapPin size={16} color="white" />
        </div>
        {open && <span style={{ fontWeight: 700, fontSize: 18, color: T.text }}>GeoTask</span>}
      </div>

      <nav style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              title={label}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: open ? '10px 12px' : '10px',
                justifyContent: open ? 'flex-start' : 'center',
                borderRadius: 10, border: 'none',
                background: active ? '#4f46e5' : 'transparent',
                color: active ? 'white' : T.sub,
                fontSize: 13, fontWeight: active ? 600 : 500,
                cursor: 'pointer', transition: 'all 0.15s', width: '100%',
              }}
            >
              <Icon size={17} />
              {open && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: 10, borderTop: `1px solid ${T.border}` }}>
        {open ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: '#4f46e5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              {user.avatar || user.name.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: T.sub }}>{user.role}</div>
            </div>
            <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
              <LogOut size={14} color={T.sub} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: '#4f46e5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 11, fontWeight: 700,
            }}>
              {user.avatar || user.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
