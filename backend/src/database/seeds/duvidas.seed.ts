import { DataSource } from 'typeorm';
import { Duvida } from '../../modules/duvidas/entities/duvida.entity';
import { User } from '../../modules/users/entities/user.entity';
import { DuvidaStatus } from '../../common/enums';

export async function seedDuvidas(dataSource: DataSource): Promise<void> {
  const duvidaRepository = dataSource.getRepository(Duvida);
  const userRepository = dataSource.getRepository(User);

  console.log('💬 Seeding dúvidas...');

  // Buscar um operador para associar às respostas
  const operador = await userRepository.findOne({
    where: { email: 'maria@capturaleads.com' },
  });

  if (!operador) {
    console.log('  ⚠️  No operator found, skipping duvidas seed');
    return;
  }

  const duvidas = [
    {
      nome: 'Fernanda Alves',
      email: 'fernanda@example.com',
      celular: '11932109876',
      duvida: 'Qual a duração do curso?',
      resposta: 'O curso tem duração de 6 meses, com aulas 2 vezes por semana.',
      status: DuvidaStatus.RESPONDIDA,
    },
    {
      nome: 'Lucas Ribeiro',
      email: 'lucas@example.com',
      celular: '11921098765',
      duvida: 'Vocês aceitam cartão de crédito parcelado?',
      resposta: 'Sim! Aceitamos cartão de crédito em até 12x sem juros.',
      status: DuvidaStatus.RESPONDIDA,
    },
    {
      nome: 'Patrícia Souza',
      email: 'patricia@example.com',
      celular: '11910987654',
      duvida: 'O curso oferece certificado?',
      resposta: null,
      status: DuvidaStatus.FEITA,
    },
    {
      nome: 'Rafael Santos',
      email: 'rafael@example.com',
      celular: '11909876543',
      duvida: 'É possível fazer uma aula experimental?',
      resposta: 'Sim! Oferecemos uma aula experimental gratuita. Entre em contato para agendar.',
      status: DuvidaStatus.PROSPECT,
    },
    {
      nome: 'Camila Rocha',
      email: 'camila@example.com',
      celular: '11998765432',
      duvida: 'Quais são os horários disponíveis?',
      resposta: null,
      status: DuvidaStatus.FEITA,
    },
  ];

  for (const duvidaData of duvidas) {
    const exists = await duvidaRepository.findOne({
      where: { email: duvidaData.email, duvida: duvidaData.duvida },
    });

    if (!exists) {
      const duvida = duvidaRepository.create({
        ...duvidaData,
        criadoPor: duvidaData.status !== DuvidaStatus.FEITA ? operador.id : undefined,
      });
      await duvidaRepository.save(duvida);
      console.log(`  ✓ Created dúvida: ${duvida.nome} - ${duvida.status}`);
    } else {
      console.log(`  ⊘ Dúvida already exists: ${duvidaData.email}`);
    }
  }

  console.log('');
}
