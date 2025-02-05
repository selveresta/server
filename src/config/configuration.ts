import { serverConfig } from '@C/configs/server.config';
import { sqlConfig } from '@C/configs/sql.config';
import { registerAs } from '@nestjs/config';
import { IConfig } from '@T/config/config';

export const Config = registerAs<IConfig>('config', () => ({
	sql: sqlConfig(),
	server: serverConfig(),
}));
