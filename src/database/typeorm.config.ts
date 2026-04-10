import { DataSource } from 'typeorm';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';

const baseDatabaseOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'auth_api',
};

export const typeOrmOptions: TypeOrmModuleOptions = {
  ...baseDatabaseOptions,
  entities: [User],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  autoLoadEntities: true,
};

export const dataSourceOptions: DataSourceOptions = {
  ...baseDatabaseOptions,
  entities: [User],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsTableName: 'migrations',
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
