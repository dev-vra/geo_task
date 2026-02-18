import { useState, useEffect } from 'react';
import { Plus, ChevronRight, FileText } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Template } from '../types';
import { templatesApi } from '../services/api';

export default function TemplatesPage() {
  const { T } = useTheme();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [active, setActive] = useState<Template | null>(null);

  useEffect(() => {
    templatesApi.list().then(setTemplates).catch(() => {});
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text }}>Templates de Tarefas</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: T.sub }}>Modelos prontos para criação rápida</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} />Novo template
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {templates.map((tpl) => (
            <button key={tpl.id} onClick={() => setActive(active?.id === tpl.id ? null : tpl)}
              style={{ background: T.card, border: `1px solid ${active?.id === tpl.id ? '#4f46e5' : T.border}`, borderRadius: 12, padding: 14, textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 4 }}>{tpl.name}</div>
                  <div style={{ fontSize: 11, color: T.sub }}>{tpl.sector} · {tpl.templateTasks.length} tarefas</div>
                </div>
                <ChevronRight size={14} color={active?.id === tpl.id ? '#4f46e5' : T.sub} />
              </div>
            </button>
          ))}
        </div>

        {active ? (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.text }}>{active.name}</h3>
              <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: T.tag, color: T.tagText, fontWeight: 600 }}>{active.sector}</span>
            </div>
            {active.templateTasks.map((task, ti) => (
              <div key={task.id} style={{ background: T.col, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#4f46e5', color: 'white', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ti + 1}</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{task.title}</span>
                </div>
                {task.subtasks.map((st) => (
                  <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: T.sub, marginLeft: 32, marginBottom: 5 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, border: `1px solid ${T.border}`, flexShrink: 0 }} />{st.title}
                  </div>
                ))}
              </div>
            ))}
            <button style={{ width: '100%', padding: '10px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Usar este template
            </button>
          </div>
        ) : (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            <FileText size={40} color={T.sub} style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 4 }}>Selecione um template</div>
          </div>
        )}
      </div>
    </div>
  );
}
