import { useState } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Task } from './types';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import KanbanPage from './pages/KanbanPage';
import MindMapPage from './pages/MindMapPage';
import CronogramaPage from './pages/CronogramaPage';
import TemplatesPage from './pages/TemplatesPage';
import SettingsPage from './pages/SettingsPage';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import TaskModal from './components/modals/TaskModal';
import NewTaskModal from './components/modals/NewTaskModal';

function AppContent() {
  const { T } = useTheme();
  const { user } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  if (!user) return <LoginPage />;

  const canAccess = (p: string) => {
    if (p === 'templates' && user.role === 'LIDERADO') return false;
    if (p === 'settings' && user.role !== 'ADMIN') return false;
    return true;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.bg, fontFamily: 'system-ui,sans-serif' }}>
      <Sidebar page={page} setPage={setPage} open={sidebarOpen} setOpen={setSidebarOpen} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div style={{ flex: 1, overflow: 'auto', padding: 24 }} key={refreshKey}>
          {page === 'dashboard' && <DashboardPage onSelectTask={setSelectedTask} />}
          {page === 'kanban' && <KanbanPage onSelectTask={setSelectedTask} onNewTask={() => setShowNewTask(true)} />}
          {page === 'mindmap' && <MindMapPage />}
          {page === 'cronograma' && <CronogramaPage onSelectTask={setSelectedTask} />}
          {page === 'templates' && canAccess('templates') && <TemplatesPage />}
          {page === 'settings' && canAccess('settings') && <SettingsPage />}
        </div>
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={refresh}
        />
      )}
      {showNewTask && (
        <NewTaskModal
          onClose={() => setShowNewTask(false)}
          onSaved={refresh}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
