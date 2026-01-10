import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import api from '../services/api';
import { CreateDuvidaDto } from '../types';

const DuvidasForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<CreateDuvidaDto>({
    nome: '',
    email: '',
    celular: '',
    duvida: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/duvidas', formData);
      setSuccess(true);
      setFormData({ nome: '', email: '', celular: '', duvida: '' });

      // Resetar mensagem de sucesso após 5 segundos
      setTimeout(() => setSuccess(false), 5000);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao enviar dúvida');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h3 className="mb-2 text-xl font-semibold text-green-900">Dúvida enviada com sucesso!</h3>
        <p className="text-green-700">Entraremos em contato em breve.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-lg">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Nome Completo *</label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={255}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <p className="mt-1 text-xs text-gray-500">Apenas números, sem espaços</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Sua Dúvida *</label>
        <textarea
          name="duvida"
          value={formData.duvida}
          onChange={handleChange}
          required
          minLength={10}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Descreva sua dúvida..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary-600 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:bg-gray-400"
      >
        {loading ? 'Enviando...' : 'Enviar Dúvida'}
      </button>
    </form>
  );
};

export default DuvidasForm;
