import { DataSource } from 'typeorm';
import { Interessado } from '../../modules/interessados/entities/interessado.entity';
import { Resposta } from '../../modules/respostas/entities/resposta.entity';
import { Followup } from '../../modules/followup/entities/followup.entity';
import { User } from '../../modules/users/entities/user.entity';
import { Qualificacao } from '../../modules/qualificacao/entities/qualificacao.entity';
import { InteressadoStatus, FollowupCanal } from '../../common/enums';

export async function seedInteressados(dataSource: DataSource): Promise<void> {
  const interessadoRepository = dataSource.getRepository(Interessado);
  const respostaRepository = dataSource.getRepository(Resposta);
  const followupRepository = dataSource.getRepository(Followup);
  const userRepository = dataSource.getRepository(User);
  const qualificacaoRepository = dataSource.getRepository(Qualificacao);

  console.log('👤 Seeding interessados...');

  // Buscar um operador para associar aos follow-ups
  const operador = await userRepository.findOne({
    where: { email: 'joao@capturaleads.com' },
  });

  if (!operador) {
    console.log('  ⚠️  No operator found, skipping interessados seed');
    return;
  }

  // Buscar perguntas de qualificação
  const perguntas = await qualificacaoRepository.find({ take: 3 });

  const interessados = [
    {
      nome: 'Pedro Oliveira',
      email: 'pedro@example.com',
      celular: '11987654321',
      status: InteressadoStatus.LEAD,
      respostas: [
        { pergunta: perguntas[0]?.questao || 'Nível de conhecimento?', resposta: 'Iniciante' },
        { pergunta: perguntas[1]?.questao || 'Área de interesse?', resposta: 'Frontend' },
      ],
      followups: [],
    },
    {
      nome: 'Ana Costa',
      email: 'ana@example.com',
      celular: '11976543210',
      status: InteressadoStatus.PROSPECT,
      respostas: [
        { pergunta: perguntas[0]?.questao || 'Nível de conhecimento?', resposta: 'Intermediário' },
        { pergunta: perguntas[1]?.questao || 'Área de interesse?', resposta: 'Backend' },
      ],
      followups: [
        {
          texto: 'Primeiro contato realizado. Cliente demonstrou muito interesse no curso de Backend.',
          canal: FollowupCanal.WHATSAPP,
        },
      ],
    },
    {
      nome: 'Carlos Ferreira',
      email: 'carlos@example.com',
      celular: '11965432109',
      status: InteressadoStatus.NEGOTIATION,
      respostas: [
        { pergunta: perguntas[0]?.questao || 'Nível de conhecimento?', resposta: 'Avançado' },
        { pergunta: perguntas[1]?.questao || 'Área de interesse?', resposta: 'Data Science' },
      ],
      followups: [
        {
          texto: 'Cliente solicitou informações sobre valores e formas de pagamento.',
          canal: FollowupCanal.EMAIL,
        },
        {
          texto: 'Enviado proposta comercial. Aguardando retorno.',
          canal: FollowupCanal.EMAIL,
        },
      ],
    },
    {
      nome: 'Juliana Mendes',
      email: 'juliana@example.com',
      celular: '11954321098',
      status: InteressadoStatus.WIN,
      respostas: [
        { pergunta: perguntas[0]?.questao || 'Nível de conhecimento?', resposta: 'Iniciante' },
        { pergunta: perguntas[1]?.questao || 'Área de interesse?', resposta: 'Mobile' },
      ],
      followups: [
        {
          texto: 'Cliente confirmou matrícula! Contrato assinado.',
          canal: FollowupCanal.VOZ,
        },
      ],
    },
    {
      nome: 'Roberto Lima',
      email: 'roberto@example.com',
      celular: '11943210987',
      status: InteressadoStatus.LOST,
      respostas: [
        { pergunta: perguntas[0]?.questao || 'Nível de conhecimento?', resposta: 'Intermediário' },
        { pergunta: perguntas[1]?.questao || 'Área de interesse?', resposta: 'DevOps' },
      ],
      followups: [
        {
          texto: 'Cliente informou que não poderá se matricular no momento por questões financeiras.',
          canal: FollowupCanal.WHATSAPP,
        },
      ],
    },
  ];

  for (const interessadoData of interessados) {
    const exists = await interessadoRepository.findOne({
      where: { email: interessadoData.email },
    });

    if (!exists) {
      // Criar interessado
      const interessado = interessadoRepository.create({
        nome: interessadoData.nome,
        email: interessadoData.email,
        celular: interessadoData.celular,
        status: interessadoData.status,
        criadoPor: operador.id,
      });
      await interessadoRepository.save(interessado);

      // Criar respostas
      for (const respostaData of interessadoData.respostas) {
        const resposta = respostaRepository.create({
          interessadoId: interessado.id,
          pergunta: respostaData.pergunta,
          resposta: respostaData.resposta,
          criadoPor: operador.id,
        });
        await respostaRepository.save(resposta);
      }

      // Criar follow-ups
      for (const followupData of interessadoData.followups) {
        const followup = followupRepository.create({
          interessadoId: interessado.id,
          texto: followupData.texto,
          canal: followupData.canal,
          criadoPor: operador.id,
        });
        await followupRepository.save(followup);
      }

      console.log(`  ✓ Created interessado: ${interessado.nome} (${interessado.status})`);
    } else {
      console.log(`  ⊘ Interessado already exists: ${interessadoData.email}`);
    }
  }

  console.log('');
}
