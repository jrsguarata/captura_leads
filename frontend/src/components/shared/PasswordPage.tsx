import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const PasswordPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validações
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A nova senha deve ter no mínimo 6 caracteres.' });
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'A nova senha e a confirmação não coincidem.' });
      setLoading(false);
      return;
    }

    if (currentPassword === newPassword) {
      setMessage({ type: 'error', text: 'A nova senha deve ser diferente da senha atual.' });
      setLoading(false);
      return;
    }

    try {
      // Primeiro, valida a senha atual fazendo login
      await api.post('/auth/login', {
        email: user?.email,
        password: currentPassword,
      });

      // Se chegou aqui, a senha atual está correta
      await api.patch(`/users/${user?.id}`, {
        password: newPassword,
      });

      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });

      // Limpa os campos
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error.response?.status === 401) {
        setMessage({ type: 'error', text: 'Senha atual incorreta.' });
      } else {
        setMessage({
          type: 'error',
          text: error.response?.data?.message || 'Erro ao alterar senha. Tente novamente.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Alterar Senha</h2>
        <p className="mt-1 text-sm text-gray-600">
          Mantenha sua conta segura alterando sua senha regularmente
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div
              className={`flex items-center gap-2 rounded-lg p-4 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <Lock className="mb-1 inline h-4 w-4" /> Senha Atual
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Digite sua senha atual"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <Lock className="mb-1 inline h-4 w-4" /> Nova Senha
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Digite sua nova senha (mínimo 6 caracteres)"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <Lock className="mb-1 inline h-4 w-4" /> Confirmar Nova Senha
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Digite a nova senha novamente"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-blue-900">Requisitos de Senha</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-800"></div>
                Mínimo de 6 caracteres
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-800"></div>
                Deve ser diferente da senha atual
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-800"></div>
                As senhas devem coincidir
              </li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700 disabled:bg-gray-400"
            >
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordPage;
