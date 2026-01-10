import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import dataSource from '../../config/typeorm.config';
import { seedUsers } from './user.seed';
import { seedQualificacao } from './qualificacao.seed';
import { seedInteressados } from './interessados.seed';
import { seedDuvidas } from './duvidas.seed';

config();

async function runSeeds() {
  try {
    await dataSource.initialize();
    console.log('📦 Data Source initialized');

    console.log('\n🌱 Starting seeds...\n');

    // Ordem importa: Users primeiro, depois os demais
    await seedUsers(dataSource);
    await seedQualificacao(dataSource);
    await seedInteressados(dataSource);
    await seedDuvidas(dataSource);

    console.log('\n✅ All seeds completed successfully!');

    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    process.exit(1);
  }
}

runSeeds();
