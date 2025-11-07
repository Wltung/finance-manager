import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Tải các biến môi trường từ file .env
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: true, // Bật logging để debug migration
  // Dùng glob pattern để tự động load tất cả các entity
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations', // Tên bảng lưu lịch sử migration
};

// Export một instance DataSource để CLI có thể sử dụng
const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;