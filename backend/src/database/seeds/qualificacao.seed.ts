import { DataSource } from 'typeorm';
import { Qualificacao } from '../../modules/qualificacao/entities/qualificacao.entity';

export async function seedQualificacao(dataSource: DataSource): Promise<void> {
  const qualificacaoRepository = dataSource.getRepository(Qualificacao);

  console.log('❓ Seeding perguntas de qualificação...');

  const perguntas = [
    {
      questao: 'Qual seu nível de conhecimento em programação?',
      obrigatoriedade: true,
      opcoes: 'Iniciante;Intermediário;Avançado',
    },
    {
      questao: 'Qual sua área de interesse?',
      obrigatoriedade: true,
      opcoes: 'Frontend;Backend;Mobile;Data Science;DevOps',
    },
    {
      questao: 'Qual seu objetivo com o curso?',
      obrigatoriedade: true,
      opcoes: 'Migrar de carreira;Aprimorar conhecimentos;Começar do zero;Atualização profissional',
    },
    {
      questao: 'Você tem disponibilidade para curso presencial?',
      obrigatoriedade: true,
      opcoes: 'Sim, durante a semana;Sim, aos sábados;Sim, qualquer dia;Não tenho disponibilidade',
    },
    {
      questao: 'Como ficou sabendo do curso?',
      obrigatoriedade: false,
      opcoes: 'Google;Redes Sociais;Indicação de amigo;Anúncio;Outro',
    },
    {
      questao: 'Possui alguma observação ou dúvida adicional?',
      obrigatoriedade: false,
      opcoes: null, // Campo livre de texto
    },
  ];

  for (const perguntaData of perguntas) {
    const exists = await qualificacaoRepository.findOne({
      where: { questao: perguntaData.questao },
    });

    if (!exists) {
      const pergunta = qualificacaoRepository.create(perguntaData);
      await qualificacaoRepository.save(pergunta);
      console.log(`  ✓ Created question: ${pergunta.questao.substring(0, 50)}...`);
    } else {
      console.log(`  ⊘ Question already exists: ${perguntaData.questao.substring(0, 50)}...`);
    }
  }

  console.log('');
}
