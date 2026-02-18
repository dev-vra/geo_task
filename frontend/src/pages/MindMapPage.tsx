import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Eye, X, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { contractsApi } from '../services/api';
import { STATUS_COLOR, STATUS_LABEL } from '../types';

export default function MindMapPage() {
  const { T } = useTheme();
  const [contracts, setContracts] = useState<any[]>([]);
  const [sel, setSel] = useState<{ contractId: number | null; cityId: number | null; neighborhoodId: number | null; taskId: number | null }>({ contractId: null, cityId: null, neighborhoodId: null, taskId: null });
  const [detail, setDetail] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contractsApi.list().then(setContracts).catch(() => {});
  }, []);

  const LC = ['#4f46e5', '#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981'];

  const Node = ({ label, sub, color, selected, onClick }: { label: string; sub?: string; color: string; selected: boolean; onClick: () => void }) => (
    <div onClick={onClick}
      style={{
        background: selected ? color : T.card, border: `2px solid ${selected ? color : T.border}`,
        borderRadius: 12, padding: '10px 12px', cursor: 'pointer', transition: 'all 0.18s',
        boxShadow: selected ? `0 0 0 4px ${color}28` : 'none', userSelect: 'none',
      }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: selected ? 'white' : T.text, lineHeight: 1.4, marginBottom: sub ? 3 : 0 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: selected ? 'rgba(255,255,255,0.7)' : T.sub }}>{sub}</div>}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text }}>Mapa Mental</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: T.sub }}>Clique nos nós para expandir a hierarquia</p>
        </div>
        {sel.contractId != null && (
          <button onClick={() => setSel({ contractId: null, cityId: null, neighborhoodId: null, taskId: null })}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, color: T.sub, cursor: 'pointer' }}>
            <ArrowLeft size={13} />Resetar
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        {[['Contrato', LC[0]], ['Cidade', LC[1]], ['Bairro', LC[2]], ['Tarefa', LC[3]], ['Subtarefa', LC[4]]].map(([l, c]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.sub }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />{l}
          </div>
        ))}
      </div>

      <div ref={containerRef} style={{ position: 'relative', overflowX: 'auto', overflowY: 'auto', maxHeight: 'calc(100vh - 260px)', minHeight: 300, background: T.mmBg, borderRadius: 16, border: `1px solid ${T.border}`, padding: '28px 20px' }}>
        <div style={{ display: 'inline-flex', gap: 56, alignItems: 'flex-start', minWidth: '100%' }}>
          {/* Contracts column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 190, flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: LC[0], marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: LC[0] }} />Contratos
            </div>
            {contracts.map((c) => (
              <Node key={c.id} label={c.name} sub={`${c._count?.tasks || 0} tarefa(s)`} color={LC[0]}
                selected={sel.contractId === c.id}
                onClick={() => setSel({ contractId: c.id === sel.contractId ? null : c.id, cityId: null, neighborhoodId: null, taskId: null })} />
            ))}
          </div>
        </div>
      </div>

      {sel.contractId == null && (
        <div style={{ textAlign: 'center', padding: '20px', fontSize: 13, color: T.sub }}>Clique em um contrato para começar a expandir o mapa</div>
      )}

      {detail && (
        <div onClick={() => setDetail(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 500, background: T.card, borderRadius: 20, padding: 24, border: `1px solid ${T.border}`, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: STATUS_COLOR[detail.status as keyof typeof STATUS_COLOR] + '22', color: STATUS_COLOR[detail.status as keyof typeof STATUS_COLOR] }}>
                  {STATUS_LABEL[detail.status as keyof typeof STATUS_LABEL]}
                </span>
                <h2 style={{ margin: '6px 0 0', fontSize: 18, fontWeight: 700, color: T.text }}>{detail.title}</h2>
              </div>
              <button onClick={() => setDetail(null)} style={{ background: T.inp, border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer' }}>
                <X size={16} color={T.sub} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
