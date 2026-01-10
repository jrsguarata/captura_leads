import React, { useEffect, useState } from 'react';
import { Users, UserPlus, HelpCircle, MessageSquare, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import { InteressadoStatus } from '../../types';

interface Stats {
  totalInteressados: number;
  totalDuvidas: number;
  totalUsers: number;
  interessadosPorStatus: Record<string, number>;
}

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [interessadosRes, duvidasRes, usersRes] = await Promise.all([
        api.get('/interessados'),
        api.get('/duvidas'),
        api.get('/users'),
      ]);

      const interessados = interessadosRes.data.data || [];
      const interessadosPorStatus = interessados.reduce(
        (acc: Record<string, number>, item: any) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        },
        {},
      );

      setStats({
        totalInteressados: interessados.length,
        totalDuvidas: duvidasRes.data.data?.length || 0,
        totalUsers: usersRes.data.data?.length || 0,
        interessadosPorStatus,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    [InteressadoStatus.LEAD]: 'Leads',
    [InteressadoStatus.PROSPECT]: 'Prospects',
    [InteressadoStatus.NEGOTIATION]: 'Em Negociação',
    [InteressadoStatus.WIN]: 'Ganhos',
    [InteressadoStatus.LOST]: 'Perdidos',
    [InteressadoStatus.INTERRUPTED]: 'Interrompidos',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Visão Geral</h2>

      {/* Cards de estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Interessados</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.totalInteressados}</p>
            </div>
            <UserPlus className="h-12 w-12 text-primary-600" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dúvidas Recebidas</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.totalDuvidas}</p>
            </div>
            <HelpCircle className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.totalUsers}</p>
            </div>
            <Users className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversões</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats?.interessadosPorStatus[InteressadoStatus.WIN] || 0}
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Status dos interessados */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Interessados por Status do Funil
        </h3>
        <div className="space-y-3">
          {Object.entries(statusLabels).map(([status, label]) => {
            const count = stats?.interessadosPorStatus[status] || 0;
            const total = stats?.totalInteressados || 1;
            const percentage = ((count / total) * 100).toFixed(1);

            return (
              <div key={status}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{label}</span>
                  <span className="text-gray-600">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-primary-600"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
