import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';
import { UserRole } from '../../common/enums';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  console.log('👥 Seeding users...');

  const users = [
    {
      nome: 'Administrador do Sistema',
      email: 'admin@capturaleads.com',
      password: await bcrypt.hash('admin123', 10),
      perfil: UserRole.ADMIN,
      isActive: true,
    },
    {
      nome: 'João Silva',
      email: 'joao@capturaleads.com',
      password: await bcrypt.hash('operador123', 10),
      perfil: UserRole.OPERATOR,
      isActive: true,
    },
    {
      nome: 'Maria Santos',
      email: 'maria@capturaleads.com',
      password: await bcrypt.hash('operador123', 10),
      perfil: UserRole.OPERATOR,
      isActive: true,
    },
  ];

  for (const userData of users) {
    const exists = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!exists) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`  ✓ Created user: ${user.email} (${user.perfil})`);
    } else {
      console.log(`  ⊘ User already exists: ${userData.email}`);
    }
  }

  console.log('');
}
