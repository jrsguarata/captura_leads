import React, { useState } from 'react';
import { GraduationCap, Users, Award, Clock, MessageCircle, CheckCircle } from 'lucide-react';
import InteresseModal from '../components/InteresseModal';
import DuvidasModal from '../components/DuvidasModal';

const LandingPage: React.FC = () => {
  const [isInteresseModalOpen, setIsInteresseModalOpen] = useState(false);
  const [isDuvidasModalOpen, setIsDuvidasModalOpen] = useState(false);

  return (
    <div className="bg-[#0B0B0B] text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-8 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif text-[#D4AF37] mb-6">
          Transforme sua Carreira com Nossos Cursos Presenciais
        </h1>

        <p className="text-lg text-gray-300 max-w-2xl mb-8">
          Aprenda com os melhores profissionais do mercado em um ambiente interativo e prático
        </p>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setIsInteresseModalOpen(true)}
            className="bg-[#D4AF37] text-black px-8 py-4 text-lg font-semibold rounded hover:opacity-90 transition-opacity"
          >
            Tenho Interesse
          </button>

          <button
            onClick={() => setIsDuvidasModalOpen(true)}
            className="border border-[#D4AF37] text-[#D4AF37] px-8 py-4 text-lg rounded hover:bg-[#D4AF37] hover:text-black transition-all"
          >
            Tenho Dúvida
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif text-[#D4AF37] mb-10">
          Por que escolher nossos cursos?
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="border border-gray-700 p-6 rounded-lg hover:border-[#D4AF37] transition-colors">
            <div className="mb-4 flex justify-center">
              <GraduationCap className="h-12 w-12 text-[#D4AF37]" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-center">Exossomos</h3>
            <p className="text-gray-300 text-center">
              Vesículas extracelulares que transportam informações entre células, promovendo regeneração e rejuvenescimento tecidual
            </p>
          </div>

          <div className="border border-gray-700 p-6 rounded-lg hover:border-[#D4AF37] transition-colors">
            <div className="mb-4 flex justify-center">
              <Users className="h-12 w-12 text-[#D4AF37]" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-center">PDRN</h3>
            <p className="text-gray-300 text-center">
              Polidesoxirribonucleotídeo que estimula a regeneração celular, melhora a cicatrização e rejuvenesce a pele
            </p>
          </div>

          <div className="border border-gray-700 p-6 rounded-lg hover:border-[#D4AF37] transition-colors">
            <div className="mb-4 flex justify-center">
              <Award className="h-12 w-12 text-[#D4AF37]" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-center">Scaffold</h3>
            <p className="text-gray-300 text-center">
              Estrutura de suporte biológico que guia o crescimento e organização de novos tecidos durante a regeneração
            </p>
          </div>

          <div className="border border-gray-700 p-6 rounded-lg hover:border-[#D4AF37] transition-colors">
            <div className="mb-4 flex justify-center">
              <Clock className="h-12 w-12 text-[#D4AF37]" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-center">Biohacking Tecidual</h3>
            <p className="text-gray-300 text-center">
              Técnicas avançadas de otimização biológica para regeneração e rejuvenescimento dos tecidos corporais
            </p>
          </div>
        </div>
      </section>

      {/* Course Info Section */}
      <section className="bg-black py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif text-[#D4AF37] mb-10">
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
                className="border border-gray-700 p-6 rounded-lg hover:border-[#D4AF37] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-[#D4AF37]" />
                  <span className="text-lg text-gray-300">{area}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsInteresseModalOpen(true)}
              className="bg-[#D4AF37] text-black px-8 py-4 text-lg font-semibold rounded hover:opacity-90 transition-opacity"
            >
              Quero me Inscrever
            </button>
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-20 px-8 max-w-6xl mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <MessageCircle className="mx-auto mb-4 h-12 w-12 text-[#D4AF37]" />
          <h2 className="text-3xl font-serif text-[#D4AF37] mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-gray-300 mb-8">
            Envie suas perguntas e nossa equipe entrará em contato em breve
          </p>
          <button
            onClick={() => setIsDuvidasModalOpen(true)}
            className="bg-[#D4AF37] text-black px-8 py-4 text-lg font-semibold rounded hover:opacity-90 transition-opacity"
          >
            Enviar Dúvida
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B0B0B] py-8 border-t border-[#D4AF37]">
        <div className="max-w-6xl mx-auto text-center px-8">
          <p className="text-gray-400">
            © 2024 Sistema de Captura de Leads. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Modais */}
      <InteresseModal isOpen={isInteresseModalOpen} onClose={() => setIsInteresseModalOpen(false)} />
      <DuvidasModal isOpen={isDuvidasModalOpen} onClose={() => setIsDuvidasModalOpen(false)} />
    </div>
  );
};

export default LandingPage;
