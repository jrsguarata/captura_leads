import React, { useState } from 'react';
import { GraduationCap, Users, Award, Clock, MessageCircle, CheckCircle } from 'lucide-react';
import InteresseModal from '../components/InteresseModal';
import DuvidasForm from '../components/DuvidasForm';

const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold leading-tight">
              Transforme sua Carreira com Nossos Cursos Presenciais
            </h1>
            <p className="mb-8 text-xl text-primary-100">
              Aprenda com os melhores profissionais do mercado em um ambiente interativo e prático
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary-600 transition-all hover:bg-gray-100 hover:shadow-lg"
            >
              Tenho Interesse
            </button>
          </div>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="container-custom py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
          Por que escolher nossos cursos?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 flex justify-center">
              <GraduationCap className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Professores Qualificados</h3>
            <p className="text-gray-600">
              Profissionais atuantes no mercado com experiência prática
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 flex justify-center">
              <Users className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Turmas Reduzidas</h3>
            <p className="text-gray-600">Máximo de 15 alunos para garantir atenção personalizada</p>
          </div>

          <div className="rounded-lg bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 flex justify-center">
              <Award className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Certificado Reconhecido</h3>
            <p className="text-gray-600">Certificação válida em todo território nacional</p>
          </div>

          <div className="rounded-lg bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 flex justify-center">
              <Clock className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Horários Flexíveis</h3>
            <p className="text-gray-600">Opções de turmas durante a semana e aos sábados</p>
          </div>
        </div>
      </section>

      {/* Course Info Section */}
      <section className="bg-white py-16">
        <div className="container-custom">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Áreas de Conhecimento
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              'Desenvolvimento Frontend',
              'Desenvolvimento Backend',
              'Desenvolvimento Mobile',
              'Data Science e Analytics',
              'DevOps e Cloud',
              'Segurança da Informação',
            ].map((area) => (
              <div
                key={area}
                className="flex items-center rounded-lg border border-gray-200 p-4 transition-all hover:border-primary-600 hover:shadow-md"
              >
                <CheckCircle className="mr-3 h-6 w-6 flex-shrink-0 text-primary-600" />
                <span className="text-lg font-medium text-gray-800">{area}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-lg"
            >
              Quero me Inscrever
            </button>
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section className="container-custom py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <MessageCircle className="mx-auto mb-4 h-12 w-12 text-primary-600" />
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Ainda tem dúvidas?</h2>
            <p className="text-gray-600">
              Envie suas perguntas e nossa equipe entrará em contato em breve
            </p>
          </div>
          <DuvidasForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-white">
        <div className="container-custom text-center">
          <p className="text-gray-400">
            © 2024 Sistema de Captura de Leads. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Modal de Interesse */}
      <InteresseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LandingPage;
