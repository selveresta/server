import { IServerConfig } from 'arli_schema';

export const serverConfig = (): IServerConfig => ({
	port: parseInt(process.env.PORT || '3000', 10),
	logLevel: process.env.LOG_LEVEL || 'info',
	jwtSecret: process.env.JWT_SECRET || 'test_secret',
});
