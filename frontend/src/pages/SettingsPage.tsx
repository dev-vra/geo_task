import { useState, useEffect } from 'react';
import { Users, Briefcase, Building2, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { User, Sector, ROLE_LABEL, Role } from '../types';
import { usersApi, sectorsApi } from '../services/api';

const ROLES: Role[] = ['ADMIN', 'COORDENADOR', 'GERENTE', 'GESTOR', 'LIDERADO'];

const PERMISSIONS = [
  ['Dashboard', '✅', '✅', '✅', '✅', '✅'],
  ['Kanban', '✅', '✅', '✅', '✅', '👁️'],
  ['Mapa Mental', '✅', '✅', '✅', '✅', '✅'],
  ['Cronograma', '✅', '✅', '✅', '✅', '✅'],
  ['Templates', '✅', '✅', '✅', '✅', '❌'],
  ['Criar tarefa', '✅', '✅', '✅', '✅', '❌'],
  ['Configurações', '✅', '❌', '❌', '❌', '❌'],
];

export default function SettingsPage() {
  const { T } = useTheme();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);

  useEffect(() => {
    usersApi.list().then(setUsers).catch(() => {});
    sectorsApi.list().then(setSectors).catch(() => {});
  }, []);

  const tabs = [
    { id: 'users', l: 'Usuários', icon: Users },
    { id: 'roles', l: 'Cargos', icon: Briefcase },
    { id: 'sectors', l: 'Setores', icon: Building2 },
    { id: 'permissions', l: 'Permissões', icon: Settings },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text }}>Configurações</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: T.sub }}>Gerencie usuários, cargos, setores e permissões</p>
      </div>

      <div style={{ display: 'flex', gap: 4, background: T.col, borderRadius: 10, padding: 4, width: 'fit-content', marginBottom: 20 }}>
        {tabs.map(({ id, l, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 7, border: 'none', background: tab === id ? '#4f46e5' : 'transparent', color: tab === id ? 'white' : T.sub, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Icon size={13} />{l}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Usuários ({users.length})</span>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={12} />Novo usuário
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1.2fr 100px', padding: '8px 16px', borderBottom: `1px solid ${T.border}` }}>
            {['Nome', 'E-mail', 'Cargo', 'Setor', 'Ações'].map((h) => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: T.sub }}>{h}</span>
            ))}
          </div>
          {users.map((u, i) => (
            <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1.2fr 100px', alignItems: 'center', padding: '10px 16px', borderBottom: i < users.length - 1 ? `1px solid ${T.border}` : 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = T.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#4f46e5', color: 'white', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{u.avatar || u.name.slice(0, 2).toUpperCase()}</div>
                <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{u.name}</span>
              </div>
              <span style={{ fontSize: 12, color: T.sub }}>{u.email}</span>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: T.tag, color: T.tagText, width: 'fit-content', fontWeight: 600 }}>{ROLE_LABEL[u.role]}</span>
              <span style={{ fontSize: 12, color: T.sub }}>{u.sector?.name || '—'}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={{ background: T.inp, border: 'none', borderRadius: 6, padding: 5, cursor: 'pointer' }}><Edit size={12} color={T.sub} /></button>
                <button style={{ background: '#fef2f2', border: 'none', borderRadius: 6, padding: 5, cursor: 'pointer' }}><Trash2 size={12} color="#ef4444" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'roles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
          {ROLES.map((r) => {
            const count = users.filter((u) => u.role === r).length;
            return (
              <div key={r} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{ROLE_LABEL[r]}</span>
                  <button style={{ background: T.inp, border: 'none', borderRadius: 6, padding: 4, cursor: 'pointer' }}><Edit size={12} color={T.sub} /></button>
                </div>
                <div style={{ fontSize: 12, color: T.sub, marginBottom: 8 }}>{count} usuário(s)</div>
                <div style={{ height: 4, background: T.border, borderRadius: 4 }}>
                  <div style={{ height: '100%', background: '#4f46e5', borderRadius: 4, width: `${users.length ? (count / users.length) * 100 : 0}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'sectors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sectors.map((s) => (
            <div key={s.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, background: '#ede9fe', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={16} color="#4f46e5" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: T.sub }}>{s._count?.users || 0} colaborador(es)</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ background: T.inp, border: 'none', borderRadius: 6, padding: 5, cursor: 'pointer' }}><Edit size={13} color={T.sub} /></button>
                <button style={{ background: '#fef2f2', border: 'none', borderRadius: 6, padding: 5, cursor: 'pointer' }}><Trash2 size={13} color="#ef4444" /></button>
              </div>
            </div>
          ))}
          <button style={{ background: 'transparent', border: `1.5px dashed ${T.border}`, borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, color: T.sub, cursor: 'pointer' }}>
            <Plus size={14} />Novo setor
          </button>
        </div>
      )}

      {tab === 'permissions' && (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Permissões por Cargo</div>
            <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>✅ Completo · 👁️ Leitura · ❌ Sem acesso</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: T.sub }}>Módulo</th>
                {ROLES.map((r) => <th key={r} style={{ padding: '10px 14px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: T.sub }}>{ROLE_LABEL[r]}</th>)}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map(([mod, ...ps], i) => (
                <tr key={mod} style={{ borderBottom: i < PERMISSIONS.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                  <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 500, color: T.text }}>{mod}</td>
                  {ps.map((p, pi) => <td key={pi} style={{ padding: '10px 14px', textAlign: 'center', fontSize: 14 }}>{p}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
