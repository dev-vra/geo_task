import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Building2, User, MapPin, Calendar, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Task, TaskStatus, STATUS_COLOR, STATUS_LABEL, PRIO_COLOR, PRIORITY_LABEL, TYPE_LABEL } from '../types';
import { tasksApi } from '../services/api';

const fmtTime = (m: number) => (m > 0 ? `${Math.floor(m / 60)}h ${m % 60}m` : '—');
const COLS: TaskStatus[] = ['A_FAZER', 'EM_ANDAMENTO', 'PAUSADO', 'CONCLUIDO'];

interface KanbanPageProps {
  onSelectTask: (t: Task) => void;
  onNewTask: () => void;
}

export default function KanbanPage({ onSelectTask, onNewTask }: KanbanPageProps) {
  const { T } = useTheme();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');

  const canCreate = user && ['ADMIN', 'GERENTE', 'GESTOR', 'COORDENADOR'].includes(user.role);

  useEffect(() => {
    tasksApi.list().then(setTasks).catch(() => {});
  }, []);

  const filtered = tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text }}>Quadro Kanban</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: T.sub }}>{filtered.length} de {tasks.length} tarefas</p>
        </div>
        {canCreate && (
          <button onClick={onNewTask} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={15} />Nova Tarefa
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: T.inp, borderRadius: 8, padding: '6px 10px', flex: '1 1 180px', maxWidth: 260 }}>
            <Search size={13} color={T.sub} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar tarefa..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: T.text, width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Columns */}
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
        {COLS.map((col) => {
          const colTasks = filtered.filter((t) => t.status === col);
          return (
            <div key={col} style={{ flexShrink: 0, width: 272 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLOR[col] }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{STATUS_LABEL[col]}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, padding: '1px 8px', borderRadius: 20, background: T.tag, color: T.tagText, fontWeight: 600 }}>{colTasks.length}</span>
              </div>
              <div style={{ background: T.col, borderRadius: 12, padding: 8, minHeight: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {colTasks.map((t) => {
                  const prog = t.subtasks?.length ? (t.subtasks.filter((s) => s.done).length / t.subtasks.length) * 100 : 0;
                  return (
                    <div key={t.id} onClick={() => onSelectTask(t)}
                      style={{ background: T.card, borderRadius: 10, padding: 12, border: `1px solid ${T.border}`, cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 6, background: T.tag, color: T.tagText, fontWeight: 600 }}>{TYPE_LABEL[t.type] || t.type}</span>
                        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 6, background: PRIO_COLOR[t.priority] + '22', color: PRIO_COLOR[t.priority], fontWeight: 700 }}>{PRIORITY_LABEL[t.priority]}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 7, lineHeight: 1.3 }}>{t.title}</div>
                      {t.description && <div style={{ fontSize: 11, color: T.sub, marginBottom: 7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</div>}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 7 }}>
                        <span style={{ fontSize: 11, color: T.sub, display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={9} />{t.sector?.name || '—'}</span>
                        <span style={{ fontSize: 11, color: T.sub, display: 'flex', alignItems: 'center', gap: 4 }}><User size={9} />{t.responsible?.name || 'Não atribuído'}</span>
                        <span style={{ fontSize: 11, color: T.sub, display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={9} />{t.contract?.name || '—'}</span>
                        {t.city && <span style={{ fontSize: 11, color: T.sub, display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 13 }}>{t.city.name}{t.neighborhood ? ` · ${t.neighborhood.name}` : ''}</span>}
                      </div>
                      {t.deadline && (
                        <div style={{ fontSize: 10, color: T.sub, display: 'flex', alignItems: 'center', gap: 3, marginBottom: 6 }}>
                          <Calendar size={9} />Prazo: <b style={{ color: T.text }}>{new Date(t.deadline).toLocaleDateString('pt-BR')}</b>
                        </div>
                      )}
                      {t.subtasks?.length > 0 && (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: T.sub, marginBottom: 3 }}>
                            <span>Subtarefas</span><span>{t.subtasks.filter((s) => s.done).length}/{t.subtasks.length}</span>
                          </div>
                          <div style={{ height: 3, background: T.border, borderRadius: 4 }}><div style={{ height: '100%', background: '#4f46e5', borderRadius: 4, width: `${prog}%` }} /></div>
                        </div>
                      )}
                      {t.timeSpent > 0 && <div style={{ fontSize: 10, color: T.sub, display: 'flex', alignItems: 'center', gap: 3, marginTop: 6 }}><Clock size={9} />{fmtTime(t.timeSpent)}</div>}
                    </div>
                  );
                })}
                {colTasks.length === 0 && <div style={{ textAlign: 'center', padding: '30px 0', fontSize: 12, color: T.sub }}>Sem tarefas</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
