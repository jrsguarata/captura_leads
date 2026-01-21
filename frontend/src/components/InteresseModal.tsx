import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { Qualificacao, CreateInteressadoDto, CreateRespostasBatchDto } from '../types';
import { useHumanValidation } from '../hooks/useHumanValidation';

interface InteresseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InteresseModal: React.FC<InteresseModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'questions' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [perguntas, setPerguntas] = useState<Qualificacao[]>([]);
  const [interessadoId, setInteressadoId] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // Hook de validação anti-bot
  const { validateSubmission, resetValidation, HoneypotField } = useHumanValidation();

  // Dados do formulário inicial
  const [formData, setFormData] = useState<CreateInteressadoDto>({
    nome: '',
    email: '',
    celular: '',
  });

  // Respostas das perguntas de qualificação
  const [respostas, setRespostas] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && step === 'questions') {
      loadPerguntas();
    }
  }, [isOpen, step]);

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

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validação anti-bot
    const validation = validateSubmission();
    if (!validation.valid) {
      setValidationError(validation.message);
      return;
    }

    setLoading(true);

    try {
      // Criar interessado
      const response = await api.post('/interessados', formData);
      setInteressadoId(response.data.id);
      setStep('questions');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao enviar formulário');
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

  const handleClose = () => {
    setStep('form');
    setFormData({ nome: '', email: '', celular: '' });
    setRespostas({});
    setInteressadoId('');
    setValidationError('');
    resetValidation();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

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
                  className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] placeholder:text-gray-400"
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
                  className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] placeholder:text-gray-400"
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
                  className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] placeholder:text-gray-400"
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
                {loading ? 'Enviando...' : 'Continuar'}
              </button>
            </form>
          </>
        )}

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
                      className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
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
                      className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] placeholder:text-gray-400"
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
