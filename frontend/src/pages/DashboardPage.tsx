import { useState, useEffect } from 'react';
import { Eye, Search, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Task, STATUS_COLOR, STATUS_LABEL, PRIO_COLOR, PRIORITY_LABEL, TYPE_LABEL } from '../types';
import { tasksApi, dashboardApi } from '../services/api';

const fmtTime = (m: number) => (m > 0 ? `${Math.floor(m / 60)}h ${m % 60}m` : '—');

interface DashboardPageProps {
  onSelectTask: (t: Task) => void;
}

export default function DashboardPage({ onSelectTask }: DashboardPageProps) {
  const { T } = useTheme();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    tasksApi.list().then(setTasks).catch(() => {});
    dashboardApi.stats().then(setStats).catch(() => {});
  }, []);

  const total = stats?.total || 0;
  const avgTime = stats?.avgTime || 0;

  const pieData = stats
    ? Object.entries(stats.byStatus)
        .filter(([, v]) => (v as number) > 0)
        .map(([k, v]) => ({ name: STATUS_LABEL[k as keyof typeof STATUS_LABEL] || k, value: v as number, key: k }))
    : [];

  const sectorData = stats
    ? Object.entries(stats.bySector)
        .filter(([, v]) => (v as number) > 0)
        .map(([k, v]) => ({ name: k, v: v as number }))
        .sort((a, b) => b.v - a.v)
    : [];

  const sectorRank = stats
    ? Object.entries(stats.completedBySector || {})
        .filter(([, v]) => (v as number) > 0)
        .map(([k, v]) => ({ name: k, v: v as number }))
        .sort((a, b) => b.v - a.v)
    : [];

  const userRank = stats
    ? Object.entries(stats.completedByUser || {})
        .filter(([, v]) => (v as number) > 0)
        .map(([k, v]) => ({ name: k.split(' ')[0], v: v as number }))
        .sort((a, b) => b.v - a.v)
    : [];

  const upcoming = stats?.upcoming || [];

  const TS = { contentStyle: { background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 11 } };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text }}>Dashboard</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: T.sub }}>
            Olá, {user?.name?.split(' ')[0]}! Veja o resumo das atividades.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        <div style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total de Tarefas</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: '#4f46e5', lineHeight: 1 }}>{total}</div>
          <div style={{ height: 4, background: T.border, borderRadius: 4 }}><div style={{ height: '100%', background: '#4f46e5', borderRadius: 4, width: '100%' }} /></div>
        </div>

        <div style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tempo Médio de Execução</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#10b981', lineHeight: 1 }}>{fmtTime(avgTime)}</div>
        </div>

        <div style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Por Prioridade</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {stats && Object.entries(stats.byPriority).map(([k, v]) => (
              <div key={k}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: T.sub, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: PRIO_COLOR[k as keyof typeof PRIO_COLOR] || '#999' }} />
                    {PRIORITY_LABEL[k as keyof typeof PRIORITY_LABEL] || k}
                  </span>
                  <span style={{ fontWeight: 700, color: T.text }}>{v as number}</span>
                </div>
                <div style={{ height: 3, background: T.border, borderRadius: 4 }}>
                  <div style={{ height: '100%', background: PRIO_COLOR[k as keyof typeof PRIO_COLOR] || '#999', borderRadius: 4, width: `${total ? ((v as number) / total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Por Tipo</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, overflowY: 'auto', maxHeight: 120 }}>
            {stats && Object.entries(stats.byType).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                <span style={{ color: T.sub }}>{TYPE_LABEL[k as keyof typeof TYPE_LABEL] || k}</span>
                <span style={{ fontWeight: 700, color: T.text, background: T.tag, borderRadius: 20, padding: '1px 8px' }}>{v as number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 12 }}>Tarefas por Status</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={3} dataKey="value">
                {pieData.map((d: any, i: number) => <Cell key={i} fill={STATUS_COLOR[d.key as keyof typeof STATUS_COLOR] || '#999'} />)}
              </Pie>
              <Tooltip {...TS} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
            {pieData.map((d: any) => (
              <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[d.key as keyof typeof STATUS_COLOR] || '#999' }} />
                  <span style={{ color: T.sub }}>{d.name}</span>
                </div>
                <span style={{ fontWeight: 700, color: T.text }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 12 }}>Tarefas por Setor</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={sectorData} layout="vertical">
              <XAxis type="number" tick={{ fill: T.sub, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: T.sub, fontSize: 10 }} axisLine={false} tickLine={false} width={72} />
              <Tooltip {...TS} />
              <Bar dataKey="v" name="Tarefas" fill="#4f46e5" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 10 }}>Rankings (Concluídas)</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, marginBottom: 6, textTransform: 'uppercase' }}>Por Setor</div>
          {sectorRank.length === 0 && <div style={{ fontSize: 11, color: T.sub, marginBottom: 8 }}>—</div>}
          {sectorRank.slice(0, 3).map((r, i) => (
            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 13 }}>{['🥇', '🥈', '🥉'][i]}</span>
              <div style={{ flex: 1, height: 6, background: T.border, borderRadius: 4 }}>
                <div style={{ height: '100%', background: '#4f46e5', borderRadius: 4, width: `${sectorRank[0]?.v ? (r.v / sectorRank[0].v) * 100 : 0}%` }} />
              </div>
              <span style={{ fontSize: 11, color: T.sub, width: 60, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.text, width: 16, textAlign: 'right' }}>{r.v}</span>
            </div>
          ))}
          <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, marginBottom: 6, marginTop: 12, textTransform: 'uppercase' }}>Por Usuário</div>
          {userRank.length === 0 && <div style={{ fontSize: 11, color: T.sub }}>—</div>}
          {userRank.slice(0, 3).map((r, i) => (
            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 13 }}>{['🥇', '🥈', '🥉'][i]}</span>
              <div style={{ flex: 1, height: 6, background: T.border, borderRadius: 4 }}>
                <div style={{ height: '100%', background: '#10b981', borderRadius: 4, width: `${userRank[0]?.v ? (r.v / userRank[0].v) * 100 : 0}%` }} />
              </div>
              <span style={{ fontSize: 11, color: T.sub, width: 60, textAlign: 'right' }}>{r.name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.text, width: 16, textAlign: 'right' }}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming tasks table */}
      <div style={{ background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Próximas Tarefas a Entregar</div>
          <div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>{upcoming.length} tarefa(s) pendentes</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 120px 140px 100px 48px', padding: '8px 16px', borderBottom: `1px solid ${T.border}`, gap: 8 }}>
          {['Título', 'Prioridade', 'Prazo', 'Contrato', 'Cidade', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 10, fontWeight: 700, color: T.sub }}>{h}</span>
          ))}
        </div>
        {upcoming.length === 0 && (
          <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: 13, color: T.sub }}>Nenhuma tarefa pendente.</div>
        )}
        {upcoming.map((t: any, i: number) => (
          <div key={t.id} style={{
            display: 'grid', gridTemplateColumns: '2fr 80px 120px 140px 100px 48px',
            padding: '10px 16px', borderBottom: i < upcoming.length - 1 ? `1px solid ${T.border}` : 'none',
            alignItems: 'center', gap: 8,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
              <div style={{ fontSize: 10, color: T.sub, marginTop: 1 }}>{TYPE_LABEL[t.type as keyof typeof TYPE_LABEL] || t.type} · {t.sector?.name || '—'}</div>
            </div>
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: (PRIO_COLOR[t.priority as keyof typeof PRIO_COLOR] || '#999') + '22', color: PRIO_COLOR[t.priority as keyof typeof PRIO_COLOR] || '#999', fontWeight: 700, textAlign: 'center', display: 'inline-block' }}>
              {PRIORITY_LABEL[t.priority as keyof typeof PRIORITY_LABEL] || t.priority}
            </span>
            <div style={{ fontSize: 11, color: T.text, fontWeight: 600 }}>
              {t.deadline ? new Date(t.deadline).toLocaleDateString('pt-BR') : '—'}
            </div>
            <div style={{ fontSize: 11, color: T.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.contract?.name || '—'}</div>
            <div style={{ fontSize: 11, color: T.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.city?.name || '—'}</div>
            <button onClick={() => onSelectTask(t)} style={{ background: '#4f46e511', border: '1px solid #4f46e533', borderRadius: 7, padding: '5px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Eye size={13} color="#4f46e5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
