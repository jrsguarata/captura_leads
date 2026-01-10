import React, { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import api from '../../services/api';
import { Interessado, InteressadoStatus } from '../../types';

const InteressadosPage: React.FC = () => {
  const [interessados, setInteressados] = useState<Interessado[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadInteressados();
  }, []);

  const loadInteressados = async () => {
    try {
      const response = await api.get('/interessados');
      setInteressados(response.data.data || response.data);
    } catch (error) {
      console.error('Erro ao carregar interessados:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInteressados = interessados.filter(
    (item) =>
      item.nome.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.celular.includes(search),
  );

  const statusLabels: Record<string, string> = {
    [InteressadoStatus.LEAD]: 'Lead',
    [InteressadoStatus.PROSPECT]: 'Prospect',
    [InteressadoStatus.NEGOTIATION]: 'Negociação',
    [InteressadoStatus.WIN]: 'Ganho',
    [InteressadoStatus.LOST]: 'Perdido',
    [InteressadoStatus.INTERRUPTED]: 'Interrompido',
  };

  const statusColors: Record<string, string> = {
    [InteressadoStatus.LEAD]: 'bg-gray-100 text-gray-800',
    [InteressadoStatus.PROSPECT]: 'bg-blue-100 text-blue-800',
    [InteressadoStatus.NEGOTIATION]: 'bg-yellow-100 text-yellow-800',
    [InteressadoStatus.WIN]: 'bg-green-100 text-green-800',
    [InteressadoStatus.LOST]: 'bg-red-100 text-red-800',
    [InteressadoStatus.INTERRUPTED]: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Meus Interessados</h2>

      <div className="rounded-lg bg-white p-4 shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou celular..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-lg bg-white p-12 shadow-md">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      ) : filteredInteressados.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-md">
          <p className="text-gray-600">Nenhum interessado encontrado</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    E-mail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    Celular
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredInteressados.map((interessado) => (
                  <tr key={interessado.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {interessado.nome}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {interessado.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {interessado.celular}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusColors[interessado.status]
                        }`}
                      >
                        {statusLabels[interessado.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <button
                        className="text-primary-600 hover:text-primary-800"
                        title="Ver detalhes"
                      >
                        <Eye className="inline h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteressadosPage;
