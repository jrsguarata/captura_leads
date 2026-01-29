import React, { useEffect, useState } from 'react';
import { UserPlus, Eye, Edit, UserX, UserCheck, X } from 'lucide-react';
import api from '../../services/api';
import { Interessado, InteressadoStatus, Resposta, Followup, FollowupCanal, User } from '../../types';
import { maskCpf, maskCep, unmask } from '../../utils/masks';
import { fetchAddressByCep } from '../../services/viacep';

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

const canalOptions = [
  { value: FollowupCanal.VOZ, label: 'Voz' },
  { value: FollowupCanal.WHATSAPP, label: 'WhatsApp' },
  { value: FollowupCanal.EMAIL, label: 'Email' },
];

const inputClass =
  'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500';

interface EditFormState {
  nome: string;
  email: string;
  celular: string;
  status: InteressadoStatus;
  cpf: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  numero: string;
  complemento: string;
  profissao: string;
  registroConselho: string;
  tempoExperiencia: string;
  cepProfissional: string;
  logradouroProfissional: string;
  bairroProfissional: string;
  cidadeProfissional: string;
  estadoProfissional: string;
  numeroProfissional: string;
  complementoProfissional: string;
}

const emptyEditForm: EditFormState = {
  nome: '',
  email: '',
  celular: '',
  status: InteressadoStatus.LEAD,
  cpf: '',
  cep: '',
  logradouro: '',
  bairro: '',
  cidade: '',
  estado: '',
  numero: '',
  complemento: '',
  profissao: '',
  registroConselho: '',
  tempoExperiencia: '',
  cepProfissional: '',
  logradouroProfissional: '',
  bairroProfissional: '',
  cidadeProfissional: '',
  estadoProfissional: '',
  numeroProfissional: '',
  complementoProfissional: '',
};

type ViewTab = 'dados' | 'pessoais' | 'profissionais' | 'respostas' | 'followups';
type EditTab = 'basicos' | 'pessoais' | 'profissionais' | 'followup';

