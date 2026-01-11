import React, { useState } from 'react';
import { GraduationCap, Users, Award, Clock, MessageCircle } from 'lucide-react';
import InteresseModal from '../components/InteresseModal';
import DuvidasModal from '../components/DuvidasModal';

const LandingPage: React.FC = () => {
  const [isInteresseModalOpen, setIsInteresseModalOpen] = useState(false);
  const [isDuvidasModalOpen, setIsDuvidasModalOpen] = useState(false);

  return (
    <div className="bg-[#0B0B0B] text-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-8 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4 leading-tight">
          Cosmetologia Estética e Regenerativa
        </h1>

        <p className="text-base md:text-lg text-gray-300 mb-6 mx-auto">
          Formação presencial avançada em Estética Regenerativa, com foco prático, ciência aplicada e resultados reais.
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => setIsInteresseModalOpen(true)}
            className="bg-[#D4AF37] text-black px-6 py-3 font-semibold rounded hover:opacity-90 transition-opacity"
          >
            Tenho Interesse
          </button>

          <button
            onClick={() => setIsDuvidasModalOpen(true)}
            className="border border-[#D4AF37] text-[#D4AF37] px-6 py-3 rounded hover:bg-[#D4AF37] hover:text-black transition-all"
          >
            Tenho Dúvida
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-10 px-8 max-w-6xl mx-auto border-t border-gray-800">
        <h2 className="text-2xl md:text-3xl font-serif text-[#D4AF37] mb-6">
          O que você vai aprender
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="border border-gray-700 p-4 rounded-lg hover:border-[#D4AF37] transition-colors">
            <div className="mb-3 flex justify-center">
              <GraduationCap className="h-10 w-10 text-[#D4AF37]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-center">Exossomos</h3>
            <p className="text-sm text-gray-300 text-center">
              Vesículas extracelulares que transportam informações entre células, promovendo regeneração e rejuvenescimento tecidual
            </p>
          </div>

          <div className="border border-gray-700 p-4 rounded-lg hover:border-[#D4AF37] transition-colors">
            <div className="mb-3 flex justify-center">
              <Users className="h-10 w-10 text-[#D4AF37]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-center">PDRN</h3>
            <p className="text-sm text-gray-300 text-center">
              Polidesoxirribonucleotídeo que estimula a regeneração celular, melhora a cicatrização e rejuvenesce a pele
            </p>
          </div>

          <div className="border border-gray-700 p-4 rounded-lg hover:border-[#D4AF37] transition-colors">
            <div className="mb-3 flex justify-center">
              <Award className="h-10 w-10 text-[#D4AF37]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-center">Scaffold</h3>
            <p className="text-sm text-gray-300 text-center">
              Estrutura de suporte biológico que guia o crescimento e organização de novos tecidos durante a regeneração
            </p>
          </div>

          <div className="border border-gray-700 p-4 rounded-lg hover:border-[#D4AF37] transition-colors">
            <div className="mb-3 flex justify-center">
              <Clock className="h-10 w-10 text-[#D4AF37]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-center">Biohacking Tecidual</h3>
            <p className="text-sm text-gray-300 text-center">
              Técnicas avançadas de otimização biológica para regeneração e rejuvenescimento dos tecidos corporais
            </p>
          </div>
        </div>
      </section>

      {/* Practical Experience Section */}
      <section className="py-10 px-8 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="border-2 border-[#D4AF37] rounded-lg p-8 bg-gradient-to-br from-black to-gray-900">
            <h2 className="text-2xl md:text-3xl font-serif text-[#D4AF37] mb-3 leading-tight">
              1 dia inteiro de atendimento a pacientes reais aplicando as técnicas aprendidas
            </h2>
            <p className="text-base text-gray-300 mb-5">
              Experiência prática supervisionada para consolidar seu aprendizado
            </p>
            <button
              onClick={() => setIsInteresseModalOpen(true)}
              className="bg-[#D4AF37] text-black px-6 py-3 font-semibold rounded hover:opacity-90 transition-opacity"
            >
              Quero me Inscrever
            </button>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-10 px-8 max-w-6xl mx-auto border-t border-gray-800">
        <h2 className="text-2xl md:text-3xl font-serif text-[#D4AF37] mb-6 text-center">
          Corpo Docente
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Instrutor 1 */}
          <div className="border border-gray-700 rounded-lg p-5 hover:border-[#D4AF37] transition-colors">
            <h3 className="text-xl text-[#D4AF37] font-semibold mb-3">Dr. Michel Brown</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Especialista</li>
              <li>• Mestrando em HOF EUA</li>
              <li>• Professor de Espanha</li>
              <li>• Speaker e referência em HOF Regenerativa</li>
            </ul>
          </div>

          {/* Instrutor 2 */}
          <div className="border border-gray-700 rounded-lg p-5 hover:border-[#D4AF37] transition-colors">
            <h3 className="text-xl text-[#D4AF37] font-semibold mb-3">Marcel Schulman</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Farmacêutico</li>
              <li>• Cosmetólogo</li>
              <li>• Mestre pela Espanha</li>
              <li>• Coordenador de Cursos</li>
              <li>• Referência</li>
              <li>• Proprietário da Vita Derme</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Date and Location Section */}
      <section className="py-10 px-8 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 border-2 border-[#D4AF37] rounded-lg p-8">
            <h2 className="text-2xl md:text-3xl font-serif text-[#D4AF37] mb-4">
              Próxima Turma
            </h2>
            <div className="space-y-3 text-lg md:text-xl text-gray-200">
              <p className="flex items-center justify-center gap-2">
                <span className="text-2xl">📅</span>
                <span className="font-semibold">26 a 28 de março de 2026</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="text-2xl">📍</span>
                <span className="font-semibold">São Paulo – SP</span>
              </p>
              <p className="flex items-center justify-center gap-2 text-[#D4AF37]">
                <span className="text-2xl">⏳</span>
                <span className="font-semibold">Vagas Limitadas</span>
              </p>
            </div>
            <button
              onClick={() => setIsInteresseModalOpen(true)}
              className="mt-6 bg-[#D4AF37] text-black px-8 py-3 text-lg font-semibold rounded hover:opacity-90 transition-opacity"
            >
              Garanta sua Vaga
            </button>
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-10 px-8 max-w-6xl mx-auto border-t border-gray-800">
        <div className="max-w-2xl mx-auto text-center">
          <MessageCircle className="mx-auto mb-3 h-10 w-10 text-[#D4AF37]" />
          <h2 className="text-2xl md:text-3xl font-serif text-[#D4AF37] mb-3">
            Ainda tem dúvidas?
          </h2>
          <p className="text-sm text-gray-300 mb-5">
            Envie suas perguntas e nossa equipe entrará em contato em breve
          </p>
          <button
            onClick={() => setIsDuvidasModalOpen(true)}
            className="bg-[#D4AF37] text-black px-6 py-3 font-semibold rounded hover:opacity-90 transition-opacity"
          >
            Enviar Dúvida
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B0B0B] py-6 border-t border-[#D4AF37] mt-4">
        <div className="max-w-6xl mx-auto text-center px-8">
          <p className="text-sm text-gray-400">
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
