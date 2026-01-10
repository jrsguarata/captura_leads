import React, { useEffect, useState } from 'react';
import { UserPlus, HelpCircle, MessageSquare, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import { InteressadoStatus } from '../../types';

interface Stats {
  meusInteressados: number;
  totalDuvidas: number;
  meusFollowups: number;
}

const OperatorDashboardHome: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [interessadosRes, duvidasRes, followupsRes] = await Promise.all([
        api.get('/interessados'),
        api.get('/duvidas'),
        api.get('/followup'),
      ]);

      setStats({
        meusInteressados: interessadosRes.data.data?.length || 0,
        totalDuvidas: duvidasRes.data.data?.length || 0,
        meusFollowups: followupsRes.data.data?.length || 0,
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Visão Geral</h2>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Meus Interessados</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.meusInteressados}</p>
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
              <p className="text-sm font-medium text-gray-600">Meus Follow-ups</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.meusFollowups}</p>
            </div>
            <MessageSquare className="h-12 w-12 text-green-600" />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-blue-900">Dica do dia</h3>
        <p className="text-blue-800">
          Lembre-se de registrar todos os follow-ups com seus leads para manter um histórico
          completo de comunicação.
        </p>
      </div>
    </div>
  );
};

export default OperatorDashboardHome;
