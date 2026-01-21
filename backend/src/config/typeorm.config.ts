import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const getDatabaseConfig = (): DataSourceOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Heroku provides DATABASE_URL in production
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/database/migrations/*.js'],
      synchronize: false,
      logging: false,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    };
  }

  // Local development uses individual environment variables
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'captura_leads',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/database/migrations/*.js'],
    synchronize: false,
    logging: !isProduction,
  };
};

export const dataSourceOptions: DataSourceOptions = getDatabaseConfig();

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
