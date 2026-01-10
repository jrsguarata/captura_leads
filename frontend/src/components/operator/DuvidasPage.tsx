import React, { useEffect, useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import api from '../../services/api';
import { Duvida, DuvidaStatus } from '../../types';

const DuvidasPage: React.FC = () => {
  const [duvidas, setDuvidas] = useState<Duvida[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadDuvidas();
  }, []);

  const loadDuvidas = async () => {
    try {
      const response = await api.get('/duvidas');
      setDuvidas(response.data.data || response.data);
    } catch (error) {
      console.error('Erro ao carregar dúvidas:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: DuvidaStatus) => {
    try {
      const newStatus =
        currentStatus === DuvidaStatus.FEITA ? DuvidaStatus.RESPONDIDA : DuvidaStatus.FEITA;
      await api.patch(`/duvidas/${id}`, { status: newStatus });
      loadDuvidas();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const filteredDuvidas = duvidas.filter(
    (item) =>
      item.nome.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.duvida.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dúvidas Recebidas</h2>

      <div className="rounded-lg bg-white p-4 shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou dúvida..."
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
      ) : (
        <div className="space-y-4">
          {filteredDuvidas.map((duvida) => (
            <div key={duvida.id} className="rounded-lg bg-white p-6 shadow-md">
              <div className="flex items-start gap-4">
                <MessageCircle className="mt-1 h-6 w-6 flex-shrink-0 text-primary-600" />
                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{duvida.nome}</h3>
                      <p className="text-sm text-gray-600">
                        {duvida.email} • {duvida.celular}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleStatus(duvida.id, duvida.status)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        duvida.status === DuvidaStatus.RESPONDIDA
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      {duvida.status === DuvidaStatus.RESPONDIDA ? 'Respondida' : 'Feita'}
                    </button>
                  </div>
                  <p className="text-gray-700">{duvida.duvida}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    Enviada em {new Date(duvida.criadoEm).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DuvidasPage;
