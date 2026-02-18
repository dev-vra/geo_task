import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Task } from '../types';
import { tasksApi } from '../services/api';

const fmtDate = (d: string | null) => {
  if (!d) return null;
  try { return new Date(d).toLocaleDateString('pt-BR'); } catch { return null; }
};

const EVENTS = [
  { k: 'createdAt', l: 'Criado', c: '#6366f1' },
  { k: 'assignedAt', l: 'Atribuído', c: '#8b5cf6' },
  { k: 'startedAt', l: 'Iniciado', c: '#f59e0b' },
  { k: 'pausedAt', l: 'Pausado', c: '#ef4444' },
  { k: 'completedAt', l: 'Concluído', c: '#10b981' },
];

interface CronogramaPageProps {
  onSelectTask: (t: Task) => void;
}

export default function CronogramaPage({ onSelectTask }: CronogramaPageProps) {
  const { T } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    tasksApi.list().then(setTasks).catch(() => {});
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text }}>Cronograma de Entrega</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: T.sub }}>Linha do tempo de todas as tarefas</p>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
        {EVENTS.map((e) => (
          <div key={e.k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: e.c }} />
            <span style={{ fontSize: 11, color: T.sub }}>{e.l}</span>
          </div>
        ))}
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.sub }}>TAREFA</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.sub }}>LINHA DO TEMPO</span>
        </div>
        {tasks.map((t, i) => (
          <div key={t.id} onClick={() => onSelectTask(t)}
            style={{
              display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center',
              padding: '12px 16px', cursor: 'pointer',
              borderBottom: i < tasks.length - 1 ? `1px solid ${T.border}` : 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = T.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
            <div style={{ paddingRight: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
              <div style={{ fontSize: 11, color: T.sub, marginTop: 1 }}>{t.responsible?.name || '—'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
              {EVENTS.map((ev, ei) => {
                const val = fmtDate((t as any)[ev.k]);
                if (!val) return null;
                const hasPrev = EVENTS.slice(0, ei).some((pe) => (t as any)[pe.k]);
                return (
                  <div key={ev.k} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    {hasPrev && <div style={{ width: 28, height: 1, background: T.border }} />}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 11, height: 11, borderRadius: '50%', background: ev.c }} />
                      <span style={{ fontSize: 9, color: ev.c, whiteSpace: 'nowrap', marginTop: 2, fontWeight: 600 }}>{val}</span>
                      <span style={{ fontSize: 9, color: T.sub, whiteSpace: 'nowrap' }}>{ev.l}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
