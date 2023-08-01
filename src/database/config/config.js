import dotenv from 'dotenv';
dotenv.config();
export default {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
    logging: false,
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
  },
}
