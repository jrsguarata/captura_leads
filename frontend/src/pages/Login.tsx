import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signed, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Se já estiver autenticado, redireciona para o dashboard correto
    if (signed && user) {
      const path = user.perfil === UserRole.ADMIN ? '/sistema/admin' : '/sistema/operator';
      navigate(path, { replace: true });
    }
  }, [signed, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn({ email, password });
      // O redirecionamento será feito pelo useEffect acima
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <LogIn className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Sistema Administrativo</h1>
          <p className="mt-2 text-gray-600">Faça login para acessar o sistema</p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-800">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-600 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:bg-gray-400"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <p className="text-center text-sm text-gray-600">Usuários de teste:</p>
            <div className="mt-2 space-y-1 text-xs text-gray-500">
              <p>
                <strong>ADMIN:</strong> admin@capturaleads.com / admin123
              </p>
              <p>
                <strong>OPERADOR:</strong> joao@capturaleads.com / operador123
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-primary-600 hover:text-primary-700">
            ← Voltar para página inicial
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
