import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { Qualificacao } from '../../types';

const QualificacaoPage: React.FC = () => {
  const [perguntas, setPerguntas] = useState<Qualificacao[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Perguntas de Qualificação</h2>
        <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
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
        <div className="space-y-4">
          {perguntas.map((pergunta, index) => (
            <div key={pergunta.id} className="rounded-lg bg-white p-6 shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{pergunta.questao}</h3>
                  </div>
                  <div className="ml-11 space-y-2">
                    <div className="flex items-center gap-4 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          pergunta.obrigatoriedade
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {pergunta.obrigatoriedade ? 'Obrigatória' : 'Opcional'}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          pergunta.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {pergunta.isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    {pergunta.opcoes && (
                      <div>
                        <p className="mb-1 text-sm font-medium text-gray-700">Opções:</p>
                        <div className="flex flex-wrap gap-2">
                          {pergunta.opcoes.split(';').map((opcao) => (
                            <span
                              key={opcao}
                              className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700"
                            >
                              {opcao}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-primary-600 hover:text-primary-800" title="Editar">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800" title="Excluir">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QualificacaoPage;
