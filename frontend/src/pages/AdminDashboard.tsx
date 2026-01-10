import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  MessageSquare,
  HelpCircle,
  Settings,
  BarChart3,
  LogOut,
  UserCircle,
  Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import InteressadosPage from '../components/admin/InteressadosPage';
import QualificacaoPage from '../components/admin/QualificacaoPage';
import DuvidasPage from '../components/admin/DuvidasPage';
import UsersPage from '../components/admin/UsersPage';
import DashboardHome from '../components/admin/DashboardHome';
import ProfilePage from '../components/shared/ProfilePage';
import PasswordPage from '../components/shared/PasswordPage';

const AdminDashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/sistema/admin' },
    { icon: UserPlus, label: 'Interessados', path: '/sistema/admin/interessados' },
    { icon: MessageSquare, label: 'Perguntas de Qualificação', path: '/sistema/admin/qualificacao' },
    { icon: HelpCircle, label: 'Dúvidas', path: '/sistema/admin/duvidas' },
    { icon: Users, label: 'Usuários', path: '/sistema/admin/usuarios' },
    { icon: UserCircle, label: 'Perfil', path: '/sistema/admin/perfil' },
    { icon: Lock, label: 'Senha', path: '/sistema/admin/senha' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        menuItems={menuItems}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-sm text-gray-600">Bem-vindo, {user?.nome}</p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/interessados" element={<InteressadosPage />} />
            <Route path="/qualificacao" element={<QualificacaoPage />} />
            <Route path="/duvidas" element={<DuvidasPage />} />
            <Route path="/usuarios" element={<UsersPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/senha" element={<PasswordPage />} />
            <Route path="*" element={<Navigate to="/sistema/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
