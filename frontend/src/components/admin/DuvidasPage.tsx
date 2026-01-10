import React, { useEffect, useState } from 'react';
import { Eye, Edit, Check, X } from 'lucide-react';
import api from '../../services/api';
import { Duvida, DuvidaStatus } from '../../types';

const statusOptions = [
  { value: 'feita', label: 'Feita' },
  { value: 'respondida', label: 'Respondida' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'negotiation', label: 'Negociação' },
  { value: 'win', label: 'Ganho' },
  { value: 'lost', label: 'Perdido' },
  { value: 'interrupted', label: 'Interrompido' },
];

const statusColors: Record<string, string> = {
  feita: 'bg-blue-100 text-blue-800',
  respondida: 'bg-green-100 text-green-800',
  prospect: 'bg-purple-100 text-purple-800',
  negotiation: 'bg-yellow-100 text-yellow-800',
  win: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-red-100 text-red-800',
  interrupted: 'bg-gray-100 text-gray-800',
};

const DuvidasPage: React.FC = () => {
  const [duvidas, setDuvidas] = useState<Duvida[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDuvida, setSelectedDuvida] = useState<Duvida | null>(null);
  const [editForm, setEditForm] = useState({
    resposta: '',
  });

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

  const toggleStatus = async (duvidaId: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await api.delete(`/duvidas/${duvidaId}`);
      }
      loadDuvidas();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleView = (duvida: Duvida) => {
    setSelectedDuvida(duvida);
    setViewModalOpen(true);
  };

  const handleEdit = (duvida: Duvida) => {
    setSelectedDuvida(duvida);
    setEditForm({
      resposta: duvida.resposta || '',
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedDuvida) return;

    try {
      // Se a resposta foi preenchida e o status ainda é 'feita', mudar para 'respondida'
      const payload: any = { resposta: editForm.resposta };
      if (editForm.resposta && editForm.resposta.trim() !== '' && selectedDuvida.status === DuvidaStatus.FEITA) {
        payload.status = DuvidaStatus.RESPONDIDA;
      }

      await api.patch(`/duvidas/${selectedDuvida.id}`, payload);
      setEditModalOpen(false);
      loadDuvidas();
    } catch (error) {
      console.error('Erro ao atualizar dúvida:', error);
    }
  };

  const getStatusLabel = (status: DuvidaStatus) => {
    return statusOptions.find((s) => s.value === status)?.label || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Dúvidas</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-lg bg-white p-12 shadow-md">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
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
                    Dúvida
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    Ativo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {duvidas.map((duvida) => (
                  <tr key={duvida.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {duvida.nome}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {duvida.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {duvida.celular}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="max-w-xs truncate">{duvida.duvida}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusColors[duvida.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {getStatusLabel(duvida.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          !duvida.desativadoEm
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {!duvida.desativadoEm ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {new Date(duvida.criadoEm).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(duvida)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(duvida)}
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-50 transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(duvida.id, !duvida.desativadoEm)}
                          className={`rounded-lg p-2 transition-colors ${
                            !duvida.desativadoEm
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={!duvida.desativadoEm ? 'Desativar' : 'Ativar'}
                        >
                          {!duvida.desativadoEm ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Visualização */}
      {viewModalOpen && selectedDuvida && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Visualizar Dúvida</h3>
              <button
                onClick={() => setViewModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <p className="mt-1 text-sm text-gray-900">{selectedDuvida.nome}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <p className="mt-1 text-sm text-gray-900">{selectedDuvida.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Celular</label>
                <p className="mt-1 text-sm text-gray-900">{selectedDuvida.celular}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dúvida</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {selectedDuvida.duvida}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Resposta</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {selectedDuvida.resposta || 'Não respondida'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getStatusLabel(selectedDuvida.status)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ativo</label>
                <p className="mt-1 text-sm text-gray-900">
                  {!selectedDuvida.desativadoEm ? 'Sim' : 'Não'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Criado em</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedDuvida.criadoEm).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewModalOpen(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {editModalOpen && selectedDuvida && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Editar Dúvida</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <p className="mt-1 text-sm text-gray-900">{selectedDuvida.nome}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <p className="mt-1 text-sm text-gray-900">{selectedDuvida.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Celular</label>
                <p className="mt-1 text-sm text-gray-900">{selectedDuvida.celular}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dúvida</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedDuvida.duvida}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Resposta *</label>
                <textarea
                  value={editForm.resposta}
                  onChange={(e) => setEditForm({ ...editForm, resposta: e.target.value })}
                  rows={4}
                  placeholder="Digite a resposta aqui..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  * Ao preencher a resposta, o status mudará automaticamente de "Feita" para "Respondida"
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status atual</label>
                <p className="mt-1 text-sm text-gray-900">{getStatusLabel(selectedDuvida.status)}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuvidasPage;
