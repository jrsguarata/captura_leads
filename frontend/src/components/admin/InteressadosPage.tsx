import React, { useEffect, useState } from 'react';
import { UserPlus, Eye, Edit, UserX, UserCheck, X } from 'lucide-react';
import api from '../../services/api';
import { Interessado, InteressadoStatus } from '../../types';

const statusOptions = [
  { value: 'lead', label: 'Lead' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'negotiation', label: 'Negociação' },
  { value: 'win', label: 'Ganho' },
  { value: 'lost', label: 'Perdido' },
  { value: 'interrupted', label: 'Interrompido' },
];

const statusColors: Record<string, string> = {
  lead: 'bg-blue-100 text-blue-800',
  prospect: 'bg-purple-100 text-purple-800',
  negotiation: 'bg-yellow-100 text-yellow-800',
  win: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
  interrupted: 'bg-gray-100 text-gray-800',
};

const InteressadosPage: React.FC = () => {
  const [interessados, setInteressados] = useState<Interessado[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInteressado, setSelectedInteressado] = useState<Interessado | null>(null);
  const [editForm, setEditForm] = useState({ nome: '', email: '', celular: '', status: InteressadoStatus.LEAD });

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

  const toggleStatus = async (interessadoId: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await api.delete(`/interessados/${interessadoId}`);
      }
      loadInteressados();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleView = (interessado: Interessado) => {
    setSelectedInteressado(interessado);
    setViewModalOpen(true);
  };

  const handleEdit = (interessado: Interessado) => {
    setSelectedInteressado(interessado);
    setEditForm({
      nome: interessado.nome,
      email: interessado.email,
      celular: interessado.celular,
      status: interessado.status,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedInteressado) return;

    try {
      await api.patch(`/interessados/${selectedInteressado.id}`, editForm);
      setEditModalOpen(false);
      loadInteressados();
    } catch (error) {
      console.error('Erro ao atualizar interessado:', error);
    }
  };

  const getStatusLabel = (status: InteressadoStatus) => {
    return statusOptions.find((s) => s.value === status)?.label || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Interessados</h2>
        <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
          <UserPlus className="h-5 w-5" />
          Novo Interessado
        </button>
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
                {interessados.map((interessado) => (
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
                          statusColors[interessado.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {getStatusLabel(interessado.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          interessado.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {interessado.isActive ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {new Date(interessado.criadoEm).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(interessado)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(interessado)}
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-50 transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(interessado.id, interessado.isActive)}
                          className={`rounded-lg p-2 transition-colors ${
                            interessado.isActive
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={interessado.isActive ? 'Desativar' : 'Ativar'}
                        >
                          {interessado.isActive ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
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
      {viewModalOpen && selectedInteressado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Visualizar Interessado</h3>
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
                <p className="mt-1 text-sm text-gray-900">{selectedInteressado.nome}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <p className="mt-1 text-sm text-gray-900">{selectedInteressado.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Celular</label>
                <p className="mt-1 text-sm text-gray-900">{selectedInteressado.celular}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getStatusLabel(selectedInteressado.status)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ativo</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedInteressado.isActive ? 'Sim' : 'Não'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Criado em</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedInteressado.criadoEm).toLocaleString('pt-BR')}
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
      {editModalOpen && selectedInteressado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Editar Interessado</h3>
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
                <input
                  type="text"
                  value={editForm.nome}
                  onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Celular</label>
                <input
                  type="text"
                  value={editForm.celular}
                  onChange={(e) => setEditForm({ ...editForm, celular: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as InteressadoStatus })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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

export default InteressadosPage;
