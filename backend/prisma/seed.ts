import { PrismaClient, Role, TaskStatus, Priority, TaskType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // ── Sectors ────────────────────────────────────────────────
  const sectorNames = ['Campo', 'Técnico', 'Ambiental', 'Operações', 'TI', 'Jurídico', 'Administrativo'];
  const sectors: Record<string, any> = {};
  for (const name of sectorNames) {
    sectors[name] = await prisma.sector.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // ── Users ──────────────────────────────────────────────────
  const hash = await bcrypt.hash('123456', 10);
  const usersData = [
    { name: 'Ana Silva', email: 'ana.silva@geotask.com', role: Role.ADMIN, sector: 'TI', avatar: 'AS' },
    { name: 'Bruno Costa', email: 'bruno.costa@geotask.com', role: Role.COORDENADOR, sector: 'Operações', avatar: 'BC' },
    { name: 'Carla Mendes', email: 'carla.mendes@geotask.com', role: Role.GERENTE, sector: 'Operações', avatar: 'CM' },
    { name: 'Diego Faria', email: 'diego.faria@geotask.com', role: Role.GESTOR, sector: 'Campo', avatar: 'DF' },
    { name: 'Elisa Torres', email: 'elisa.torres@geotask.com', role: Role.LIDERADO, sector: 'Campo', avatar: 'ET' },
    { name: 'Felipe Rocha', email: 'felipe.rocha@geotask.com', role: Role.LIDERADO, sector: 'Técnico', avatar: 'FR' },
    { name: 'Gabriela Lima', email: 'gabriela.lima@geotask.com', role: Role.GESTOR, sector: 'Ambiental', avatar: 'GL' },
    { name: 'Henrique Dias', email: 'henrique.dias@geotask.com', role: Role.LIDERADO, sector: 'Ambiental', avatar: 'HD' },
  ];

  const users: Record<string, any> = {};
  for (const u of usersData) {
    users[u.name] = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        password: hash,
        role: u.role,
        avatar: u.avatar,
        sectorId: sectors[u.sector].id,
      },
    });
  }

  // ── Contracts ──────────────────────────────────────────────
  const contractNames = [
    '001/2022/CIDES ARP', '004/2024/CIDESA GUAPORÉ', '005/2022/VG',
    '006/2020/INTERMAT', '008/2022/CIDES VRC', '009/2020/MTPAR',
    '010/2022/CIDES VJ', '119/2023/TANGARÁ', '234/2025/MACEIÓ',
  ];
  const contracts: Record<string, any> = {};
  for (const name of contractNames) {
    contracts[name] = await prisma.contract.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // ── Cities & Neighborhoods ─────────────────────────────────
  const citiesNeighborhoods: Record<string, string[]> = {
    'Alto Paraguai': ['Catira', 'Distrito Capão Verde', 'Distrito Tira Sentido', 'Loteamento Bela Vista'],
    'Arenápolis': ['Conjunto Habitacional Tapirapuã', 'Núcleo Habitacional Parecis'],
    'Cuiabá': ['JARDIM VITÓRIA', 'Campo Verde', 'NÚCLEO HABITACIONAL CIDADE VERDE'],
    'Maceió': ['Vale do Reginaldo - 1ª Etapa'],
    'Tangará da Serra': ['Cidade Alta II', 'Cidade Alta III', 'Jardim Vitória', 'Jardim Bela Vista'],
    'Várzea Grande': ['Jardim Eldorado', 'Jardim Maringá I', 'Jardim Maringá II'],
  };

  const cities: Record<string, any> = {};
  const neighborhoods: Record<string, any> = {};

  for (const [cityName, neighList] of Object.entries(citiesNeighborhoods)) {
    cities[cityName] = await prisma.city.upsert({
      where: { name: cityName },
      update: {},
      create: { name: cityName },
    });
    for (const n of neighList) {
      const key = `${cityName}:${n}`;
      neighborhoods[key] = await prisma.neighborhood.upsert({
        where: { name_cityId: { name: n, cityId: cities[cityName].id } },
        update: {},
        create: { name: n, cityId: cities[cityName].id },
      });
    }
  }

  // ── Tasks ──────────────────────────────────────────────────
  const task1 = await prisma.task.create({
    data: {
      title: 'Vistoria de campo',
      type: TaskType.VISTORIA,
      status: TaskStatus.EM_ANDAMENTO,
      priority: Priority.ALTA,
      description: 'Vistoria técnica completa da área.',
      deadline: new Date('2026-02-20'),
      quadra: 'Q3',
      lote: 'L12',
      timeSpent: 120,
      assignedAt: new Date('2026-02-02'),
      startedAt: new Date('2026-02-03'),
      responsibleId: users['Elisa Torres'].id,
      sectorId: sectors['Campo'].id,
      contractId: contracts['001/2022/CIDES ARP'].id,
      cityId: cities['Cuiabá'].id,
      neighborhoodId: neighborhoods['Cuiabá:JARDIM VITÓRIA'].id,
      subtasks: {
        create: [
          { title: 'Fotografar área', done: true, sectorId: sectors['Campo'].id, responsibleId: users['Elisa Torres'].id },
          { title: 'Medir perímetro', done: false, sectorId: sectors['Campo'].id, responsibleId: users['Elisa Torres'].id },
        ],
      },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Relatório técnico',
      type: TaskType.RELATORIO,
      status: TaskStatus.A_FAZER,
      priority: Priority.MEDIA,
      deadline: new Date('2026-02-28'),
      assignedAt: new Date('2026-02-02'),
      responsibleId: users['Felipe Rocha'].id,
      sectorId: sectors['Técnico'].id,
      contractId: contracts['005/2022/VG'].id,
      cityId: cities['Várzea Grande'].id,
      neighborhoodId: neighborhoods['Várzea Grande:Jardim Eldorado'].id,
      subtasks: {
        create: [
          { title: 'Coletar dados', done: false, sectorId: sectors['Técnico'].id, responsibleId: users['Felipe Rocha'].id },
        ],
      },
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Inspeção predial',
      type: TaskType.INSPECAO,
      status: TaskStatus.CONCLUIDO,
      priority: Priority.BAIXA,
      deadline: new Date('2026-02-10'),
      timeSpent: 240,
      assignedAt: new Date('2026-01-29'),
      startedAt: new Date('2026-01-30'),
      completedAt: new Date('2026-02-05'),
      responsibleId: users['Elisa Torres'].id,
      sectorId: sectors['Campo'].id,
      contractId: contracts['008/2022/CIDES VRC'].id,
      cityId: cities['Tangará da Serra'].id,
      neighborhoodId: neighborhoods['Tangará da Serra:Jardim Vitória'].id,
      subtasks: {
        create: [
          { title: 'Check estrutural', done: true, sectorId: sectors['Campo'].id, responsibleId: users['Elisa Torres'].id },
        ],
      },
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: 'Levantamento topográfico',
      type: TaskType.LEVANTAMENTO,
      status: TaskStatus.PAUSADO,
      priority: Priority.ALTA,
      deadline: new Date('2026-03-15'),
      timeSpent: 90,
      quadra: 'Q1',
      lote: 'L5',
      assignedAt: new Date('2026-02-04'),
      startedAt: new Date('2026-02-05'),
      pausedAt: new Date('2026-02-06'),
      responsibleId: users['Diego Faria'].id,
      sectorId: sectors['Campo'].id,
      contractId: contracts['119/2023/TANGARÁ'].id,
      cityId: cities['Tangará da Serra'].id,
      neighborhoodId: neighborhoods['Tangará da Serra:Cidade Alta II'].id,
      subtasks: {
        create: [
          { title: 'Posicionar equipamento', done: true, sectorId: sectors['Campo'].id, responsibleId: users['Diego Faria'].id },
          { title: 'Processar dados', done: false, sectorId: sectors['Técnico'].id, responsibleId: users['Felipe Rocha'].id },
        ],
      },
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: 'Auditoria ambiental',
      type: TaskType.AUDITORIA,
      status: TaskStatus.A_FAZER,
      priority: Priority.ALTA,
      deadline: new Date('2026-03-05'),
      assignedAt: new Date('2026-02-08'),
      responsibleId: users['Gabriela Lima'].id,
      sectorId: sectors['Ambiental'].id,
      contractId: contracts['234/2025/MACEIÓ'].id,
      cityId: cities['Maceió'].id,
      neighborhoodId: neighborhoods['Maceió:Vale do Reginaldo - 1ª Etapa'].id,
    },
  });

  const task6 = await prisma.task.create({
    data: {
      title: 'Mapeamento de risco',
      type: TaskType.MAPEAMENTO,
      status: TaskStatus.EM_ANDAMENTO,
      priority: Priority.MEDIA,
      deadline: new Date('2026-04-01'),
      timeSpent: 60,
      assignedAt: new Date('2026-02-06'),
      startedAt: new Date('2026-02-07'),
      responsibleId: users['Felipe Rocha'].id,
      sectorId: sectors['Técnico'].id,
      contractId: contracts['006/2020/INTERMAT'].id,
      cityId: cities['Cuiabá'].id,
      neighborhoodId: neighborhoods['Cuiabá:Campo Verde'].id,
      subtasks: {
        create: [
          { title: 'Identificar zonas', done: true, sectorId: sectors['Técnico'].id, responsibleId: users['Felipe Rocha'].id },
          { title: 'Gerar mapa', done: false, sectorId: sectors['Técnico'].id, responsibleId: users['Felipe Rocha'].id },
        ],
      },
    },
  });

  // ── Templates ──────────────────────────────────────────────
  await prisma.template.create({
    data: {
      name: 'Vistoria Padrão',
      sector: 'Campo',
      templateTasks: {
        create: [
          { title: 'Preparação de campo', order: 1, subtasks: { create: [{ title: 'Verificar equipamentos', order: 1 }, { title: 'Checar EPI', order: 2 }, { title: 'Confirmar localização', order: 3 }] } },
          { title: 'Execução da vistoria', order: 2, subtasks: { create: [{ title: 'Fotografar área', order: 1 }, { title: 'Medir perímetro', order: 2 }, { title: 'Coletar amostras', order: 3 }] } },
          { title: 'Relatório final', order: 3, subtasks: { create: [{ title: 'Compilar dados', order: 1 }, { title: 'Revisar fotos', order: 2 }, { title: 'Enviar relatório', order: 3 }] } },
        ],
      },
    },
  });

  await prisma.template.create({
    data: {
      name: 'Relatório Técnico',
      sector: 'Técnico',
      templateTasks: {
        create: [
          { title: 'Coleta de dados', order: 1, subtasks: { create: [{ title: 'Entrevistar equipe', order: 1 }, { title: 'Analisar documentos', order: 2 }] } },
          { title: 'Elaboração do relatório', order: 2, subtasks: { create: [{ title: 'Redigir introdução', order: 1 }, { title: 'Inserir dados', order: 2 }, { title: 'Conclusão', order: 3 }] } },
        ],
      },
    },
  });

  await prisma.template.create({
    data: {
      name: 'Auditoria Ambiental',
      sector: 'Ambiental',
      templateTasks: {
        create: [
          { title: 'Análise documental', order: 1, subtasks: { create: [{ title: 'Verificar licenças', order: 1 }, { title: 'Checar laudos', order: 2 }] } },
          { title: 'Inspeção in loco', order: 2, subtasks: { create: [{ title: 'Visitar área', order: 1 }, { title: 'Coletar evidências', order: 2 }] } },
          { title: 'Elaborar laudo', order: 3, subtasks: { create: [{ title: 'Compilar evidências', order: 1 }, { title: 'Redigir laudo', order: 2 }] } },
        ],
      },
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
