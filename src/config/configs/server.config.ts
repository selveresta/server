import { IServerConfig } from '@T/config/config';

export const serverConfig = (): IServerConfig => ({
	port: parseInt(process.env.PORT || '3000', 10),
	logLevel: process.env.LOG_LEVEL || 'info',
	jwt_secret: process.env.JWT_SECRET || 'test_secret',
});
