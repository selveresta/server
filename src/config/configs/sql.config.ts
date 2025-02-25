import { ISqlConfig } from 'arli_schema';
import { Dialect } from 'sequelize';

export const sqlConfig = (): ISqlConfig => ({
	dialect: <Dialect>process.env.SQL_DIALECT || 'mysql',
	host: process.env.DATABASE_HOST,
	port: +process.env.DATABASE_PORT,
	username: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	autoLoadEntities: true,
	synchronize: false,
});