const InteressadosPage: React.FC = () => {
  const [interessados, setInteressados] = useState<Interessado[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInteressado, setSelectedInteressado] = useState<Interessado | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>(emptyEditForm);

  // Estados para respostas e follow-ups
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [userNamesMap, setUserNamesMap] = useState<Record<string, string>>({});

  // Estado para aba ativa no modal de visualização
  const [activeTab, setActiveTab] = useState<ViewTab>('dados');

  // Estado para aba ativa no modal de edição
  const [editActiveTab, setEditActiveTab] = useState<EditTab>('basicos');

  // Estado para novo follow-up (no modal de edição)
  const [novoFollowup, setNovoFollowup] = useState({
    texto: '',
    canal: FollowupCanal.WHATSAPP,
  });

  // Estados para loading do ViaCEP
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingCepProf, setLoadingCepProf] = useState(false);

  useEffect(() => {
    loadInteressados();
    loadUsers();
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

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      const users = response.data.data || response.data;
      const namesMap: Record<string, string> = {};
      users.forEach((user: User) => {
        namesMap[user.id] = user.nome;
      });
      setUserNamesMap(namesMap);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const loadInteressadoDetails = async (interessadoId: string) => {
    setLoadingDetails(true);
    try {
      const [respostasRes, followupsRes] = await Promise.all([
        api.get(`/respostas/interessado/${interessadoId}`),
        api.get(`/followup/interessado/${interessadoId}`),
      ]);
      setRespostas(respostasRes.data);
      setFollowups(followupsRes.data);
    } catch (error) {
      console.error('Erro ao carregar detalhes do interessado:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const toggleStatus = async (interessadoId: string, currentStatus: boolean) => {
    try {
      const endpoint = currentStatus ? 'deactivate' : 'activate';
      await api.patch(`/interessados/${interessadoId}/${endpoint}`);
      loadInteressados();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleView = async (interessado: Interessado) => {
    setSelectedInteressado(interessado);
    setActiveTab('dados');
    setViewModalOpen(true);
    await loadInteressadoDetails(interessado.id);
  };

  const handleEdit = async (interessado: Interessado) => {
    setSelectedInteressado(interessado);
    setEditForm({
      nome: interessado.nome,
      email: interessado.email,
      celular: interessado.celular,
      status: interessado.status,
      cpf: interessado.cpf || '',
      cep: interessado.cep || '',
      logradouro: interessado.logradouro || '',
      bairro: interessado.bairro || '',
      cidade: interessado.cidade || '',
      estado: interessado.estado || '',
      numero: interessado.numero || '',
      complemento: interessado.complemento || '',
      profissao: interessado.profissao || '',
      registroConselho: interessado.registroConselho || '',
      tempoExperiencia: interessado.tempoExperiencia || '',
      cepProfissional: interessado.cepProfissional || '',
      logradouroProfissional: interessado.logradouroProfissional || '',
      bairroProfissional: interessado.bairroProfissional || '',
      cidadeProfissional: interessado.cidadeProfissional || '',
      estadoProfissional: interessado.estadoProfissional || '',
      numeroProfissional: interessado.numeroProfissional || '',
      complementoProfissional: interessado.complementoProfissional || '',
    });
    setEditActiveTab('basicos');
    setEditModalOpen(true);
    await loadInteressadoDetails(interessado.id);
    setNovoFollowup({ texto: '', canal: FollowupCanal.WHATSAPP });
  };

  const handleSaveEdit = async () => {
    if (!selectedInteressado) return;

    try {
      const payload = {
        ...editForm,
        cpf: unmask(editForm.cpf) || undefined,
        cep: unmask(editForm.cep) || undefined,
        cepProfissional: unmask(editForm.cepProfissional) || undefined,
      };

      // Remover campos vazios para não sobrescrever com string vazia
      const cleanPayload: Record<string, string | undefined> = {};
      for (const [key, value] of Object.entries(payload)) {
        cleanPayload[key] = value === '' ? undefined : (value as string | undefined);
      }

      await api.patch(`/interessados/${selectedInteressado.id}`, cleanPayload);

      if (novoFollowup.texto.trim()) {
        await api.post('/followup', {
          interessadoId: selectedInteressado.id,
          texto: novoFollowup.texto,
          canal: novoFollowup.canal,
        });
      }

      setEditModalOpen(false);
      loadInteressados();
    } catch (error) {
      console.error('Erro ao atualizar interessado:', error);
      alert('Erro ao salvar alterações');
    }
  };

  const handleCepBlur = async () => {
    const cepDigits = unmask(editForm.cep);
    if (cepDigits.length !== 8) return;

    setLoadingCep(true);
    const address = await fetchAddressByCep(cepDigits);
    setLoadingCep(false);

    if (address) {
      setEditForm((prev: EditFormState) => ({
        ...prev,
        logradouro: address.logradouro || prev.logradouro,
        bairro: address.bairro || prev.bairro,
        cidade: address.localidade || prev.cidade,
        estado: address.uf || prev.estado,
      }));
    }
  };

  const handleCepProfBlur = async () => {
    const cepDigits = unmask(editForm.cepProfissional);
    if (cepDigits.length !== 8) return;

    setLoadingCepProf(true);
    const address = await fetchAddressByCep(cepDigits);
    setLoadingCepProf(false);

    if (address) {
      setEditForm((prev: EditFormState) => ({
        ...prev,
        logradouroProfissional: address.logradouro || prev.logradouroProfissional,
        bairroProfissional: address.bairro || prev.bairroProfissional,
        cidadeProfissional: address.localidade || prev.cidadeProfissional,
        estadoProfissional: address.uf || prev.estadoProfissional,
      }));
    }
  };

  const getUserName = (userId?: string) => {
    if (!userId) return 'N/A';
    return userNamesMap[userId] || 'Usuário não encontrado';
  };

  const getCanalLabel = (canal: FollowupCanal) => {
    return canalOptions.find((c) => c.value === canal)?.label || canal;
  };

  const getStatusLabel = (status: InteressadoStatus) => {
    return statusOptions.find((s) => s.value === status)?.label || status;
  };

  const renderViewTabButton = (tab: ViewTab, label: string) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`py-2 px-1 border-b-2 font-medium text-sm ${
        activeTab === tab
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );

  const renderEditTabButton = (tab: EditTab, label: string) => (
    <button
      onClick={() => setEditActiveTab(tab)}
      className={`py-2 px-1 border-b-2 font-medium text-sm ${
        editActiveTab === tab
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );

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

      {/* Modal de Visualização com Abas */}
      {viewModalOpen && selectedInteressado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto p-4">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl my-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Visualizar Interessado</h3>
              <button
                onClick={() => setViewModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Abas */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex -mb-px space-x-8">
                {renderViewTabButton('dados', 'Dados Básicos')}
                {renderViewTabButton('pessoais', 'Dados Pessoais')}
                {renderViewTabButton('profissionais', 'Dados Profissionais')}
                {renderViewTabButton('respostas', `Respostas (${respostas.length})`)}
                {renderViewTabButton('followups', `Follow-ups (${followups.length})`)}
              </nav>
            </div>

            {loadingDetails ? (
              <div className="flex justify-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
              </div>
            ) : (
              <>
                {/* Aba: Dados Básicos */}
                {activeTab === 'dados' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                  </div>
                )}

                {/* Aba: Dados Pessoais (Visualização) */}
                {activeTab === 'pessoais' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">CPF</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.cpf ? maskCpf(selectedInteressado.cpf) : 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">CEP</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.cep ? maskCep(selectedInteressado.cep) : 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Logradouro</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.logradouro || 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Número</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.numero || 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Complemento</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.complemento || 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bairro</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.bairro || 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cidade</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.cidade || 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.estado || 'Não informado'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Aba: Dados Profissionais (Visualização) */}
                {activeTab === 'profissionais' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Profissão</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.profissao || 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Registro no Conselho</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.registroConselho || 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tempo de Experiência</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.tempoExperiencia || 'Não informado'}
                        </p>
                      </div>
                    </div>
                    <hr className="my-4" />
                    <h5 className="text-sm font-semibold text-gray-700">Endereço Profissional</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">CEP</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.cepProfissional
                            ? maskCep(selectedInteressado.cepProfissional)
                            : 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Logradouro</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.logradouroProfissional || 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Número</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.numeroProfissional || 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Complemento</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.complementoProfissional || 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bairro</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.bairroProfissional || 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cidade</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.cidadeProfissional || 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInteressado.estadoProfissional || 'Não informado'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Aba: Respostas de Qualificação */}
                {activeTab === 'respostas' && (
                  <div className="space-y-4">
                    {respostas.length === 0 ? (
                      <p className="text-sm text-gray-500 italic text-center py-8">
                        Nenhuma resposta registrada
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {respostas.map((resposta) => (
                          <div key={resposta.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-2">{resposta.pergunta}</p>
                            <p className="text-sm text-gray-900">{resposta.resposta}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(resposta.criadoEm).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Aba: Follow-ups */}
                {activeTab === 'followups' && (
                  <div className="space-y-4">
                    {followups.length === 0 ? (
                      <p className="text-sm text-gray-500 italic text-center py-8">
                        Nenhum follow-up registrado
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {followups.map((followup) => (
                          <div key={followup.id} className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                            <p className="text-sm text-gray-900 whitespace-pre-wrap mb-3">{followup.texto}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <span className="font-medium">Canal: {getCanalLabel(followup.canal)}</span>
                              <span>•</span>
                              <span>Por: {getUserName(followup.criadoPor)}</span>
                              <span>•</span>
                              <span>{new Date(followup.criadoEm).toLocaleString('pt-BR')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            <div className="mt-6 flex justify-end border-t pt-4">
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

      {/* Modal de Edição com 4 Abas */}
      {editModalOpen && selectedInteressado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto p-4">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl my-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Editar Interessado</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Abas de Edição */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex -mb-px space-x-8">
                {renderEditTabButton('basicos', 'Dados Básicos')}
                {renderEditTabButton('pessoais', 'Dados Pessoais')}
                {renderEditTabButton('profissionais', 'Dados Profissionais')}
                {renderEditTabButton('followup', 'Follow-up')}
              </nav>
            </div>

            {loadingDetails ? (
              <div className="flex justify-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
              </div>
            ) : (
              <>
                {/* Aba: Dados Básicos */}
                {editActiveTab === 'basicos' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome</label>
                      <input
                        type="text"
                        value={editForm.nome}
                        onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">E-mail</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Celular</label>
                      <input
                        type="text"
                        value={editForm.celular}
                        onChange={(e) => setEditForm({ ...editForm, celular: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm({ ...editForm, status: e.target.value as InteressadoStatus })
                        }
                        className={inputClass}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Aba: Dados Pessoais */}
                {editActiveTab === 'pessoais' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">CPF</label>
                        <input
                          type="text"
                          value={maskCpf(editForm.cpf)}
                          onChange={(e) => setEditForm({ ...editForm, cpf: unmask(e.target.value) })}
                          placeholder="000.000.000-00"
                          maxLength={14}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          CEP {loadingCep && <span className="text-primary-600 text-xs">(buscando...)</span>}
                        </label>
                        <input
                          type="text"
                          value={maskCep(editForm.cep)}
                          onChange={(e) => setEditForm({ ...editForm, cep: unmask(e.target.value) })}
                          onBlur={handleCepBlur}
                          placeholder="00000-000"
                          maxLength={9}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Logradouro</label>
                        <input
                          type="text"
                          value={editForm.logradouro}
                          onChange={(e) => setEditForm({ ...editForm, logradouro: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Número</label>
                        <input
                          type="text"
                          value={editForm.numero}
                          onChange={(e) => setEditForm({ ...editForm, numero: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Complemento</label>
                        <input
                          type="text"
                          value={editForm.complemento}
                          onChange={(e) => setEditForm({ ...editForm, complemento: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bairro</label>
                        <input
                          type="text"
                          value={editForm.bairro}
                          onChange={(e) => setEditForm({ ...editForm, bairro: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cidade</label>
                        <input
                          type="text"
                          value={editForm.cidade}
                          onChange={(e) => setEditForm({ ...editForm, cidade: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <input
                          type="text"
                          value={editForm.estado}
                          onChange={(e) => setEditForm({ ...editForm, estado: e.target.value.toUpperCase() })}
                          maxLength={2}
                          placeholder="UF"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Aba: Dados Profissionais */}
                {editActiveTab === 'profissionais' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Profissão</label>
                        <input
                          type="text"
                          value={editForm.profissao}
                          onChange={(e) => setEditForm({ ...editForm, profissao: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Registro no Conselho</label>
                        <input
                          type="text"
                          value={editForm.registroConselho}
                          onChange={(e) => setEditForm({ ...editForm, registroConselho: e.target.value })}
                          placeholder="Ex: CRM 12345"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tempo de Experiência</label>
                        <input
                          type="text"
                          value={editForm.tempoExperiencia}
                          onChange={(e) => setEditForm({ ...editForm, tempoExperiencia: e.target.value })}
                          placeholder="Ex: 5 anos"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <hr className="my-2" />
                    <h5 className="text-sm font-semibold text-gray-700">Endereço Profissional</h5>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          CEP Profissional{' '}
                          {loadingCepProf && <span className="text-primary-600 text-xs">(buscando...)</span>}
                        </label>
                        <input
                          type="text"
                          value={maskCep(editForm.cepProfissional)}
                          onChange={(e) =>
                            setEditForm({ ...editForm, cepProfissional: unmask(e.target.value) })
                          }
                          onBlur={handleCepProfBlur}
                          placeholder="00000-000"
                          maxLength={9}
                          className={inputClass}
                        />
                      </div>
                      <div className="flex items-end">
                        <p className="text-xs text-gray-500 pb-2">
                          Preencha o CEP para buscar o endereço automaticamente
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Logradouro</label>
                      <input
                        type="text"
                        value={editForm.logradouroProfissional}
                        onChange={(e) =>
                          setEditForm({ ...editForm, logradouroProfissional: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Número</label>
                        <input
                          type="text"
                          value={editForm.numeroProfissional}
                          onChange={(e) =>
                            setEditForm({ ...editForm, numeroProfissional: e.target.value })
                          }
                          className={inputClass}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Complemento</label>
                        <input
                          type="text"
                          value={editForm.complementoProfissional}
                          onChange={(e) =>
                            setEditForm({ ...editForm, complementoProfissional: e.target.value })
                          }
                          placeholder="Ex: Sala 501"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bairro</label>
                        <input
                          type="text"
                          value={editForm.bairroProfissional}
                          onChange={(e) =>
                            setEditForm({ ...editForm, bairroProfissional: e.target.value })
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cidade</label>
                        <input
                          type="text"
                          value={editForm.cidadeProfissional}
                          onChange={(e) =>
                            setEditForm({ ...editForm, cidadeProfissional: e.target.value })
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <input
                          type="text"
                          value={editForm.estadoProfissional}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              estadoProfissional: e.target.value.toUpperCase(),
                            })
                          }
                          maxLength={2}
                          placeholder="UF"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Aba: Follow-up */}
                {editActiveTab === 'followup' && (
                  <div className="space-y-4">
                    {/* Histórico de follow-ups existentes */}
                    {followups.length > 0 && (
                      <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                        <h5 className="text-sm font-semibold text-gray-700">Histórico</h5>
                        {followups.map((followup) => (
                          <div
                            key={followup.id}
                            className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500"
                          >
                            <p className="text-sm text-gray-900 whitespace-pre-wrap mb-2">
                              {followup.texto}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <span className="font-medium">Canal: {getCanalLabel(followup.canal)}</span>
                              <span>•</span>
                              <span>Por: {getUserName(followup.criadoPor)}</span>
                              <span>•</span>
                              <span>{new Date(followup.criadoEm).toLocaleString('pt-BR')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <h5 className="text-sm font-semibold text-gray-700">Novo Follow-up</h5>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Canal</label>
                      <select
                        value={novoFollowup.canal}
                        onChange={(e) =>
                          setNovoFollowup({ ...novoFollowup, canal: e.target.value as FollowupCanal })
                        }
                        className={inputClass}
                      >
                        {canalOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto do Follow-up (opcional)
                      </label>
                      <textarea
                        value={novoFollowup.texto}
                        onChange={(e) => setNovoFollowup({ ...novoFollowup, texto: e.target.value })}
                        rows={4}
                        placeholder="Descreva o contato realizado... (será salvo junto com as alterações)"
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="mt-6 flex justify-end gap-2 border-t pt-4">
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
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteressadosPage;
