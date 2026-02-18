import { X, Play, Pause, CheckCircle, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Task, STATUS_COLOR, STATUS_LABEL, PRIORITY_LABEL, TYPE_LABEL } from '../../types';
import { tasksApi } from '../../services/api';

const fmtTime = (m: number) => (m > 0 ? `${Math.floor(m / 60)}h ${m % 60}m` : '—');
const fmtDate = (d: string | null) => {
  if (!d) return null;
  try { return new Date(d).toLocaleDateString('pt-BR'); } catch { return d; }
};

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: () => void;
}

export default function TaskModal({ task: t, onClose, onUpdate }: TaskModalProps) {
  const { T } = useTheme();
  const { user } = useAuth();
  const sc = STATUS_COLOR[t.status];

  const changeStatus = async (status: string) => {
    await tasksApi.update(t.id, { status });
    onUpdate();
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: 'system-ui,sans-serif' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 520, background: T.card, borderRadius: 20, padding: 24, border: `1px solid ${T.border}`, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: sc + '22', color: sc }}>{STATUS_LABEL[t.status]}</span>
            <h2 style={{ margin: '6px 0 0', fontSize: 18, fontWeight: 700, color: T.text }}>{t.title}</h2>
            {t.description && <p style={{ margin: '6px 0 0', fontSize: 13, color: T.sub }}>{t.description}</p>}
          </div>
          <button onClick={onClose} style={{ background: T.inp, border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer' }}><X size={16} color={T.sub} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          {([
            ['Tipo', TYPE_LABEL[t.type]],
            ['Prioridade', PRIORITY_LABEL[t.priority]],
            ['Setor', t.sector?.name || '—'],
            ['Responsável', t.responsible?.name || '—'],
            ['Contrato', t.contract?.name || '—'],
            ['Cidade', t.city?.name || '—'],
            ['Bairro / Núcleo', t.neighborhood?.name || '—'],
            ['Quadra', t.quadra || '—'],
            ['Lote', t.lote || '—'],
            ['Prazo', fmtDate(t.deadline) || '—'],
            ['Tempo', fmtTime(t.timeSpent)],
          ] as [string, string][]).map(([k, v]) => (
            <div key={k} style={{ background: T.inp, borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontSize: 10, color: T.sub, fontWeight: 600, marginBottom: 2 }}>{k.toUpperCase()}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{v}</div>
            </div>
          ))}
        </div>

        {t.link && (
          <div style={{ background: T.inp, borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: T.sub, fontWeight: 600, marginBottom: 2 }}>LINK EXTERNO</div>
            <a href={t.link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#4f46e5', wordBreak: 'break-all' }}>{t.link}</a>
          </div>
        )}

        <div style={{ background: T.inp, borderRadius: 10, padding: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.sub, marginBottom: 8 }}>LINHA DO TEMPO</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {([
              ['Criado', fmtDate(t.createdAt)],
              ['Atribuído', fmtDate(t.assignedAt)],
              ['Iniciado', fmtDate(t.startedAt)],
              ['Pausado', fmtDate(t.pausedAt)],
              ['Concluído', fmtDate(t.completedAt)],
            ] as [string, string | null][])
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <span key={k} style={{ fontSize: 11, background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, padding: '3px 8px', color: T.sub }}>
                  {k}: <b style={{ color: T.text }}>{v}</b>
                </span>
              ))}
          </div>
        </div>

        {t.subtasks?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, marginBottom: 8 }}>
              SUBTAREFAS ({t.subtasks.filter((s) => s.done).length}/{t.subtasks.length})
            </div>
            <div style={{ height: 4, background: T.border, borderRadius: 4, marginBottom: 10 }}>
              <div style={{ height: '100%', background: '#4f46e5', borderRadius: 4, width: `${(t.subtasks.filter((s) => s.done).length / t.subtasks.length) * 100}%` }} />
            </div>
            {t.subtasks.map((s) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.inp, borderRadius: 8, padding: '8px 10px', marginBottom: 4 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: 4,
                  background: s.done ? '#10b981' : 'transparent',
                  border: s.done ? 'none' : `1px solid ${T.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {s.done && <Check size={10} color="white" />}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, color: s.done ? T.sub : T.text, textDecoration: s.done ? 'line-through' : 'none' }}>{s.title}</span>
                  {s.responsible && <div style={{ fontSize: 10, color: T.sub, marginTop: 1 }}>{s.sector?.name} · {s.responsible.name}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {user && ['GESTOR', 'LIDERADO', 'GERENTE'].includes(user.role) && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {t.status === 'A_FAZER' && (
              <button onClick={() => changeStatus('EM_ANDAMENTO')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <Play size={13} />Iniciar
              </button>
            )}
            {t.status === 'EM_ANDAMENTO' && (
              <button onClick={() => changeStatus('PAUSADO')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <Pause size={13} />Pausar
              </button>
            )}
            {t.status === 'PAUSADO' && (
              <button onClick={() => changeStatus('EM_ANDAMENTO')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <Play size={13} />Retomar
              </button>
            )}
            {['EM_ANDAMENTO', 'PAUSADO'].includes(t.status) && (
              <button onClick={() => changeStatus('CONCLUIDO')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#059669', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <CheckCircle size={13} />Concluir
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
