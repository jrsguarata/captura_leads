import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { Qualificacao, CreateRespostasBatchDto } from '../types';
import { useHumanValidation } from '../hooks/useHumanValidation';
import { maskCpf, maskCep, unmask } from '../utils/masks';
import { fetchAddressByCep } from '../services/viacep';

interface InteresseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'form' | 'pessoais' | 'profissionais' | 'questions' | 'success';

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] placeholder:text-gray-400';

const InteresseModal: React.FC<InteresseModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [perguntas, setPerguntas] = useState<Qualificacao[]>([]);
  const [interessadoId, setInteressadoId] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // Hook de validação anti-bot
  const { validateSubmission, resetValidation, HoneypotField } = useHumanValidation();

  // Dados básicos (Step 1)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    celular: '',
  });

  // Dados pessoais (Step 2)
  const [dadosPessoais, setDadosPessoais] = useState({
    cpf: '',
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: '',
    numero: '',
    complemento: '',
  });

  // Dados profissionais (Step 3)
  const [dadosProfissionais, setDadosProfissionais] = useState({
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
  });

  // Respostas das perguntas de qualificação
  const [respostas, setRespostas] = useState<Record<string, string>>({});

  // Loading ViaCEP
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingCepProf, setLoadingCepProf] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPerguntas();
    }
  }, [isOpen]);

  // Reset da validação quando o modal abre
  useEffect(() => {
    if (isOpen) {
      resetValidation();
      setValidationError('');
    }
  }, [isOpen, resetValidation]);

  const loadPerguntas = async () => {
    try {
      const response = await api.get('/qualificacao/active');
      setPerguntas(response.data);
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleRespostaChange = (questao: string, resposta: string) => {
    setRespostas({ ...respostas, [questao]: resposta });
  };

  // Step 1: Validar dados básicos e avançar
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validação anti-bot
    const validation = validateSubmission();
    if (!validation.valid) {
      setValidationError(validation.message);
      return;
    }

    setStep('pessoais');
  };

  // Step 2: Validar dados pessoais e avançar
  const handleSubmitPessoais = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const cpfDigits = unmask(dadosPessoais.cpf);
    if (cpfDigits.length !== 11) {
      setValidationError('CPF deve ter exatamente 11 dígitos');
      return;
    }

    const cepDigits = unmask(dadosPessoais.cep);
    if (cepDigits.length !== 8) {
      setValidationError('CEP deve ter exatamente 8 dígitos');
      return;
    }

    if (!dadosPessoais.logradouro || !dadosPessoais.bairro || !dadosPessoais.cidade || !dadosPessoais.estado) {
      setValidationError('Preencha todos os campos de endereço');
      return;
    }

    if (!dadosPessoais.numero) {
      setValidationError('O campo Número é obrigatório');
      return;
    }

    setStep('profissionais');
  };

  // Step 3: Validar dados profissionais e criar interessado
  const handleSubmitProfissionais = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!dadosProfissionais.profissao) {
      setValidationError('O campo Profissão é obrigatório');
      return;
    }
    if (!dadosProfissionais.registroConselho) {
      setValidationError('O campo Registro no Conselho é obrigatório');
      return;
    }
    if (!dadosProfissionais.tempoExperiencia) {
      setValidationError('O campo Tempo de Experiência é obrigatório');
      return;
    }

    // Validação condicional: se CEP profissional preenchido, endereço é obrigatório
    const cepProfDigits = unmask(dadosProfissionais.cepProfissional);
    if (cepProfDigits.length > 0) {
      if (cepProfDigits.length !== 8) {
        setValidationError('CEP profissional deve ter exatamente 8 dígitos');
        return;
      }
      if (
        !dadosProfissionais.logradouroProfissional ||
        !dadosProfissionais.bairroProfissional ||
        !dadosProfissionais.cidadeProfissional ||
        !dadosProfissionais.estadoProfissional ||
        !dadosProfissionais.numeroProfissional
      ) {
        setValidationError('Preencha todos os campos de endereço profissional');
        return;
      }
    }

    setLoading(true);

    try {
      // Montar payload com todos os dados das 3 etapas
      const payload = {
        ...formData,
        cpf: unmask(dadosPessoais.cpf),
        cep: unmask(dadosPessoais.cep),
        logradouro: dadosPessoais.logradouro,
        bairro: dadosPessoais.bairro,
        cidade: dadosPessoais.cidade,
        estado: dadosPessoais.estado,
        numero: dadosPessoais.numero,
        complemento: dadosPessoais.complemento || undefined,
        profissao: dadosProfissionais.profissao,
        registroConselho: dadosProfissionais.registroConselho,
        tempoExperiencia: dadosProfissionais.tempoExperiencia,
        cepProfissional: cepProfDigits.length === 8 ? cepProfDigits : undefined,
        logradouroProfissional: dadosProfissionais.logradouroProfissional || undefined,
        bairroProfissional: dadosProfissionais.bairroProfissional || undefined,
        cidadeProfissional: dadosProfissionais.cidadeProfissional || undefined,
        estadoProfissional: dadosProfissionais.estadoProfissional || undefined,
        numeroProfissional: dadosProfissionais.numeroProfissional || undefined,
        complementoProfissional: dadosProfissionais.complementoProfissional || undefined,
      };

      const response = await api.post('/interessados', payload);
      setInteressadoId(response.data.id);

      // Se não houver perguntas de qualificação, ir direto para sucesso
      if (perguntas.length === 0) {
        setStep('success');
      } else {
        setStep('questions');
      }
    } catch (error: any) {
      const message = error.response?.data?.message;
      setValidationError(
        typeof message === 'string' ? message : Array.isArray(message) ? message.join(', ') : 'Erro ao enviar formulário',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRespostas = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar perguntas obrigatórias
    const perguntasObrigatorias = perguntas.filter((p) => p.obrigatoriedade);
    const faltandoResposta = perguntasObrigatorias.some((p) => !respostas[p.questao]);

    if (faltandoResposta) {
      alert('Por favor, responda todas as perguntas obrigatórias');
      return;
    }

    setLoading(true);

    try {
      const respostasArray = Object.entries(respostas).map(([pergunta, resposta]) => ({
        pergunta,
        resposta,
      }));

      const payload: CreateRespostasBatchDto = {
        interessadoId,
        respostas: respostasArray,
      };

      await api.post('/respostas/batch', payload);
      setStep('success');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao enviar respostas');
    } finally {
      setLoading(false);
    }
  };

  const handleCepBlur = async () => {
    const cepDigits = unmask(dadosPessoais.cep);
    if (cepDigits.length !== 8) return;

    setLoadingCep(true);
    const address = await fetchAddressByCep(cepDigits);
    setLoadingCep(false);

    if (address) {
      setDadosPessoais((prev) => ({
        ...prev,
        logradouro: address.logradouro || prev.logradouro,
        bairro: address.bairro || prev.bairro,
        cidade: address.localidade || prev.cidade,
        estado: address.uf || prev.estado,
      }));
    }
  };

  const handleCepProfBlur = async () => {
    const cepDigits = unmask(dadosProfissionais.cepProfissional);
    if (cepDigits.length !== 8) return;

    setLoadingCepProf(true);
    const address = await fetchAddressByCep(cepDigits);
    setLoadingCepProf(false);

    if (address) {
      setDadosProfissionais((prev) => ({
        ...prev,
        logradouroProfissional: address.logradouro || prev.logradouroProfissional,
        bairroProfissional: address.bairro || prev.bairroProfissional,
        cidadeProfissional: address.localidade || prev.cidadeProfissional,
        estadoProfissional: address.uf || prev.estadoProfissional,
      }));
    }
  };

  const handleClose = () => {
    setStep('form');
    setFormData({ nome: '', email: '', celular: '' });
    setDadosPessoais({
      cpf: '',
      cep: '',
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: '',
      numero: '',
      complemento: '',
    });
    setDadosProfissionais({
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
    });
    setRespostas({});
    setInteressadoId('');
    setValidationError('');
    resetValidation();
    onClose();
  };

  const handleVoltar = () => {
    setValidationError('');
    if (step === 'pessoais') setStep('form');
    else if (step === 'profissionais') setStep('pessoais');
  };

  if (!isOpen) return null;

  const totalSteps = perguntas.length > 0 ? 4 : 3;
  const stepLabels: Record<Step, string> = {
    form: `1 de ${totalSteps}`,
    pessoais: `2 de ${totalSteps}`,
    profissionais: `3 de ${totalSteps}`,
    questions: `4 de ${totalSteps}`,
    success: '',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Indicador de etapa */}
        {step !== 'success' && (
          <p className="text-xs text-gray-500 mb-1">Etapa {stepLabels[step]}</p>
        )}

        {/* Step 1: Dados Básicos */}
        {step === 'form' && (
          <>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Tenho Interesse</h2>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Campo Honeypot - invisível para humanos */}
              <HoneypotField />

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleFormChange}
                  required
                  minLength={3}
                  maxLength={255}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">E-mail *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Celular *</label>
                <input
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleFormChange}
                  required
                  pattern="[0-9]{10,11}"
                  placeholder="11987654321"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-gray-500">Apenas números, sem espaços</p>
              </div>

              {validationError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {validationError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#D4AF37] py-3 font-semibold text-black transition-colors hover:bg-[#C49F2E] disabled:bg-gray-400 disabled:text-gray-600"
              >
                Continuar
              </button>
            </form>
          </>
        )}

        {/* Step 2: Dados Pessoais */}
        {step === 'pessoais' && (
          <>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Dados Pessoais</h2>
            <form onSubmit={handleSubmitPessoais} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">CPF *</label>
                  <input
                    type="text"
                    value={maskCpf(dadosPessoais.cpf)}
                    onChange={(e) =>
                      setDadosPessoais({ ...dadosPessoais, cpf: unmask(e.target.value) })
                    }
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    CEP * {loadingCep && <span className="text-[#D4AF37] text-xs">(buscando...)</span>}
                  </label>
                  <input
                    type="text"
                    value={maskCep(dadosPessoais.cep)}
                    onChange={(e) =>
                      setDadosPessoais({ ...dadosPessoais, cep: unmask(e.target.value) })
                    }
                    onBlur={handleCepBlur}
                    placeholder="00000-000"
                    maxLength={9}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Logradouro *</label>
                <input
                  type="text"
                  value={dadosPessoais.logradouro}
                  onChange={(e) =>
                    setDadosPessoais({ ...dadosPessoais, logradouro: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Número *</label>
                  <input
                    type="text"
                    value={dadosPessoais.numero}
                    onChange={(e) =>
                      setDadosPessoais({ ...dadosPessoais, numero: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Complemento</label>
                  <input
                    type="text"
                    value={dadosPessoais.complemento}
                    onChange={(e) =>
                      setDadosPessoais({ ...dadosPessoais, complemento: e.target.value })
                    }
                    placeholder="Apto, bloco, etc."
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Bairro *</label>
                  <input
                    type="text"
                    value={dadosPessoais.bairro}
                    onChange={(e) =>
                      setDadosPessoais({ ...dadosPessoais, bairro: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Cidade *</label>
                  <input
                    type="text"
                    value={dadosPessoais.cidade}
                    onChange={(e) =>
                      setDadosPessoais({ ...dadosPessoais, cidade: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Estado *</label>
                  <input
                    type="text"
                    value={dadosPessoais.estado}
                    onChange={(e) =>
                      setDadosPessoais({ ...dadosPessoais, estado: e.target.value.toUpperCase() })
                    }
                    maxLength={2}
                    placeholder="UF"
                    className={inputClass}
                  />
                </div>
              </div>

              {validationError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {validationError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleVoltar}
                  className="flex-1 rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#D4AF37] py-3 font-semibold text-black transition-colors hover:bg-[#C49F2E]"
                >
                  Continuar
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 3: Dados Profissionais */}
        {step === 'profissionais' && (
          <>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Dados Profissionais</h2>
            <form onSubmit={handleSubmitProfissionais} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Profissão *</label>
                  <input
                    type="text"
                    value={dadosProfissionais.profissao}
                    onChange={(e) =>
                      setDadosProfissionais({ ...dadosProfissionais, profissao: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Registro no Conselho *
                  </label>
                  <input
                    type="text"
                    value={dadosProfissionais.registroConselho}
                    onChange={(e) =>
                      setDadosProfissionais({ ...dadosProfissionais, registroConselho: e.target.value })
                    }
                    placeholder="Ex: CRM 12345"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tempo de Experiência *
                  </label>
                  <input
                    type="text"
                    value={dadosProfissionais.tempoExperiencia}
                    onChange={(e) =>
                      setDadosProfissionais({ ...dadosProfissionais, tempoExperiencia: e.target.value })
                    }
                    placeholder="Ex: 5 anos"
                    className={inputClass}
                  />
                </div>
              </div>

              <hr className="my-2" />
              <p className="text-sm text-gray-600">
                Endereço profissional (opcional)
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    CEP Profissional{' '}
                    {loadingCepProf && (
                      <span className="text-[#D4AF37] text-xs">(buscando...)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={maskCep(dadosProfissionais.cepProfissional)}
                    onChange={(e) =>
                      setDadosProfissionais({
                        ...dadosProfissionais,
                        cepProfissional: unmask(e.target.value),
                      })
                    }
                    onBlur={handleCepProfBlur}
                    placeholder="00000-000"
                    maxLength={9}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Logradouro</label>
                  <input
                    type="text"
                    value={dadosProfissionais.logradouroProfissional}
                    onChange={(e) =>
                      setDadosProfissionais({
                        ...dadosProfissionais,
                        logradouroProfissional: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Número</label>
                  <input
                    type="text"
                    value={dadosProfissionais.numeroProfissional}
                    onChange={(e) =>
                      setDadosProfissionais({
                        ...dadosProfissionais,
                        numeroProfissional: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Complemento</label>
                  <input
                    type="text"
                    value={dadosProfissionais.complementoProfissional}
                    onChange={(e) =>
                      setDadosProfissionais({
                        ...dadosProfissionais,
                        complementoProfissional: e.target.value,
                      })
                    }
                    placeholder="Ex: Sala 501"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Bairro</label>
                  <input
                    type="text"
                    value={dadosProfissionais.bairroProfissional}
                    onChange={(e) =>
                      setDadosProfissionais({
                        ...dadosProfissionais,
                        bairroProfissional: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Cidade</label>
                  <input
                    type="text"
                    value={dadosProfissionais.cidadeProfissional}
                    onChange={(e) =>
                      setDadosProfissionais({
                        ...dadosProfissionais,
                        cidadeProfissional: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Estado</label>
                  <input
                    type="text"
                    value={dadosProfissionais.estadoProfissional}
                    onChange={(e) =>
                      setDadosProfissionais({
                        ...dadosProfissionais,
                        estadoProfissional: e.target.value.toUpperCase(),
                      })
                    }
                    maxLength={2}
                    placeholder="UF"
                    className={inputClass}
                  />
                </div>
              </div>

              {validationError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {validationError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleVoltar}
                  className="flex-1 rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-[#D4AF37] py-3 font-semibold text-black transition-colors hover:bg-[#C49F2E] disabled:bg-gray-400 disabled:text-gray-600"
                >
                  {loading ? 'Enviando...' : 'Continuar'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 4: Perguntas de Qualificação */}
        {step === 'questions' && (
          <>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Perguntas de Qualificação</h2>
            <form onSubmit={handleSubmitRespostas} className="space-y-6">
              {perguntas.map((pergunta) => (
                <div key={pergunta.id}>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {pergunta.questao} {pergunta.obrigatoriedade && '*'}
                  </label>
                  {pergunta.opcoes ? (
                    <select
                      value={respostas[pergunta.questao] || ''}
                      onChange={(e) => handleRespostaChange(pergunta.questao, e.target.value)}
                      required={pergunta.obrigatoriedade}
                      className={inputClass}
                    >
                      <option value="">Selecione uma opção</option>
                      {pergunta.opcoes.split(';').map((opcao) => (
                        <option key={opcao} value={opcao}>
                          {opcao}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <textarea
                      value={respostas[pergunta.questao] || ''}
                      onChange={(e) => handleRespostaChange(pergunta.questao, e.target.value)}
                      required={pergunta.obrigatoriedade}
                      rows={3}
                      className={inputClass}
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#D4AF37] py-3 font-semibold text-black transition-colors hover:bg-[#C49F2E] disabled:bg-gray-400 disabled:text-gray-600"
              >
                {loading ? 'Enviando...' : 'Enviar Respostas'}
              </button>
            </form>
          </>
        )}

        {/* Step 5: Sucesso */}
        {step === 'success' && (
          <div className="text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Obrigado pelo seu interesse!</h2>
            <p className="mb-6 text-gray-600">
              Recebemos suas informações e entraremos em contato em breve.
            </p>
            <button
              onClick={handleClose}
              className="rounded-lg bg-[#D4AF37] px-6 py-3 font-semibold text-black transition-colors hover:bg-[#C49F2E]"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteresseModal;
