// ── Enums ──────────────────────────────────────────────────────

export type Role = 'ADMIN' | 'COORDENADOR' | 'GERENTE' | 'GESTOR' | 'LIDERADO';
export type TaskStatus = 'A_FAZER' | 'EM_ANDAMENTO' | 'PAUSADO' | 'CONCLUIDO';
export type Priority = 'ALTA' | 'MEDIA' | 'BAIXA';
export type TaskType = 'VISTORIA' | 'RELATORIO' | 'INSPECAO' | 'LEVANTAMENTO' | 'AUDITORIA' | 'MAPEAMENTO' | 'REGULARIZACAO' | 'MEDICAO';

// ── Display Maps ───────────────────────────────────────────────

export const STATUS_LABEL: Record<TaskStatus, string> = {
  A_FAZER: 'A Fazer',
  EM_ANDAMENTO: 'Em Andamento',
  PAUSADO: 'Pausado',
  CONCLUIDO: 'Concluído',
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  ALTA: 'Alta',
  MEDIA: 'Média',
  BAIXA: 'Baixa',
};

export const TYPE_LABEL: Record<TaskType, string> = {
  VISTORIA: 'Vistoria',
  RELATORIO: 'Relatório',
  INSPECAO: 'Inspeção',
  LEVANTAMENTO: 'Levantamento',
  AUDITORIA: 'Auditoria',
  MAPEAMENTO: 'Mapeamento',
  REGULARIZACAO: 'Regularização',
  MEDICAO: 'Medição',
};

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: 'Admin',
  COORDENADOR: 'Coordenador',
  GERENTE: 'Gerente',
  GESTOR: 'Gestor',
  LIDERADO: 'Liderado',
};

export const STATUS_COLOR: Record<TaskStatus, string> = {
  A_FAZER: '#6366f1',
  EM_ANDAMENTO: '#f59e0b',
  PAUSADO: '#ef4444',
  CONCLUIDO: '#10b981',
};

export const PRIO_COLOR: Record<Priority, string> = {
  ALTA: '#ef4444',
  MEDIA: '#f59e0b',
  BAIXA: '#10b981',
};

// ── Models ─────────────────────────────────────────────────────

export interface Sector {
  id: number;
  name: string;
  _count?: { users: number; tasks: number };
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar: string | null;
  sector: Sector | null;
  sectorId: number | null;
}

export interface Contract {
  id: number;
  name: string;
  _count?: { tasks: number };
}

export interface City {
  id: number;
  name: string;
  neighborhoods?: Neighborhood[];
  _count?: { neighborhoods: number };
}

export interface Neighborhood {
  id: number;
  name: string;
  cityId: number;
}

export interface Subtask {
  id: number;
  title: string;
  description: string | null;
  done: boolean;
  sector: Sector | null;
  responsible: Pick<User, 'id' | 'name' | 'avatar'> | null;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  type: TaskType;
  deadline: string | null;
  link: string | null;
  quadra: string | null;
  lote: string | null;
  timeSpent: number;
  assignedAt: string | null;
  startedAt: string | null;
  pausedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  responsible: Pick<User, 'id' | 'name' | 'avatar' | 'role'> | null;
  sector: Sector | null;
  contract: Contract | null;
  city: City | null;
  neighborhood: Neighborhood | null;
  subtasks: Subtask[];
}

export interface Template {
  id: number;
  name: string;
  sector: string;
  templateTasks: TemplateTask[];
}

export interface TemplateTask {
  id: number;
  title: string;
  order: number;
  subtasks: TemplateSubtask[];
}

export interface TemplateSubtask {
  id: number;
  title: string;
  order: number;
}

export interface DashboardStats {
  total: number;
  byStatus: Record<TaskStatus, number>;
  avgTime: number;
  byPriority: Record<Priority, number>;
  byType: Record<string, number>;
  bySector: Record<string, number>;
  completedBySector: Record<string, number>;
  completedByUser: Record<string, number>;
  upcoming: Task[];
}
