import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, AlertCircle, Link } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { TYPE_LABEL, PRIORITY_LABEL, TaskType, Priority } from '../../types';
import { contractsApi, citiesApi, sectorsApi, usersApi, tasksApi } from '../../services/api';
import FormField from '../shared/FormField';
import FormInput from '../shared/FormInput';
import FormTextarea from '../shared/FormTextarea';
import FormSelect from '../shared/FormSelect';

const TYPES = Object.entries(TYPE_LABEL).map(([v, l]) => ({ value: v, label: l }));
const PRIORITIES = Object.entries(PRIORITY_LABEL).map(([v, l]) => ({ value: v, label: l }));

interface NewTaskModalProps {
  onClose: () => void;
  onSaved: () => void;
}

export default function NewTaskModal({ onClose, onSaved }: NewTaskModalProps) {
  const { T } = useTheme();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<string>('ALTA');
  const [type, setType] = useState<string>('VISTORIA');
  const [deadline, setDeadline] = useState('');
  const [link, setLink] = useState('');
  const [contractId, setContractId] = useState('');
  const [cityId, setCityId] = useState('');
  const [neighborhoodId, setNeighborhoodId] = useState('');
  const [quadra, setQuadra] = useState('');
  const [lote, setLote] = useState('');
  const [sectorId, setSectorId] = useState('');
  const [responsibleId, setResponsibleId] = useState('');

  // Lookup data
  const [contracts, setContracts] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    contractsApi.list().then(setContracts).catch(() => {});
    citiesApi.list().then(setCities).catch(() => {});
    sectorsApi.list().then(setSectors).catch(() => {});
  }, []);

  useEffect(() => {
    if (cityId) {
      citiesApi.neighborhoods(+cityId).then(setNeighborhoods).catch(() => {});
    } else {
      setNeighborhoods([]);
    }
    setNeighborhoodId('');
  }, [cityId]);

  useEffect(() => {
    if (sectorId) {
      usersApi.list(+sectorId).then(setUsers).catch(() => {});
    } else {
      setUsers([]);
    }
    setResponsibleId('');
  }, [sectorId]);

  const STEPS = ['Dados', 'Localidade', 'Responsável'];

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!title.trim()) e.title = 'Obrigatório';
      if (!priority) e.priority = 'Obrigatório';
      if (!type) e.type = 'Obrigatório';
    }
    if (step === 1) {
      if (!contractId) e.contract = 'Obrigatório';
    }
    if (step === 2) {
      if (!sectorId) e.sector = 'Obrigatório';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, 2)); };
  const prev = () => { setErrors({}); setStep((s) => Math.max(s - 1, 0)); };

  const handleSave = async () => {
    if (!validate()) return;
    await tasksApi.create({
      title,
      description: description || undefined,
      priority: priority as Priority,
      type: type as TaskType,
      deadline: deadline || undefined,
      link: link || undefined,
      contractId: contractId ? +contractId : undefined,
      cityId: cityId ? +cityId : undefined,
      neighborhoodId: neighborhoodId ? +neighborhoodId : undefined,
      quadra: quadra || undefined,
      lote: lote || undefined,
      sectorId: sectorId ? +sectorId : undefined,
      responsibleId: responsibleId ? +responsibleId : undefined,
    });
    onSaved();
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: 'system-ui,sans-serif' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 580, background: T.card, borderRadius: 20, border: `1px solid ${T.border}`, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>

        {/* Header */}
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.text }}>Nova Tarefa</h2>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: T.sub }}>Passo {step + 1} de 3 — {STEPS[step]}</p>
          </div>
          <button onClick={onClose} style={{ background: T.inp, border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex' }}><X size={16} color={T.sub} /></button>
        </div>

        {/* Step tabs */}
        <div style={{ display: 'flex', padding: '0 22px', borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
          {STEPS.map((s, i) => (
            <button key={i} onClick={() => { if (i < step) setStep(i); }}
              style={{
                flex: 1, padding: '10px 0', fontSize: 11, fontWeight: 700, background: 'none', border: 'none',
                cursor: i <= step ? 'pointer' : 'default',
                color: i === step ? '#4f46e5' : i < step ? '#10b981' : T.sub,
                borderBottom: `2px solid ${i === step ? '#4f46e5' : i < step ? '#10b981' : 'transparent'}`,
                transition: 'all 0.15s',
              }}>
              {i < step ? '✓ ' : ''}{s}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {step === 0 && (
            <>
              <FormField label="Título da Tarefa" required error={errors.title}>
                <FormInput T={T} value={title} onChange={setTitle} placeholder="Ex: Vistoria de regularização" />
              </FormField>
              <FormField label="Descrição">
                <FormTextarea T={T} value={description} onChange={setDescription} placeholder="Descreva os detalhes da tarefa..." />
              </FormField>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <FormField label="Prioridade" required error={errors.priority}>
                  <FormSelect T={T} value={priority} onChange={setPriority} options={PRIORITIES} error={!!errors.priority} />
                </FormField>
                <FormField label="Tipo de Tarefa" required error={errors.type}>
                  <FormSelect T={T} value={type} onChange={setType} options={TYPES} error={!!errors.type} />
                </FormField>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <FormField label="Prazo">
                  <FormInput T={T} value={deadline} onChange={setDeadline} placeholder="AAAA-MM-DD" />
                </FormField>
                <FormField label="Link Externo">
                  <FormInput T={T} value={link} onChange={setLink} placeholder="https://..." icon={<Link size={13} color={T.sub} />} />
                </FormField>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <FormField label="Contrato" required error={errors.contract}>
                <FormSelect T={T} value={contractId} onChange={setContractId}
                  options={contracts.map((c) => ({ value: String(c.id), label: c.name }))}
                  placeholder="Selecione o contrato..." error={!!errors.contract} />
              </FormField>
              <FormField label="Cidade">
                <FormSelect T={T} value={cityId} onChange={setCityId}
                  options={cities.map((c) => ({ value: String(c.id), label: c.name }))}
                  placeholder="Selecione a cidade..." />
              </FormField>
              <FormField label="Bairro / Núcleo">
                <FormSelect T={T} value={neighborhoodId} onChange={setNeighborhoodId}
                  options={neighborhoods.map((n: any) => ({ value: String(n.id), label: n.name }))}
                  placeholder={cityId ? 'Selecione o bairro...' : 'Selecione uma cidade primeiro...'} />
              </FormField>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <FormField label="Quadra"><FormInput T={T} value={quadra} onChange={setQuadra} placeholder="Ex: Q3" /></FormField>
                <FormField label="Lote"><FormInput T={T} value={lote} onChange={setLote} placeholder="Ex: L12" /></FormField>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <FormField label="Setor" required error={errors.sector}>
                <FormSelect T={T} value={sectorId} onChange={setSectorId}
                  options={sectors.map((s) => ({ value: String(s.id), label: s.name }))}
                  error={!!errors.sector} />
              </FormField>
              <FormField label="Usuário Responsável">
                <FormSelect T={T} value={responsibleId} onChange={setResponsibleId}
                  options={users.map((u) => ({ value: String(u.id), label: u.name }))}
                  placeholder={sectorId ? (users.length ? 'Selecione o responsável...' : 'Nenhum usuário neste setor') : 'Selecione um setor primeiro...'} />
              </FormField>
              {sectorId && users.length > 0 && (
                <div style={{ background: T.section, borderRadius: 10, padding: 12, border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, marginBottom: 10, textTransform: 'uppercase' }}>Usuários do setor</div>
                  {users.map((u: any) => (
                    <div key={u.id} onClick={() => setResponsibleId(String(u.id))}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                        border: `1px solid ${responsibleId === String(u.id) ? '#4f46e5' : T.border}`,
                        background: responsibleId === String(u.id) ? '#4f46e511' : T.card,
                        transition: 'all 0.15s', marginBottom: 6,
                      }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#4f46e5', color: 'white', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {u.avatar || u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: T.sub }}>{u.role}</div>
                      </div>
                      {responsibleId === String(u.id) && <Check size={14} color="#4f46e5" />}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 22px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 8, flexShrink: 0 }}>
          {step > 0 && (
            <button onClick={prev} style={{ padding: '9px 18px', background: T.inp, color: T.sub, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              ← Voltar
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < 2 ? (
            <button onClick={next} style={{ padding: '9px 22px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Próximo →
            </button>
          ) : (
            <button onClick={handleSave} style={{ padding: '9px 22px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Check size={14} />Criar Tarefa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
