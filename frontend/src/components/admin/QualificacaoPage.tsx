import React, { useEffect, useState } from 'react';
import { Plus, Eye, Edit, Check, X } from 'lucide-react';
import api from '../../services/api';
import { Qualificacao } from '../../types';

const QualificacaoPage: React.FC = () => {
  const [perguntas, setPerguntas] = useState<Qualificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedPergunta, setSelectedPergunta] = useState<Qualificacao | null>(null);
  const [editForm, setEditForm] = useState({ questao: '', obrigatoriedade: false, opcoes: '' });
  const [createForm, setCreateForm] = useState({ questao: '', obrigatoriedade: false, opcoes: '' });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    loadPerguntas();
  }, []);

  const loadPerguntas = async () => {
    try {
      const response = await api.get('/qualificacao');
      setPerguntas(response.data.data || response.data);
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (perguntaId: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await api.delete(`/qualificacao/${perguntaId}`);
      } else {
        // Reativar não está implementado no backend - isso deletaria novamente
        // Para reativar, seria necessário um endpoint específico
      }
      loadPerguntas();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleView = (pergunta: Qualificacao) => {
    setSelectedPergunta(pergunta);
    setViewModalOpen(true);
  };

  const handleEdit = (pergunta: Qualificacao) => {
    setSelectedPergunta(pergunta);
    setEditForm({
      questao: pergunta.questao,
      obrigatoriedade: pergunta.obrigatoriedade,
      opcoes: pergunta.opcoes || '',
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedPergunta) return;

    try {
      await api.patch(`/qualificacao/${selectedPergunta.id}`, editForm);
      setEditModalOpen(false);
      loadPerguntas();
    } catch (error) {
      console.error('Erro ao atualizar pergunta:', error);
    }
  };

  const handleOpenCreateModal = () => {
    setCreateForm({ questao: '', obrigatoriedade: false, opcoes: '' });
    setCreateModalOpen(true);
  };

  const handleSaveCreate = async () => {
    if (!createForm.questao.trim()) {
      alert('Por favor, preencha a questão');
      return;
    }

    setCreateLoading(true);
    try {
      await api.post('/qualificacao', createForm);
      setCreateModalOpen(false);
      setCreateForm({ questao: '', obrigatoriedade: false, opcoes: '' });
      loadPerguntas();
    } catch (error: any) {
      console.error('Erro ao criar pergunta:', error);
      alert(error.response?.data?.message || 'Erro ao criar pergunta');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Perguntas de Qualificação</h2>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          Nova Pergunta
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
                    Questão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    Obrigatória
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    Opções
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    Status
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
                {perguntas.map((pergunta) => (
                  <tr key={pergunta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-md truncate">{pergunta.questao}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          pergunta.obrigatoriedade
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {pergunta.obrigatoriedade ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {pergunta.opcoes ? (
                        <div className="flex flex-wrap gap-1">
                          {pergunta.opcoes.split(';').slice(0, 2).map((opcao, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700"
                            >
                              {opcao}
                            </span>
                          ))}
                          {pergunta.opcoes.split(';').length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{pergunta.opcoes.split(';').length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Texto livre</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          !pergunta.desativadoEm
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {!pergunta.desativadoEm ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {new Date(pergunta.criadoEm).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(pergunta)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(pergunta)}
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-50 transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(pergunta.id, !pergunta.desativadoEm)}
                          className={`rounded-lg p-2 transition-colors ${
                            !pergunta.desativadoEm
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={!pergunta.desativadoEm ? 'Desativar' : 'Ativar'}
                        >
                          {!pergunta.desativadoEm ? (
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
      {viewModalOpen && selectedPergunta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Visualizar Pergunta</h3>
              <button
                onClick={() => setViewModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Questão</label>
                <p className="mt-1 text-sm text-gray-900">{selectedPergunta.questao}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Obrigatória</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedPergunta.obrigatoriedade ? 'Sim' : 'Não'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Opções</label>
                {selectedPergunta.opcoes ? (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedPergunta.opcoes.split(';').map((opcao, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700"
                      >
                        {opcao}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">Texto livre</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1 text-sm text-gray-900">
                  {!selectedPergunta.desativadoEm ? 'Ativa' : 'Inativa'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Criado em</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedPergunta.criadoEm).toLocaleString('pt-BR')}
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
      {editModalOpen && selectedPergunta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Editar Pergunta</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Questão</label>
                <textarea
                  value={editForm.questao}
                  onChange={(e) => setEditForm({ ...editForm, questao: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.obrigatoriedade}
                    onChange={(e) => setEditForm({ ...editForm, obrigatoriedade: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Resposta obrigatória</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Opções (separadas por ponto e vírgula)
                </label>
                <input
                  type="text"
                  value={editForm.opcoes}
                  onChange={(e) => setEditForm({ ...editForm, opcoes: e.target.value })}
                  placeholder="Opção 1;Opção 2;Opção 3"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Deixe em branco para permitir texto livre
                </p>
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

      {/* Modal de Criação */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Nova Pergunta</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Questão *</label>
                <textarea
                  value={createForm.questao}
                  onChange={(e) => setCreateForm({ ...createForm, questao: e.target.value })}
                  rows={3}
                  placeholder="Digite a pergunta..."
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={createForm.obrigatoriedade}
                    onChange={(e) => setCreateForm({ ...createForm, obrigatoriedade: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Resposta obrigatória</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Opções (separadas por ponto e vírgula)
                </label>
                <input
                  type="text"
                  value={createForm.opcoes}
                  onChange={(e) => setCreateForm({ ...createForm, opcoes: e.target.value })}
                  placeholder="Opção 1;Opção 2;Opção 3"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Deixe em branco para permitir texto livre
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setCreateModalOpen(false)}
                disabled={createLoading}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCreate}
                disabled={createLoading}
                className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {createLoading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualificacaoPage;
