import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { CreateDuvidaDto } from '../types';
import { useHumanValidation } from '../hooks/useHumanValidation';

interface DuvidasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DuvidasModal: React.FC<DuvidasModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [formData, setFormData] = useState<CreateDuvidaDto>({
    nome: '',
    email: '',
    celular: '',
    duvida: '',
  });

  // Hook de validação anti-bot
  const { validateSubmission, resetValidation, HoneypotField } = useHumanValidation();

  // Reset da validação quando o modal abre
  useEffect(() => {
    if (isOpen) {
      resetValidation();
      setValidationError('');
    }
  }, [isOpen, resetValidation]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      await api.post('/duvidas', formData);
      setSuccess(true);
      setFormData({ nome: '', email: '', celular: '', duvida: '' });

      // Resetar mensagem de sucesso e fechar modal após 3 segundos
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao enviar dúvida');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSuccess(false);
      setFormData({ nome: '', email: '', celular: '', duvida: '' });
      setValidationError('');
      resetValidation();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900">Envie sua Dúvida</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="rounded-lg bg-green-50 p-8 text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <h3 className="mb-2 text-xl font-semibold text-green-900">
                Dúvida enviada com sucesso!
              </h3>
              <p className="text-green-700">Entraremos em contato em breve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10,11}"
                  placeholder="11987654321"
                  className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] placeholder:text-gray-400"
                />
                <p className="mt-1 text-xs text-gray-500">Apenas números, sem espaços</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Sua Dúvida *
                </label>
                <textarea
                  name="duvida"
                  value={formData.duvida}
                  onChange={handleChange}
                  required
                  minLength={10}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] placeholder:text-gray-400"
                  placeholder="Descreva sua dúvida..."
                />
              </div>

              {validationError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {validationError}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-gray-300 bg-white py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-[#D4AF37] py-3 font-semibold text-black transition-colors hover:bg-[#C49F2E] disabled:bg-gray-400 disabled:text-gray-600"
                >
                  {loading ? 'Enviando...' : 'Enviar Dúvida'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DuvidasModal;
